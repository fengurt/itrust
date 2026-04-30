"use client";

import { useEffect, useState } from "react";
import ModelVizBoard from "@/components/viz/ModelVizBoard";

function ModelChartsLoading() {
  return (
    <div
      className="flex min-h-[480px] flex-col items-center justify-center gap-4 rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/10 bg-[color:var(--color-ink)]/[0.04] px-6 py-16"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-1 w-40 animate-pulse rounded-[var(--radius-sm)] bg-[color:var(--color-ink)]/15"
        aria-hidden
      />
      <p className="text-center text-sm text-[color:var(--color-ink)]/55">
        正在加载图表组件…
      </p>
    </div>
  );
}

/**
 * Recharts 3 依赖浏览器尺寸与 ResizeObserver；仅在挂载后再渲染图表树，
 * 避免 dynamic chunk 在部分环境下的加载问题，并跳过对 recharts 的 SSR。
 */
export function ModelChartsGate() {
  const [browserReady, setBrowserReady] = useState(false);

  useEffect(() => {
    setBrowserReady(true);
  }, []);

  if (!browserReady) {
    return <ModelChartsLoading />;
  }

  return <ModelVizBoard />;
}
