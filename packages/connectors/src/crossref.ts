import type { EvidenceRecord } from "@itrust/shared";
import { fetchJson } from "./http.js";

type CrossrefItem = {
  DOI: string;
  title?: string[];
  issued?: { "date-parts"?: number[][] };
  publisher?: string;
  URL?: string;
};

type CrossrefMessage = {
  items?: CrossrefItem[];
};

type CrossrefResponse = {
  message?: CrossrefMessage;
};

function scoreFromIndex(index: number, limit: number): number {
  return Math.max(0.15, 1 - index / Math.max(limit, 1));
}

export async function searchCrossref(
  query: string,
  limit: number,
): Promise<EvidenceRecord[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://api.crossref.org/works?query=${encoded}&rows=${limit}`;
  const data = await fetchJson<CrossrefResponse>(url);
  const items = data.message?.items ?? [];
  return items.map((item, index) => {
    const title = item.title?.[0] ?? item.DOI;
    const year = item.issued?.["date-parts"]?.[0]?.[0];
    const citationUrl = item.URL ?? `https://doi.org/${item.DOI}`;
    return {
      id: `crossref:${item.DOI}`,
      sourceType: "academic_crossref",
      title,
      claimSnippet: `${title}${item.publisher ? ` — ${item.publisher}` : ""}`,
      citationUrl,
      publisher: item.publisher,
      publishedAt: year ? `${year}-01-01T00:00:00.000Z` : undefined,
      relevanceScore: scoreFromIndex(index, limit),
      trustSignals: { officialPublisher: true },
    };
  });
}
