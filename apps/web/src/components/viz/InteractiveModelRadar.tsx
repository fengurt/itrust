"use client";

import { useCallback, useMemo } from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  chartAccentFill,
  chartAccentStroke,
  chartInk,
  chartInkMuted,
  chartInkSoft,
  chartTooltipStyle,
} from "@/components/viz/chartTheme";

export const DIMENSION_KEYS = ["I", "T", "R", "S"] as const;
export type DimensionKey = (typeof DIMENSION_KEYS)[number];
export type ScoreMap = Record<DimensionKey, number>;

const LABELS: Record<DimensionKey, string> = {
  I: "Insight (I) · 洞察",
  T: "Timing (T) · 时效",
  R: "Evidence (R) · 证据",
  S: "Risk (S) · 风险显化",
};

const PRESETS: { id: string; label: string; scores: ScoreMap }[] = [
  {
    id: "balanced",
    label: "均衡基线",
    scores: { I: 72, T: 70, R: 74, S: 68 },
  },
  {
    id: "aggressive",
    label: "进取评估",
    scores: { I: 88, T: 62, R: 80, S: 55 },
  },
  {
    id: "defensive",
    label: "审慎核验",
    scores: { I: 65, T: 86, R: 90, S: 82 },
  },
];

const BENCHMARK_SCORES: ScoreMap = { I: 68, T: 68, R: 68, S: 68 };

function buildRadarRows(current: ScoreMap) {
  return DIMENSION_KEYS.map((key) => ({
    axis: LABELS[key],
    key,
    current: current[key],
    benchmark: BENCHMARK_SCORES[key],
  }));
}

export type InteractiveModelRadarProps = {
  scores: ScoreMap;
  onScoresChange: (next: ScoreMap) => void;
};

export function InteractiveModelRadar({
  scores: current,
  onScoresChange,
}: InteractiveModelRadarProps) {
  const data = useMemo(() => buildRadarRows(current), [current]);

  const setDimension = useCallback(
    (key: DimensionKey, value: number) => {
      onScoresChange({ ...current, [key]: value });
    },
    [current, onScoresChange],
  );

  const applyPreset = useCallback(
    (nextScores: ScoreMap) => {
      onScoresChange({ ...nextScores });
    },
    [onScoresChange],
  );

  return (
    <Card title="模型雷达 · 交互视角">
      <p className="mb-6 text-sm leading-relaxed text-[color:var(--color-ink)]/70">
        拖动滑块调整四维轮廓；「当前」与「基准环」对照，用于顶层设计评审时的快速
        what-if。数值为示意刻度（0–100），非模型推断结果。
      </p>
      <div
        className="w-full min-w-0"
        style={{ height: "min(52vw, 420px)", minHeight: "280px" }}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
          <RadarChart cx="50%" cy="52%" data={data} outerRadius="72%">
            <PolarGrid stroke={chartInkMuted} />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: chartInkSoft, fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={45}
              domain={[0, 100]}
              tick={{ fill: chartInkSoft, fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="基准"
              dataKey="benchmark"
              stroke={chartInk}
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="none"
              dot={false}
              isAnimationActive
            />
            <Radar
              name="当前"
              dataKey="current"
              stroke={chartAccentStroke}
              strokeWidth={2}
              fill={chartAccentFill}
              fillOpacity={1}
              dot={{ r: 3, fill: chartAccentStroke }}
              isAnimationActive
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value, name) => [
                typeof value === "number" ? `${value}` : "—",
                String(name),
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: chartInkSoft }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {DIMENSION_KEYS.map((key) => (
          <label key={key} className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-ink)]/55">
              {LABELS[key]} — {current[key]}
            </span>
            <input
              type="range"
              min={20}
              max={100}
              value={current[key]}
              onChange={(event) =>
                setDimension(key, Number(event.target.value))
              }
              className="mt-2 w-full accent-[color:var(--color-accent)]"
            />
          </label>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-[color:var(--color-ink)]/10 pt-6">
        <span className="w-full text-xs font-medium uppercase tracking-wide text-[color:var(--color-ink)]/50">
          画像预设
        </span>
        {PRESETS.map((preset) => (
          <Button
            key={preset.id}
            type="button"
            variant="secondary"
            onClick={() => applyPreset(preset.scores)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
