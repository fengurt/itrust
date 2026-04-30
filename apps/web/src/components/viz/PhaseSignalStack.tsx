"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { ScoreMap } from "@/components/viz/InteractiveModelRadar";
import {
  chartAccentStroke,
  chartInkMuted,
  chartInkSoft,
  chartTooltipStyle,
} from "@/components/viz/chartTheme";

const INK_45 = "rgba(10, 22, 38, 0.45)";
const INK_30 = "rgba(10, 22, 38, 0.3)";
const INK_18 = "rgba(10, 22, 38, 0.18)";

const BASE_PHASES = [
  { phase: "界定", i: 10, t: 6, r: 5, s: 4 },
  { phase: "学术", i: 14, t: 8, r: 18, s: 6 },
  { phase: "宏观", i: 8, t: 12, r: 10, s: 5 },
  { phase: "讨论", i: 9, t: 14, r: 7, s: 11 },
  { phase: "资料", i: 11, t: 7, r: 16, s: 4 },
  { phase: "对齐", i: 16, t: 10, r: 12, s: 14 },
  { phase: "留痕", i: 12, t: 16, r: 9, s: 18 },
];

function scaleRow(row: (typeof BASE_PHASES)[0], scores: ScoreMap) {
  const factor =
    0.55 + (scores.I + scores.T + scores.R + scores.S) / (4 * 100) * 0.55;
  return {
    phase: row.phase,
    i: Math.round(row.i * factor * 10) / 10,
    t: Math.round(row.t * factor * 10) / 10,
    r: Math.round(row.r * factor * (0.85 + scores.R / 200) * 10) / 10,
    s: Math.round(row.s * factor * (0.9 + scores.S / 220) * 10) / 10,
  };
}

type PhaseSignalStackProps = {
  scores: ScoreMap;
};

export function PhaseSignalStack({ scores }: PhaseSignalStackProps) {
  const data = useMemo(
    () => BASE_PHASES.map((row) => scaleRow(row, scores)),
    [scores],
  );

  return (
    <Card title="阶段信号 · 堆叠面积">
      <p className="mb-4 text-sm text-[color:var(--color-ink)]/70">
        沿评估流程示意各维「信号密度」的堆叠分布；面积随雷达整体强度缩放，用于观察
        I/T/R/S 在不同阶段的相对贡献。
      </p>
      <div className="h-[300px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartAccentStroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={chartAccentStroke} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartInkMuted} />
            <XAxis
              dataKey="phase"
              tick={{ fill: chartInkSoft, fontSize: 11 }}
              axisLine={{ stroke: chartInkMuted }}
            />
            <YAxis
              tick={{ fill: chartInkSoft, fontSize: 10 }}
              width={36}
              axisLine={false}
            />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Area
              type="monotone"
              dataKey="i"
              name="Insight (I)"
              stackId="stack"
              stroke={chartAccentStroke}
              fill="url(#fillI)"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="t"
              name="Timing (T)"
              stackId="stack"
              stroke={INK_45}
              fill={INK_18}
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="r"
              name="Evidence (R)"
              stackId="stack"
              stroke={INK_45}
              fill={INK_30}
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="s"
              name="Risk (S)"
              stackId="stack"
              stroke={INK_45}
              fill={INK_45}
              fillOpacity={0.12}
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
