export interface GameArticle {
  content: string;
  country: string;
  language: string;
  year: number;
}

const WIKI_POOL = [
  { lang: "ar", country: "Morocco", language: "Arabic" },
  { lang: "ar", country: "Egypt", language: "Arabic" },
  { lang: "ja", country: "Japan", language: "Japanese" },
  { lang: "fr", country: "France", language: "French" },
  { lang: "de", country: "Germany", language: "German" },
  { lang: "es", country: "Spain", language: "Spanish" },
  { lang: "es", country: "Mexico", language: "Spanish" },
  { lang: "pt", country: "Brazil", language: "Portuguese" },
  { lang: "ko", country: "South Korea", language: "Korean" },
  { lang: "zh", country: "China", language: "Chinese" },
  { lang: "ru", country: "Russia", language: "Russian" },
  { lang: "tr", country: "Turkey", language: "Turkish" },
  { lang: "sv", country: "Sweden", language: "Swedish" },
  { lang: "it", country: "Italy", language: "Italian" },
  { lang: "hi", country: "India", language: "Hindi" },
  { lang: "th", country: "Thailand", language: "Thai" },
  { lang: "fa", country: "Iran", language: "Persian" },
  { lang: "nl", country: "Netherlands", language: "Dutch" },
  { lang: "pl", country: "Poland", language: "Polish" },
  { lang: "uk", country: "Ukraine", language: "Ukrainian" },
  { lang: "he", country: "Israel", language: "Hebrew" },
  { lang: "id", country: "Indonesia", language: "Indonesian" },
  { lang: "vi", country: "Vietnam", language: "Vietnamese" },
  { lang: "cs", country: "Czech Republic", language: "Czech" },
  { lang: "ro", country: "Romania", language: "Romanian" },
];

const TOTAL_ROUNDS = 10;
const MIN_LENGTH = 250;
const MAX_LENGTH = 700;

async function fetchRandomWikiSummary(lang: string): Promise<string | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(
        `https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`,
        {
          headers: { "User-Agent": "GenGuessr/1.0 (educational game)" },
          signal: AbortSignal.timeout(6000),
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const extract: string = data.extract ?? "";
      if (extract.length >= MIN_LENGTH) {
        return extract.slice(0, MAX_LENGTH);
      }
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return null;
}

export async function fetchGameArticles(): Promise<GameArticle[]> {
  const shuffled = [...WIKI_POOL].sort(() => Math.random() - 0.5);
  const articles: GameArticle[] = [];
  const usedLangs = new Set<string>();

  for (const entry of shuffled) {
    if (articles.length >= TOTAL_ROUNDS) break;
    if (usedLangs.has(entry.lang)) continue;

    const content = await fetchRandomWikiSummary(entry.lang);
    if (content) {
      articles.push({
        content,
        country: entry.country,
        language: entry.language,
        year: new Date().getFullYear(),
      });
      usedLangs.add(entry.lang);
    }
  }

  return articles;
}
