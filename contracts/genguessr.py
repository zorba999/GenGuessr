# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json
import typing

ARTICLES = [
    {
        "id": 0,
        "content": "As the sambadrome filled with thousands of spectators, the parade entered its second hour under a canopy of electric lights. The float, adorned with golden feathers and representing the mythological origins of the river basin, was cheered on by the estimated 70,000 people lining the avenue. This year's competition featured a dozen schools, each with nearly 3,000 performers. Local vendors sold grilled corn and chilled coconut water to the crowds while children danced alongside the procession.",
        "country": "Brazil",
        "language": "English",
        "year": 2020,
    },
    {
        "id": 1,
        "content": "今年の桜の開花予想は例年より約1週間早く、3月下旬には満開になると気象庁が発表した。東京の上野公園では、すでに花見の場所取りをする人々の姿が見られ、週末には数万人が訪れると予想されている。今年は特に温暖な冬の影響で、梅の花も早くに咲き終わり、春の訪れを告げる花々が次々と咲き始めている。",
        "country": "Japan",
        "language": "Japanese",
        "year": 2023,
    },
    {
        "id": 2,
        "content": "استقطبت السهرة الفنية المقامة في ساحة جامع الفنا أعداداً كبيرة من السياح والمواطنين، حيث تناوب على الأداء عدد من الفنانين الشباب إلى جانب أسماء راسخة في الفن الأصيل. وقد أضفت الإضاءة الخافتة والرياح الخفيفة القادمة من جبال الأطلس على المكان أجواءً مميزة.",
        "country": "Morocco",
        "language": "Arabic",
        "year": 2022,
    },
    {
        "id": 3,
        "content": "Die Bundesregierung hat angekündigt, die Förderung für Elektrofahrzeuge um weitere zwei Jahre zu verlängern, nachdem die Nachfrage im letzten Quartal um 34 Prozent gestiegen ist. Mehrere Automobilhersteller aus dem Stuttgarter Raum begrüßten die Entscheidung und kündigten an, ihre Produktionskapazitäten für Elektromodelle bis 2025 zu verdoppeln.",
        "country": "Germany",
        "language": "German",
        "year": 2022,
    },
    {
        "id": 4,
        "content": "Durante las festividades del 2 de noviembre, los cementerios se llenaron de flores de cempasúchil y el aroma del copal inundó las calles empedradas del centro histórico. Familias enteras montaron ofrendas con fotografías de los difuntos, pan de muerto y bebidas que en vida disfrutaban sus seres queridos.",
        "country": "Mexico",
        "language": "Spanish",
        "year": 2021,
    },
    {
        "id": 5,
        "content": "Le marché de Noël de la place de la République accueille cette année plus de deux cents exposants venus de toute la région. Entre les stands de vin chaud et de foie gras, les familles se pressaient devant les étalages de jouets en bois artisanal. Le maire a inauguré l'événement en soulignant l'importance de soutenir les producteurs locaux.",
        "country": "France",
        "language": "French",
        "year": 2023,
    },
    {
        "id": 6,
        "content": "The Afrobeats concert at the amphitheatre drew a capacity crowd of over fifteen thousand, with fans travelling from neighbouring states to witness the headline performance. The artist, whose debut album topped charts across the continent, delivered a two-hour set mixing highlife classics with contemporary sounds. Street vendors outside sold suya and chilled drinks to the long queues.",
        "country": "Nigeria",
        "language": "English",
        "year": 2022,
    },
    {
        "id": 7,
        "content": "With the monsoon season delayed by nearly three weeks, farmers in the central plateau were forced to rely on irrigation canals that had already begun to run low. Meanwhile, the national cricket team's preparations for the upcoming tour were disrupted when the training facility in the eastern city reported flooding from a separate localised storm.",
        "country": "India",
        "language": "English",
        "year": 2023,
    },
    {
        "id": 8,
        "content": "새벽 두 시, 강남의 한 연습실에서는 여섯 명의 연습생들이 땀을 흘리며 안무를 반복하고 있었다. 데뷔까지 남은 시간이 이제 한 달도 채 되지 않았다. 소속사 관계자는 이번 그룹은 글로벌 팬덤을 겨냥한 콘셉트로 준비됐으며, 첫 앨범은 한국어와 영어 트랙을 함께 수록할 예정이라고 밝혔다.",
        "country": "South Korea",
        "language": "Korean",
        "year": 2022,
    },
    {
        "id": 9,
        "content": "Tras la victoria en la final del torneo, la ciudad entera salió a las calles en una celebración que duró hasta el amanecer. El capitán del equipo, que jugó lesionado durante los últimos veinte minutos del partido, fue cargado en hombros por sus compañeros. El presidente de la nación declaró el lunes siguiente como feriado nacional.",
        "country": "Argentina",
        "language": "Spanish",
        "year": 2022,
    },
    {
        "id": 10,
        "content": "The city council voted seven to four to extend the bike lane network through the downtown corridor, overriding objections from business owners who claimed the removal of parking spaces would hurt foot traffic. The cycling advocacy group celebrated outside city hall, noting that the expansion would connect three previously isolated neighbourhoods to the rapid transit system.",
        "country": "Canada",
        "language": "English",
        "year": 2023,
    },
    {
        "id": 11,
        "content": "Con el precio del café arábica rozando máximos históricos en los mercados internacionales, los cultivadores de las laderas andinas reportaron un incremento del 28% en sus ingresos. La cooperativa regional, que agrupa a más de cuatro mil familias productoras, anunció la apertura de una nueva planta de procesamiento que permitirá agregar valor antes de la exportación.",
        "country": "Colombia",
        "language": "Spanish",
        "year": 2022,
    },
    {
        "id": 12,
        "content": "随着人工智能技术的飞速发展，该市的科技园区今年新增注册企业超过三百家，吸引外资逾四十亿元。园区管委会主任在新闻发布会上表示，重点扶持方向包括大模型应用、智能制造和自动驾驶三大领域。",
        "country": "China",
        "language": "Chinese",
        "year": 2023,
    },
    {
        "id": 13,
        "content": "Boğaz'ın iki yakasını birbirine bağlayan köprü, bayram tatilinin ilk günü tarihi bir araç yoğunluğuna sahne oldu. Trafik müdürlüğü açıkladığı verilere göre, sabah altı ile öğlen on iki arasında geçiş yapan araç sayısı geçen yılın aynı dönemine göre yüzde kırk iki artış gösterdi.",
        "country": "Turkey",
        "language": "Turkish",
        "year": 2022,
    },
    {
        "id": 14,
        "content": "Det statliga energibolaget tillkännagav att landets sista kolkraftverk officiellt stängdes vid midnatt, vilket gör landet till ett av de första i världen att helt avveckla sin kolbaserade elproduktion. Miljöministern betonade att detta var ett historiskt ögonblick för klimatomställningen.",
        "country": "Sweden",
        "language": "Swedish",
        "year": 2022,
    },
    {
        "id": 15,
        "content": "وأفادت وكالة الأنباء الرسمية بأن مشروع المدينة الاقتصادية شهد خلال الربع الأخير إبرام عقود بقيمة تجاوزت المليار دولار مع شركات دولية متخصصة في البنية التحتية الذكية. وتأتي هذه التطورات في سياق مساعي التنويع الاقتصادي الرامية إلى تقليص الاعتماد على عائدات النفط.",
        "country": "Saudi Arabia",
        "language": "Arabic",
        "year": 2023,
    },
    {
        "id": 16,
        "content": "The national electricity grid operator declared a Stage 4 load shedding alert for the entire week, warning households and businesses to expect up to twelve hours without power daily. The crisis, attributed to unplanned outages at several coal power stations, prompted opposition parties to call for an emergency parliamentary session.",
        "country": "South Africa",
        "language": "English",
        "year": 2023,
    },
    {
        "id": 17,
        "content": "Le festival annuel de gnawa a réuni cette année des musiciens venus de plusieurs continents pour des nuits de transe et de rituel dans les riads de la médina. Les maâlems, gardiens de cette tradition pluriséculaire, ont partagé la scène avec des artistes de jazz et de soul dans des fusions inédites acclamées par le public.",
        "country": "Morocco",
        "language": "French",
        "year": 2022,
    },
    {
        "id": 18,
        "content": "La estación de esquí registró su temporada más concurrida en una década, con más de cuatrocientos mil visitantes entre diciembre y marzo. Las autoridades regionales atribuyeron el éxito a la excepcional nevada de principios de invierno y a la mejora de las conexiones de transporte desde la capital. Los negocios locales reportaron ingresos récord.",
        "country": "Spain",
        "language": "Spanish",
        "year": 2023,
    },
    {
        "id": 19,
        "content": "Thousands lined the streets for the annual independence celebration, a tradition that has marked this date since the country gained sovereignty. Steel pan bands from every district competed for the national trophy while masquerade troupes performed in costumes that had taken months to prepare. The minister of culture announced a new grant program to fund youth participation in traditional arts.",
        "country": "Trinidad and Tobago",
        "language": "English",
        "year": 2022,
    },
]

TOTAL_ROUNDS = 3


def _select_articles(room_id: str) -> list:
    h = 0
    for c in room_id:
        h = (h * 31 + ord(c)) & 0xFFFFFFFF
    n = len(ARTICLES)
    indices = []
    offset = 0
    while len(indices) < TOTAL_ROUNDS:
        idx = (h + offset * 7) % n
        if idx not in indices:
            indices.append(idx)
        offset += 1
    return indices


class GenGuessr(gl.Contract):
    rooms: TreeMap[str, str]
    guesses: TreeMap[str, str]
    leaderboard: TreeMap[str, u64]

    def __init__(self) -> None:
        pass

    @gl.public.write
    def create_room(self, room_id: str, host_name: str) -> None:
        article_indices = _select_articles(room_id)
        room_data = {
            "room_id": room_id,
            "host": host_name,
            "players": [host_name],
            "phase": "waiting",
            "current_round": 0,
            "total_rounds": TOTAL_ROUNDS,
            "article_indices": article_indices,
            "total_scores": {},
        }
        self.rooms[room_id] = json.dumps(room_data)

    @gl.public.write
    def join_room(self, room_id: str, player_name: str) -> None:
        room_data = json.loads(self.rooms[room_id])
        if room_data["phase"] != "waiting":
            raise Exception("Game already started")
        if player_name not in room_data["players"]:
            room_data["players"].append(player_name)
        self.rooms[room_id] = json.dumps(room_data)

    @gl.public.write
    def start_game(self, room_id: str) -> None:
        room_data = json.loads(self.rooms[room_id])
        if room_data["phase"] != "waiting":
            raise Exception("Game not in waiting phase")
        room_data["phase"] = "playing"
        self.rooms[room_id] = json.dumps(room_data)

    @gl.public.write
    def submit_guess(
        self,
        room_id: str,
        player_name: str,
        country: str,
        language: str,
        year: int,
    ) -> None:
        room_data = json.loads(self.rooms[room_id])
        if room_data["phase"] != "playing":
            raise Exception("Not in playing phase")
        round_num = room_data["current_round"]
        key = f"{room_id}:{round_num}:{player_name}"
        guess_data = {
            "country": country,
            "language": language,
            "year": year,
            "evaluated": False,
            "country_score": 0,
            "language_score": 0,
            "year_score": 0,
            "total_score": 0,
        }
        self.guesses[key] = json.dumps(guess_data)

    @gl.public.write
    def evaluate_round(self, room_id: str) -> None:
        room_data = json.loads(self.rooms[room_id])
        if room_data["phase"] != "playing":
            return
        room_data["phase"] = "scoring"
        self.rooms[room_id] = json.dumps(room_data)

        round_num = room_data["current_round"]
        article_idx = room_data["article_indices"][round_num]
        article = ARTICLES[article_idx]
        players = room_data["players"]

        player_guesses = []
        for player in players:
            key = f"{room_id}:{round_num}:{player}"
            if key in self.guesses:
                g = json.loads(self.guesses[key])
                player_guesses.append(
                    {"player": player, "country": g["country"], "language": g["language"], "year": g["year"]}
                )

        if not player_guesses:
            room_data["phase"] = "round_results"
            self.rooms[room_id] = json.dumps(room_data)
            return

        guesses_str = json.dumps(player_guesses)
        actual_country = article["country"]
        actual_language = article["language"]
        actual_year = article["year"]

        def nondet() -> str:
            task = f"""You are scoring a geography guessing game. Score each player's guess against the actual article metadata.

Actual article metadata:
- Country: {actual_country}
- Language: {actual_language}
- Year: {actual_year}

Players' guesses:
{guesses_str}

Scoring rules (be strict and consistent):
- country_score: 100 if correct country (account for name variations like "Brasil"="Brazil", "Deutschland"="Germany"), 40 if same geographic region/subcontinent, 0 otherwise
- language_score: 100 if correct language (account for variations like "Portugues"="Portuguese", "Francais"="French"), 0 otherwise
- year_score: 100 if exact year, 80 if ±1 year, 60 if ±2 years, 40 if ±3 years, 20 if ±5 years, 0 if more than 5 years off
- total: sum of the three scores above (max 300)

Return ONLY valid JSON with no extra text:
{{"scores": [{{"player": "name", "country_score": 0, "language_score": 0, "year_score": 0, "total": 0}}]}}"""
            result = gl.nondet.exec_prompt(task)
            result = result.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(result)
            normalized = sorted(parsed["scores"], key=lambda x: x["player"])
            return json.dumps({"scores": normalized}, sort_keys=True)

        scores_result = json.loads(gl.eq_principle.strict_eq(nondet))

        total_scores = room_data.get("total_scores", {})
        round_results = {}

        for score_entry in scores_result["scores"]:
            player = score_entry["player"]
            round_num_key = f"{room_id}:{round_num}:{player}"
            if round_num_key in self.guesses:
                g = json.loads(self.guesses[round_num_key])
                g["country_score"] = score_entry["country_score"]
                g["language_score"] = score_entry["language_score"]
                g["year_score"] = score_entry["year_score"]
                g["total_score"] = score_entry["total"]
                g["evaluated"] = True
                self.guesses[round_num_key] = json.dumps(g)

            if player not in total_scores:
                total_scores[player] = 0
            total_scores[player] = total_scores[player] + score_entry["total"]
            round_results[player] = score_entry["total"]

        room_data["total_scores"] = total_scores
        room_data["last_round_scores"] = round_results
        room_data["last_round_article_id"] = article_idx

        next_round = round_num + 1
        if next_round >= TOTAL_ROUNDS:
            room_data["phase"] = "results"
            for player, score in total_scores.items():
                current_xp = int(self.leaderboard[player]) if player in self.leaderboard else 0
                self.leaderboard[player] = u64(current_xp + score)
        else:
            room_data["current_round"] = next_round
            room_data["phase"] = "round_results"

        self.rooms[room_id] = json.dumps(room_data)

    @gl.public.write
    def next_round(self, room_id: str) -> None:
        room_data = json.loads(self.rooms[room_id])
        if room_data["phase"] != "round_results":
            raise Exception("Not in round_results phase")
        room_data["phase"] = "playing"
        self.rooms[room_id] = json.dumps(room_data)

    @gl.public.view
    def get_room_state(self, room_id: str) -> typing.Any:
        if room_id not in self.rooms:
            return None
        return json.loads(self.rooms[room_id])

    @gl.public.view
    def get_article_content(self, room_id: str) -> typing.Any:
        if room_id not in self.rooms:
            return None
        room_data = json.loads(self.rooms[room_id])
        round_num = room_data["current_round"]
        article_idx = room_data["article_indices"][round_num]
        article = ARTICLES[article_idx]
        return {
            "content": article["content"],
            "round": round_num + 1,
            "total_rounds": TOTAL_ROUNDS,
        }

    @gl.public.view
    def get_round_results(self, room_id: str, round_num: int) -> typing.Any:
        room_data = json.loads(self.rooms[room_id])
        players = room_data["players"]
        article_idx = room_data["article_indices"][round_num]
        article = ARTICLES[article_idx]
        results = []
        for player in players:
            key = f"{room_id}:{round_num}:{player}"
            if key in self.guesses:
                g = json.loads(self.guesses[key])
                results.append(
                    {
                        "player": player,
                        "country": g["country"],
                        "language": g["language"],
                        "year": g["year"],
                        "country_score": g["country_score"],
                        "language_score": g["language_score"],
                        "year_score": g["year_score"],
                        "total_score": g["total_score"],
                    }
                )
        return {
            "results": results,
            "actual": {
                "country": article["country"],
                "language": article["language"],
                "year": article["year"],
            },
        }

    @gl.public.view
    def get_leaderboard(self, top_n: u64) -> typing.Any:
        entries = []
        for player in self.leaderboard:
            entries.append({"player": player, "xp": int(self.leaderboard[player])})
        entries.sort(key=lambda x: x["xp"], reverse=True)
        return entries[:int(top_n)]
