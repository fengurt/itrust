import type { EvidenceRecord } from "@itrust/shared";
import { fetchJson } from "./http.js";

type HnItem = {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  time?: number;
};

function scoreFromIndex(index: number, limit: number): number {
  return Math.max(0.12, 1 - index / Math.max(limit, 1));
}

export async function searchHackerNewsStories(
  query: string,
  limit: number,
): Promise<EvidenceRecord[]> {
  const storyIds = await fetchJson<number[]>(
    "https://hacker-news.firebaseio.com/v0/newstories.json",
  );
  const selectedIds = storyIds.slice(0, Math.min(60, storyIds.length));
  const lowered = query.toLowerCase();
  const items: HnItem[] = [];
  for (const id of selectedIds) {
    if (items.length >= limit * 3) {
      break;
    }
    const item = await fetchJson<HnItem>(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
    );
    if (item?.title?.toLowerCase().includes(lowered)) {
      items.push(item);
    }
  }
  const trimmed = items.slice(0, limit);
  return trimmed.map((item, index) => ({
    id: `hn:${item.id}`,
    sourceType: "realworld_news",
    title: item.title ?? `Story ${item.id}`,
    claimSnippet: item.title ?? "",
    citationUrl: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
    publisher: "Hacker News",
    publishedAt: item.time
      ? new Date(item.time * 1000).toISOString()
      : undefined,
    relevanceScore: scoreFromIndex(index, limit),
    trustSignals: { peerReviewed: false, officialPublisher: false },
  }));
}
