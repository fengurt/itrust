"use client";

import { useState } from "react";
import { EvidenceSourceDonut } from "@/components/viz/EvidenceSourceDonut";
import {
  InteractiveModelRadar,
  type ScoreMap,
} from "@/components/viz/InteractiveModelRadar";
import { PhaseSignalStack } from "@/components/viz/PhaseSignalStack";
import { TimingInsightScatter } from "@/components/viz/TimingInsightScatter";

const INITIAL_SCORES: ScoreMap = { I: 72, T: 70, R: 74, S: 68 };

function ModelVizBoard() {
  const [scores, setScores] = useState<ScoreMap>(INITIAL_SCORES);

  return (
    <div className="space-y-10">
      <InteractiveModelRadar scores={scores} onScoresChange={setScores} />
      <div className="grid gap-10 lg:grid-cols-2">
        <EvidenceSourceDonut
          insight={scores.I}
          timing={scores.T}
          evidence={scores.R}
          risk={scores.S}
        />
        <TimingInsightScatter scores={scores} />
      </div>
      <PhaseSignalStack scores={scores} />
    </div>
  );
}

export default ModelVizBoard;
