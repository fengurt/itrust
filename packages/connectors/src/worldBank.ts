import type { EvidenceRecord } from "@itrust/shared";
import { fetchJson } from "./http.js";

type WbRow = {
  indicator?: { value?: string; id?: string };
  country?: { value?: string; id?: string };
  date?: string;
  value?: number | null;
};

type WbResponse = [{ page: number; pages: number }, WbRow[]];

function scoreFromIndex(index: number, limit: number): number {
  return Math.max(0.15, 1 - index / Math.max(limit, 1));
}

export async function searchWorldBankIndicators(
  query: string,
  limit: number,
): Promise<EvidenceRecord[]> {
  const url = `https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=${limit}&MRV=1`;
  const data = await fetchJson<WbResponse>(url);
  const rows = Array.isArray(data) ? data[1] ?? [] : [];
  const filtered = rows
    .filter((row) => row.country?.value?.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit);
  const useRows = filtered.length > 0 ? filtered : rows.slice(0, limit);
  return useRows.map((row, index) => {
    const country = row.country?.value ?? "Unknown";
    const date = row.date ?? "";
    const value = row.value;
    const title = `World Bank — ${country} (${date})`;
    const snippet =
      value === null || value === undefined
        ? `GDP growth series match for query “${query}”.`
        : `GDP growth (annual %) for ${country} in ${date}: ${value}.`;
    return {
      id: `wb:${row.country?.id ?? country}:${date}`,
      sourceType: "realworld_public_data",
      title,
      claimSnippet: snippet,
      citationUrl: `https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG?locations=${row.country?.id ?? ""}`,
      publisher: "World Bank",
      publishedAt: date ? `${date}-01-01T00:00:00.000Z` : undefined,
      relevanceScore: scoreFromIndex(index, limit),
      trustSignals: { officialPublisher: true },
    };
  });
}
