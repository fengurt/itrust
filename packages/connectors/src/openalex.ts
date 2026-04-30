import type { EvidenceRecord } from "@itrust/shared";
import { fetchJson } from "./http.js";

type OpenAlexWork = {
  id: string;
  title?: string;
  publication_year?: number;
  primary_location?: { source?: { display_name?: string } };
  best_oa_location?: { landing_page_url?: string };
};

type OpenAlexResponse = {
  results?: OpenAlexWork[];
};

function scoreFromIndex(index: number, limit: number): number {
  return Math.max(0.15, 1 - index / Math.max(limit, 1));
}

export async function searchOpenAlex(
  query: string,
  limit: number,
): Promise<EvidenceRecord[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://api.openalex.org/works?search=${encoded}&per_page=${limit}`;
  const data = await fetchJson<OpenAlexResponse>(url);
  const results = data.results ?? [];
  return results.map((work, index) => {
    const title = work.title ?? "Untitled work";
    const year = work.publication_year;
    const publisher = work.primary_location?.source?.display_name;
    const urlLanding =
      work.best_oa_location?.landing_page_url ?? `https://openalex.org/${work.id}`;
    return {
      id: `openalex:${work.id}`,
      sourceType: "academic_openalex",
      title,
      claimSnippet: `${title}${publisher ? ` — ${publisher}` : ""}${year ? ` (${year})` : ""}`,
      citationUrl: urlLanding,
      publisher,
      publishedAt: year ? `${year}-01-01T00:00:00.000Z` : undefined,
      relevanceScore: scoreFromIndex(index, limit),
      trustSignals: { officialPublisher: Boolean(publisher) },
    };
  });
}
