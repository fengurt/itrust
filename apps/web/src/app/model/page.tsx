import Link from "next/link";
import {
  buttonBaseClassName,
  buttonVariantClassNames,
} from "@/components/ui/Button";
import { ModelChartsGate } from "./ModelChartsGate";

export default function ModelVisualizationPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 border-b border-[color:var(--color-ink)]/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">
            模型可视化
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--color-ink)]/75">
            iTRUST Evaluation Model 的交互式视图：雷达定调四维，环形看证据配比，散点看
            时效–洞察张力，堆叠面积看阶段信号分布。均为演示数据，与单次真实评估结果无
            自动绑定。
          </p>
        </div>
        <Link
          href="/research"
          className={`${buttonBaseClassName} ${buttonVariantClassNames.primary} shrink-0`}
        >
          进入评估工作台
        </Link>
      </div>
      <ModelChartsGate />
    </div>
  );
}
