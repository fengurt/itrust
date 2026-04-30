"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { ScoreMap } from "@/components/viz/InteractiveModelRadar";
import {
  chartAccentStroke,
  chartInkMuted,
  chartInkSoft,
  chartTooltipStyle,
} from "@/components/viz/chartTheme";

function buildPoints(scores: ScoreMap) {
  return Array.from({ length: 22 }, (_, index) => {
    const spread = (index * 13 + scores.S * 2) % 31;
    const insight = Math.min(
      98,
      Math.max(
        22,
        scores.I * 0.42 + (index % 7) * 9 + spread * 0.35 - 12,
      ),
    );
    const timeliness = Math.min(
      98,
      Math.max(
        18,
        scores.T * 0.45 + (index % 5) * 11 + (spread % 17) - 8,
      ),
    );
    const mass =
      120 + (scores.R / 100) * 220 + (index % 4) * 28 + (scores.I % 9) * 6;
    return {
      id: `e-${index}`,
      label: `证据簇 ${index + 1}`,
      insight,
      timeliness,
      mass,
    };
  });
}

type TimingInsightScatterProps = {
  scores: ScoreMap;
};

export function TimingInsightScatter({ scores }: TimingInsightScatterProps) {
  const data = useMemo(() => buildPoints(scores), [scores]);

  return (
    <Card title="时效–洞察 · 散点矩阵">
      <p className="mb-4 text-sm text-[color:var(--color-ink)]/70">
        每个点表示一条示意证据在「时效性–洞察一致性」平面上的位置；气泡大小映射证据权重（与
        R 维联动）。悬停查看坐标。
      </p>
      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
          <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartInkMuted} />
            <XAxis
              type="number"
              dataKey="timeliness"
              name="时效性"
              domain={[0, 100]}
              tick={{ fill: chartInkSoft, fontSize: 10 }}
              label={{
                value: "时效性 →",
                position: "bottom",
                offset: 0,
                fill: chartInkSoft,
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="insight"
              name="洞察一致性"
              domain={[0, 100]}
              tick={{ fill: chartInkSoft, fontSize: 10 }}
              width={44}
              label={{
                value: "洞察 ↑",
                angle: -90,
                position: "insideLeft",
                fill: chartInkSoft,
                fontSize: 11,
              }}
            />
            <ZAxis type="number" dataKey="mass" range={[60, 420]} />
            <Tooltip
              cursor={{ strokeDasharray: "4 4", stroke: chartInkMuted }}
              contentStyle={chartTooltipStyle}
              formatter={(value, name) => {
                if (name === "insight" && typeof value === "number") {
                  return [`${Math.round(value)}`, "洞察一致性"];
                }
                if (name === "timeliness" && typeof value === "number") {
                  return [`${Math.round(value)}`, "时效性"];
                }
                return [String(value ?? "—"), String(name)];
              }}
              labelFormatter={(_, payload) => {
                const first = payload?.[0];
                const row = first?.payload as { label?: string } | undefined;
                return row?.label ?? "";
              }}
            />
            <Scatter
              name="证据示意"
              data={data}
              fill={chartAccentStroke}
              fillOpacity={0.75}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
