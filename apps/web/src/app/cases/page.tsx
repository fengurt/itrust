import Link from "next/link";
import {
  buttonBaseClassName,
  buttonVariantClassNames,
} from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const cases = [
  {
    title: "气候适应融资工具的可行性",
    sector: "公共金融 · 气候",
    question: "多边开发性金融工具在新兴市场的落地条件与证据缺口是什么？",
    lens: "对照学术文献、宏观数据与政策文本，标出假设链条与未验证环节。",
  },
  {
    title: "企业级 AI 编目产品的单位经济",
    sector: "B2B SaaS",
    question: "在既定定价下，交付成本与渠道费用是否支持可持续毛利？",
    lens: "将公开竞品披露、行业报告与讨论区信号交叉，区分事实与推断。",
  },
  {
    title: "区域生鲜平台的双边冷启动",
    sector: "双边市场",
    question: "补贴退坡后流动性与抽成能否自洽？",
    lens: "用运营数据（若可得）、新闻与社区反馈检验「补贴—留存」叙事。",
  },
  {
    title: "医疗器械新品的监管与支付路径",
    sector: "医疗健康",
    question: "注册分类、医保准入与医院采购节奏是否同步？",
    lens: "法规文本、临床试验登记与公开招投标信息对齐时间线。",
  },
];

export default function CasesPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">
          案例库
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-ink)]/75">
          以下为示范性的评估问题与视角组合，用于理解如何在「iTRUST Evaluation Model」下
          组织证据与冲突点。案例为教学合成，非对特定公司的结论。
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/research"
            className={`${buttonBaseClassName} ${buttonVariantClassNames.primary}`}
          >
            开始评估
          </Link>
          <Link
            href="/templates"
            className={`${buttonBaseClassName} ${buttonVariantClassNames.secondary}`}
          >
            查看商业模式模板
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cases.map((item) => (
          <Card key={item.title} title={item.title}>
            <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-accent)]">
              {item.sector}
            </p>
            <p className="mt-3 text-sm font-medium text-[color:var(--color-ink)]">
              评估问题
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-ink)]/80">{item.question}</p>
            <p className="mt-4 text-sm font-medium text-[color:var(--color-ink)]">
              iTRUST Evaluation Model 视角
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-ink)]/75">{item.lens}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
