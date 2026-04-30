"use client";

import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";
import {
  chartAccentStroke,
  chartInkMuted,
  chartTooltipStyle,
} from "@/components/viz/chartTheme";

const INK_35 = "rgba(10, 22, 38, 0.35)";
const INK_55 = "rgba(10, 22, 38, 0.55)";
const INK_70 = "rgba(10, 22, 38, 0.7)";

const COLORS = [chartAccentStroke, INK_70, INK_55, INK_35];

type Slice = { name: string; value: number };

function mixFromRadar(i: number, t: number, r: number, s: number): Slice[] {
  const academic = 28 + (r / 100) * 22 + (i / 100) * 10;
  const realworld = 22 + (t / 100) * 18 + (s / 100) * 8;
  const upload = 12 + (i / 100) * 6;
  const synthesis = Math.max(8, 100 - academic - realworld - upload);
  const raw: Slice[] = [
    { name: "学术索引", value: academic },
    { name: "现实数据", value: realworld },
    { name: "自有资料", value: upload },
    { name: "合成与对齐", value: synthesis },
  ];
  const sum = raw.reduce((accumulator, row) => accumulator + row.value, 0);
  return raw.map((row) => ({
    name: row.name,
    value: Math.round((row.value / sum) * 1000) / 10,
  }));
}

type EvidenceSourceDonutProps = {
  insight: number;
  timing: number;
  evidence: number;
  risk: number;
};

export function EvidenceSourceDonut({
  insight,
  timing,
  evidence,
  risk,
}: EvidenceSourceDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = useMemo(
    () => mixFromRadar(insight, timing, evidence, risk),
    [insight, timing, evidence, risk],
  );

  return (
    <Card title="证据构成 · 环形交互">
      <p className="mb-4 text-sm text-[color:var(--color-ink)]/70">
        点击扇区高亮；占比随上方雷达四维示意联动，表达「证据预算」在不同来源间的分配直觉。
      </p>
      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={96}
              paddingAngle={2}
              onClick={(_, index) =>
                setActiveIndex((previous) =>
                  previous === index ? null : index,
                )
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                  stroke={chartInkMuted}
                  strokeWidth={activeIndex === index ? 2 : 1}
                  cursor="pointer"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value) => [
                typeof value === "number" ? `${value}%` : "—",
                "权重",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 flex flex-wrap gap-3 text-xs text-[color:var(--color-ink)]/75">
        {data.map((row, index) => (
          <li key={row.name} className="flex items-center gap-2">
            <span
              className="inline-block size-2.5 rounded-[1px]"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            {row.name} {row.value}%
          </li>
        ))}
      </ul>
    </Card>
  );
}
