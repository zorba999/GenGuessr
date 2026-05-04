export type GamePhase =
  | "waiting"
  | "playing"
  | "scoring"
  | "round_results"
  | "results";

export interface RoomState {
  room_id: string;
  host: string;
  players: string[];
  phase: GamePhase;
  current_round: number;
  total_rounds: number;
  article_indices: number[];
  total_scores: Record<string, number>;
  last_round_scores?: Record<string, number>;
  last_round_article_id?: number;
  wiki_articles?: { content: string; country: string; language: string; year: number }[];
}

export interface ArticleContent {
  content: string;
  round: number;
  total_rounds: number;
}

export interface PlayerGuess {
  country: string;
  language: string;
  year: number;
  evaluated: boolean;
  country_score: number;
  language_score: number;
  year_score: number;
  total_score: number;
}

export interface RoundResult {
  player: string;
  country: string;
  language: string;
  year: number;
  country_score: number;
  language_score: number;
  year_score: number;
  total_score: number;
}

export interface RoundResultsData {
  results: RoundResult[];
  actual: {
    country: string;
    language: string;
    year: number;
  };
}

export interface LeaderboardEntry {
  player: string;
  xp: number;
}
