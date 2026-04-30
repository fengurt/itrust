import { ResponseCache } from "@itrust/data-cache";
import type { EvidenceRecord } from "@itrust/shared";
import { searchArxiv } from "./arxiv.js";
import { searchCrossref } from "./crossref.js";
import { searchHackerNewsStories } from "./hackernews.js";
import { searchOpenAlex } from "./openalex.js";
import { searchWorldBankIndicators } from "./worldBank.js";

const cache = new ResponseCache<EvidenceRecord[]>({
  maxEntries: 200,
  defaultTtlMs: 120_000,
});

export async function searchAcademicCombined(
  query: string,
  limit: number,
): Promise<EvidenceRecord[]> {
  const key = cache.makeKey(["academic", query, String(limit)]);
  const hit = cache.get(key);
  if (hit) {
    return hit;
  }
  const perSource = Math.max(3, Math.ceil(limit / 3));
  const [openAlex, crossref, arxiv] = await Promise.all([
    searchOpenAlex(query, perSource).catch(() => []),
    searchCrossref(query, perSource).catch(() => []),
    searchArxiv(query, perSource).catch(() => []),
  ]);
  const merged = [...openAlex, ...crossref, ...arxiv]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
  cache.set(key, merged);
  return merged;
}

export async function searchRealWorldCombined(
  query: string,
  limit: number,
): Promise<EvidenceRecord[]> {
  const key = cache.makeKey(["realworld", query, String(limit)]);
  const hit = cache.get(key);
  if (hit) {
    return hit;
  }
  const half = Math.max(2, Math.ceil(limit / 2));
  const [wb, hn] = await Promise.all([
    searchWorldBankIndicators(query, half).catch(() => []),
    searchHackerNewsStories(query, half).catch(() => []),
  ]);
  const merged = [...wb, ...hn]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
  cache.set(key, merged);
  return merged;
}

export { searchOpenAlex, searchCrossref, searchArxiv };
export { searchWorldBankIndicators, searchHackerNewsStories };
export {
  searchUploads,
  appendUploadManifestRecord,
  saveUploadFile,
  loadUploadManifestRecords,
  getUploadRecordById,
} from "./uploads.js";
