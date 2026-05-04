# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json
import typing


class GenGuessr(gl.Contract):
    guesses: TreeMap[str, str]
    results: TreeMap[str, str]
    leaderboard: TreeMap[str, u64]

    def __init__(self) -> None:
        pass

    @gl.public.write
    def submit_guess(
        self,
        room_id: str,
        round_num: int,
        player_name: str,
        country: str,
        language: str,
        year: int,
    ) -> None:
        key = f"{room_id}:{round_num}:{player_name}"
        guess_data = {
            "country": country,
            "language": language,
            "year": year,
        }
        self.guesses[key] = json.dumps(guess_data)

    @gl.public.write
    def evaluate_round(
        self,
        room_id: str,
        round_num: int,
        actual_country: str,
        actual_language: str,
        actual_year: int,
        players_json: str,
    ) -> None:
        players_data = json.loads(players_json)

        player_guesses = []
        for item in players_data:
            if isinstance(item, dict) and "country" in item:
                player_guesses.append({
                    "player": item["player"],
                    "country": item["country"],
                    "language": item["language"],
                    "year": item.get("year", 0),
                })
            else:
                player = str(item)
                key = f"{room_id}:{round_num}:{player}"
                if key in self.guesses:
                    g = json.loads(self.guesses[key])
                    player_guesses.append({
                        "player": player,
                        "country": g["country"],
                        "language": g["language"],
                        "year": g["year"],
                    })

        if not player_guesses:
            return

        guesses_str = json.dumps(player_guesses)

        def nondet() -> str:
            task = f"""Score this geography guessing game. Return ONLY valid JSON.

Actual metadata:
- Country: {actual_country}
- Language: {actual_language}
- Year: {actual_year}

Players' guesses:
{guesses_str}

Scoring rules:
- country_score: 100 if same country (allow name variations e.g. "Brasil"="Brazil"), 40 if same region/continent, 0 otherwise
- language_score: 100 if same language (allow variations e.g. "Portugues"="Portuguese"), 0 otherwise
- year_score: 100 if exact, 80 if ±1, 60 if ±2, 40 if ±3, 20 if ±5, 0 if >5 years off
- total: sum of all three

Return ONLY this JSON, nothing else:
{{"scores": [{{"player": "name", "country_score": 0, "language_score": 0, "year_score": 0, "total": 0}}]}}"""
            result = gl.nondet.exec_prompt(task)
            result = result.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(result)
            normalized = sorted(parsed["scores"], key=lambda x: x["player"])
            return json.dumps({"scores": normalized}, sort_keys=True)

        scores_result = json.loads(gl.eq_principle.strict_eq(nondet))

        round_results = {}
        for score_entry in scores_result["scores"]:
            player = score_entry["player"]
            key = f"{room_id}:{round_num}:{player}"
            if key in self.guesses:
                g = json.loads(self.guesses[key])
                g["country_score"] = score_entry["country_score"]
                g["language_score"] = score_entry["language_score"]
                g["year_score"] = score_entry["year_score"]
                g["total_score"] = score_entry["total"]
                self.guesses[key] = json.dumps(g)

            round_results[player] = score_entry["total"]

            xp = int(self.leaderboard[player]) if player in self.leaderboard else 0
            self.leaderboard[player] = u64(xp + score_entry["total"])

        results_key = f"{room_id}:{round_num}"
        self.results[results_key] = json.dumps({
            "scores": scores_result["scores"],
            "actual": {
                "country": actual_country,
                "language": actual_language,
                "year": actual_year,
            },
        })

    @gl.public.view
    def get_round_results(self, room_id: str, round_num: int) -> typing.Any:
        key = f"{room_id}:{round_num}"
        if key not in self.results:
            return None
        return json.loads(self.results[key])

    @gl.public.view
    def get_guess(self, room_id: str, round_num: int, player_name: str) -> typing.Any:
        key = f"{room_id}:{round_num}:{player_name}"
        if key not in self.guesses:
            return None
        return json.loads(self.guesses[key])

    @gl.public.view
    def get_leaderboard(self, top_n: u64) -> typing.Any:
        entries = []
        for player in self.leaderboard:
            entries.append({"player": player, "xp": int(self.leaderboard[player])})
        entries.sort(key=lambda x: x["xp"], reverse=True)
        return entries[:int(top_n)]
