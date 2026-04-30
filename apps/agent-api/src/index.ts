import { appendUploadManifestRecord } from "@itrust/connectors";
import type { ResearchStreamChunk } from "@itrust/shared";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { stream } from "hono/streaming";
import path from "node:path";
import { z } from "zod";
import { runResearchPipeline } from "./pipeline.js";

const dataDir = path.resolve(
  process.env.ITRUST_DATA_DIR ?? path.join(process.cwd(), "data", "uploads"),
);

const requestSchema = z
  .object({
    question: z.string().min(3).max(2000),
    academicLimit: z.number().int().min(1).max(15).optional(),
    realLimit: z.number().int().min(1).max(15).optional(),
    uploadLimit: z.number().int().min(1).max(15).optional(),
  })
  .strict();

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/health", (c) => c.json({ status: "ok", service: "itrust-agent-api" }));

const uploadSchema = z
  .object({
    id: z.string().min(1).max(128),
    title: z.string().min(1).max(256),
    text: z.string().min(1).max(500_000),
  })
  .strict();

app.post("/v1/uploads", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid_json" }, 400);
  }
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  await appendUploadManifestRecord(dataDir, parsed.data);
  return c.json({ ok: true, id: parsed.data.id });
});

app.post("/v1/research/stream", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid_json" }, 400);
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "validation_error", issues: parsed.error.issues }, 400);
  }
  const { question, academicLimit, realLimit, uploadLimit } = parsed.data;

  c.header("Content-Type", "text/event-stream; charset=utf-8");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");

  return stream(c, async (streamInstance) => {
    const encoder = new TextEncoder();
    const writeChunk = async (chunk: ResearchStreamChunk) => {
      const payload = `data: ${JSON.stringify(chunk)}\n\n`;
      await streamInstance.write(encoder.encode(payload));
    };
    try {
      for await (const chunk of runResearchPipeline(question, {
        academicLimit: academicLimit ?? 8,
        realLimit: realLimit ?? 6,
        uploadLimit: uploadLimit ?? 5,
      })) {
        await writeChunk(chunk);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_error";
      await writeChunk({ type: "error", message });
    }
  });
});

const port = Number(process.env.PORT ?? 3001);
serve({ fetch: app.fetch, port });
console.log(`agent-api listening on http://localhost:${port}`);
