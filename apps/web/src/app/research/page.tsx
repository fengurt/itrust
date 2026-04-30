"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { consumeResearchSse } from "@/lib/researchStream";
import type { EvidenceRecord } from "@itrust/shared";

const agentPrefix = "/api/agent";

export default function ResearchPage() {
  const [question, setQuestion] = useState("climate adaptation finance");
  const [answer, setAnswer] = useState("");
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [academicLimit, setAcademicLimit] = useState(8);
  const [realLimit, setRealLimit] = useState(6);
  const [uploadLimit, setUploadLimit] = useState(5);

  const trustLensRows = useMemo(
    () => [
      {
        dimension: "Insight (I)",
        signal: "Do sources define problem boundaries and assumptions clearly?",
      },
      {
        dimension: "Timing (T)",
        signal: "Do timestamps and publishers indicate current relevance?",
      },
      {
        dimension: "Value / Evidence (R5)",
        signal: "Are claims tied to retrievable URLs or upload text?",
      },
      {
        dimension: "Risk (S10)",
        signal: "Do sources disagree? Surface conflicts explicitly.",
      },
    ],
    [],
  );

  const runResearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAnswer("");
    setEvidence([]);
    const response = await fetch(`${agentPrefix}/v1/research/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        academicLimit,
        realLimit,
        uploadLimit,
      }),
    });
    if (!response.ok) {
      setError(`请求失败（${response.status}）`);
      setLoading(false);
      return;
    }
    const merged = new Map<string, EvidenceRecord>();
    await consumeResearchSse(response, {
      onEvidence: (records) => {
        for (const record of records) {
          merged.set(record.id, record);
        }
        setEvidence([...merged.values()]);
      },
      onToken: (text) => {
        setAnswer((previous) => previous + text);
      },
      onError: (message) => setError(message),
    });
    setLoading(false);
  }, [question, academicLimit, realLimit, uploadLimit]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">
          评估工作台
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-ink)]/70">
          iTRUST Evaluation Model：流式检索学术索引、公开宏观数据、讨论链接与自有资料。
          输出为草稿级综合，决策前请核对引用与原文。
        </p>
      </div>

      <Card title="评估问题">
        <label className="block text-xs font-medium uppercase tracking-wide text-[color:var(--color-ink)]/60">
          问题描述
        </label>
        <textarea
          className="mt-2 w-full rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/20 bg-[color:var(--color-surface)] p-4 text-sm text-[color:var(--color-ink)] focus:border-[color:var(--color-accent)] focus:outline-none"
          rows={4}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-[color:var(--color-ink)]/60">
              学术来源上限 ({academicLimit})
            </label>
            <input
              type="range"
              min={3}
              max={15}
              value={academicLimit}
              onChange={(event) => setAcademicLimit(Number(event.target.value))}
              className="mt-2 w-full accent-[color:var(--color-accent)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[color:var(--color-ink)]/60">
              现实世界来源上限 ({realLimit})
            </label>
            <input
              type="range"
              min={2}
              max={15}
              value={realLimit}
              onChange={(event) => setRealLimit(Number(event.target.value))}
              className="mt-2 w-full accent-[color:var(--color-accent)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[color:var(--color-ink)]/60">
              自有资料条数上限 ({uploadLimit})
            </label>
            <input
              type="range"
              min={1}
              max={15}
              value={uploadLimit}
              onChange={(event) => setUploadLimit(Number(event.target.value))}
              className="mt-2 w-full accent-[color:var(--color-accent)]"
            />
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <Button type="button" onClick={runResearch} disabled={loading}>
            {loading ? "运行中…" : "运行评估"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setAnswer("")}>
            清空结论草稿
          </Button>
        </div>
        {error ? (
          <p
            className="feedback-negative mt-4 rounded-[var(--radius-md)] px-3 py-2 text-sm"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </Card>

      <Card title="iTRUST Evaluation Model · 评估维度">
        <ul className="space-y-4 text-sm text-[color:var(--color-ink)]/80">
          {trustLensRows.map((row) => (
            <li key={row.dimension}>
              <span className="font-medium text-[color:var(--color-ink)]">
                {row.dimension}
              </span>
              <div className="mt-1 text-[color:var(--color-ink)]/70">{row.signal}</div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="结论草稿">
        {loading && answer.length === 0 ? (
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded-[var(--radius-sm)] bg-[color:var(--color-ink)]/10" />
            <div className="h-3 max-w-[83%] animate-pulse rounded-[var(--radius-sm)] bg-[color:var(--color-ink)]/10" />
            <div className="h-3 w-2/3 animate-pulse rounded-[var(--radius-sm)] bg-[color:var(--color-ink)]/10" />
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[color:var(--color-ink)]/90">
            {answer || "—"}
          </pre>
        )}
      </Card>

      <Card title={`证据板 (${evidence.length})`}>
        {evidence.length === 0 ? (
          <p className="text-sm text-[color:var(--color-ink)]/50">
            检索完成后将在此展示可引用的证据卡片。
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {evidence.map((record) => (
              <div
                key={record.id}
                className="rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/12 p-4"
              >
                <div className="text-xs uppercase tracking-wide text-[color:var(--color-accent)]">
                  {record.sourceType}
                </div>
                <div className="mt-2 font-medium text-[color:var(--color-ink)]">
                  {record.title}
                </div>
                <p className="mt-2 line-clamp-4 text-xs text-[color:var(--color-ink)]/70">
                  {record.claimSnippet}
                </p>
                {record.citationUrl ? (
                  <a
                    className="mt-3 inline-block text-xs font-medium text-[color:var(--color-accent)] underline-offset-2 hover:underline"
                    href={record.citationUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    打开来源
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
