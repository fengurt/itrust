import { createReadStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import type { EvidenceRecord } from "@itrust/shared";

export type UploadManifestRecord = {
  id: string;
  title: string;
  text: string;
};

function scoreFromIndex(index: number, limit: number): number {
  return Math.max(0.2, 1 - index / Math.max(limit, 1));
}

function snippetAroundQuery(text: string, query: string, maxLen: number): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) {
    return text.slice(0, maxLen);
  }
  const start = Math.max(0, idx - 80);
  return text.slice(start, start + maxLen);
}

export async function getUploadRecordById(
  dataDir: string,
  uploadId: string,
): Promise<UploadManifestRecord | undefined> {
  const manifestPath = path.join(dataDir, "manifest.jsonl");
  const records = await loadUploadManifestRecords(manifestPath);
  return records.find((record) => record.id === uploadId);
}

export async function loadUploadManifestRecords(
  manifestPath: string,
): Promise<UploadManifestRecord[]> {
  const records: UploadManifestRecord[] = [];
  try {
    const stream = createReadStream(manifestPath, { encoding: "utf8" });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }
      try {
        const parsed = JSON.parse(trimmed) as UploadManifestRecord;
        if (parsed.id && parsed.text) {
          records.push(parsed);
        }
      } catch {
        /* skip bad line */
      }
    }
  } catch {
    return [];
  }
  return records;
}

export async function searchUploads(
  query: string,
  limit: number,
  dataDir: string,
): Promise<EvidenceRecord[]> {
  const manifestPath = path.join(dataDir, "manifest.jsonl");
  await mkdir(dataDir, { recursive: true });
  const manifestRecords = await loadUploadManifestRecords(manifestPath);
  const matches = manifestRecords.filter((record) => {
    const haystack = `${record.title}\n${record.text}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });
  return matches.slice(0, limit).map((record, index) => ({
    id: `upload:${record.id}`,
    sourceType: "upload",
    title: record.title,
    claimSnippet: snippetAroundQuery(record.text, query, 400),
    citationUrl: `upload://${record.id}`,
    publisher: "User upload",
    relevanceScore: scoreFromIndex(index, limit),
    trustSignals: {},
  }));
}

export async function appendUploadManifestRecord(
  dataDir: string,
  record: UploadManifestRecord,
): Promise<void> {
  const manifestPath = path.join(dataDir, "manifest.jsonl");
  await mkdir(dataDir, { recursive: true });
  const line = `${JSON.stringify(record)}\n`;
  const { appendFile } = await import("node:fs/promises");
  await appendFile(manifestPath, line, "utf8");
}

export async function saveUploadFile(
  dataDir: string,
  id: string,
  buffer: Buffer,
  originalName: string,
): Promise<string> {
  await mkdir(dataDir, { recursive: true });
  const safeName = path.basename(originalName).replace(/[^\w.\-]+/g, "_");
  const diskName = `${id}_${safeName}`;
  const filePath = path.join(dataDir, diskName);
  const { writeFile } = await import("node:fs/promises");
  await writeFile(filePath, buffer);
  return filePath;
}
