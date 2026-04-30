import Link from "next/link";
import {
  buttonBaseClassName,
  buttonVariantClassNames,
} from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const templateBlocks = [
  {
    title: "价值主张与细分",
    points: [
      "为谁解决什么问题？替代方案是什么？",
      "细分客群是否可触达、可服务、愿付费？",
    ],
  },
  {
    title: "获客与交付",
    points: [
      "主要渠道、转化路径与单位获客成本假设是否清晰？",
      "交付与履约是否依赖稀缺资源或单一供应商？",
    ],
  },
  {
    title: "收入与单位经济",
    points: [
      "定价逻辑（订阅、交易抽成、项目制等）与回款周期。",
      "毛利、边际贡献、规模扩大后的成本曲线假设。",
    ],
  },
  {
    title: "壁垒与风险",
    points: [
      "网络效应、数据、品牌、监管合规等护城河是否可验证。",
      "监管、供应链、技术路线、竞争反击等下行情景。",
    ],
  },
];

const archetypes = [
  {
    name: "SaaS 订阅",
    summary: "经常性收入、留存与扩展销售驱动；关注 LTV/CAC 与流失原因。",
  },
  {
    name: "双边市场",
    summary: "供给与需求冷启动、流动性、抽成与信任机制；关注两侧补贴与治理。",
  },
  {
    name: "B2B 项目 / 集成",
    summary: "大单周期、交付人力、回款里程碑；关注客户集中度与复购。",
  },
  {
    name: "硬件 + 服务",
    summary: "库存与供应链波动、售后与维保；关注 BOM 与渠道库存。",
  },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">
          商业模式参考模板
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-ink)]/75">
          下列模块用于在「iTRUST Evaluation Model」框架下梳理商业逻辑，便于与多源证据
          对照核验。模板不提供投资建议，仅作为结构化提问清单。
        </p>
        <div className="mt-6">
          <Link
            href="/research"
            className={`${buttonBaseClassName} ${buttonVariantClassNames.primary}`}
          >
            前往评估工作台
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {templateBlocks.map((block) => (
          <Card key={block.title} title={block.title}>
            <ul className="list-disc space-y-2 pl-4 text-sm text-[color:var(--color-ink)]/80">
              {block.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card title="常见商业模式原型（参考）">
        <ul className="grid gap-4 md:grid-cols-2">
          {archetypes.map((item) => (
            <li
              key={item.name}
              className="rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/12 p-4"
            >
              <div className="font-medium text-[color:var(--color-ink)]">{item.name}</div>
              <p className="mt-2 text-sm text-[color:var(--color-ink)]/75">{item.summary}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
