"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const agentPrefix = "/api/agent";

export default function UploadsPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setStatus(null);
    const resolvedId =
      id.trim() ||
      `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const response = await fetch(`${agentPrefix}/v1/uploads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: resolvedId,
        title: title.trim() || "Untitled upload",
        text,
      }),
    });
    setLoading(false);
    if (!response.ok) {
      setError(`保存失败（${response.status}）`);
      return;
    }
    setStatus(`Saved as ${resolvedId}`);
    setText("");
    setTitle("");
    setId("");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-ink)]">资料与上传</h1>
        <p className="mt-2 text-sm text-[color:var(--color-ink)]/70">
          保存可在「iTRUST Evaluation Model」评估中引用的文本片段。建议为每条资料填写清晰标题，便于在证据板中识别。
        </p>
      </div>
      <Card title="新建文本资料">
        <label className="text-xs font-medium uppercase text-[color:var(--color-ink)]/60">
          资料编号（可选）
        </label>
        <input
          className="mt-1 w-full rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/20 p-3 text-sm"
          value={id}
          onChange={(event) => setId(event.target.value)}
          placeholder="留空则自动生成"
        />
        <label className="mt-4 block text-xs font-medium uppercase text-[color:var(--color-ink)]/60">
          标题
        </label>
        <input
          className="mt-1 w-full rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/20 p-3 text-sm"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <label className="mt-4 block text-xs font-medium uppercase text-[color:var(--color-ink)]/60">
          正文
        </label>
        <textarea
          className="mt-1 min-h-[200px] w-full rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/20 p-3 text-sm"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="mt-6 flex gap-4">
          <Button type="button" onClick={handleSubmit} disabled={loading || !text.trim()}>
            {loading ? "保存中…" : "保存资料"}
          </Button>
        </div>
        {status ? <p className="mt-4 text-sm text-[color:var(--color-ink)]">{status}</p> : null}
        {error ? (
          <p
            className="feedback-negative mt-4 rounded-[var(--radius-md)] px-3 py-2 text-sm"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
