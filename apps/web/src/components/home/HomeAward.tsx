import Link from "next/link";
import {
  buttonBaseClassName,
  buttonVariantClassNames,
} from "@/components/ui/Button";

const narrativeTension = {
  eyebrow: "董事会级信息风险",
  headline: "叙事跑在证据前面，是昂贵决策里最常见的隐性成本。",
  body:
    "战略取舍、资本配置与监管回应，都要求同一套事实底座。iTRUST Evaluation Model 将「检索—归一—引用—成稿」收束为可重复的工作台纪律，让合伙人会议从「谁声音大」回到「证据指向哪里」。",
} as const;

const methodSteps = [
  {
    step: "01",
    title: "界定问题",
    text: "把决策问题写成可检索的命题，明确边界、时间尺度与利益相关方。",
  },
  {
    step: "02",
    title: "多源并行",
    text: "学术索引、公开宏观数据、讨论信号与自有资料同步拉取，降低单一路径依赖。",
  },
  {
    step: "03",
    title: "证据归一",
    text: "统一为可引用记录，按相关性与可信度信号排序，便于交叉阅读与留痕。",
  },
  {
    step: "04",
    title: "草稿成稿",
    text: "流式输出带引用线索的综合草稿；冲突与未决点显式化，供终稿人审计定稿。",
  },
] as const;

const platformValueLayers = [
  {
    title: "对谁",
    text: "董事层、投委会、政策专班、内创评审组——任何需要「可复核叙事」的高压场域。",
  },
  {
    title: "交付什么",
    text: "可追溯的证据清单与草稿级综合，而非不可验证的结论包装。",
  },
  {
    title: "如何规模化",
    text: "同一套连接器与策略门可在组织内重复调用，沉淀为机构记忆与方法论资产。",
  },
] as const;

const businessCanvasRows = [
  {
    label: "价值主张与细分",
    hint: "为谁、替代方案、可触达客群",
  },
  {
    label: "获客与交付",
    hint: "渠道、转化、履约依赖",
  },
  {
    label: "收入与单位经济",
    hint: "定价逻辑、毛利与规模曲线假设",
  },
  {
    label: "壁垒与风险",
    hint: "护城河可验证性与下行情景",
  },
] as const;

const heroStrips = [
  { label: "证据纪律", value: "引用优先 · 冲突可见" },
  { label: "交付形态", value: "Result-as-a-Service 工作流" },
  { label: "适用节奏", value: "会前打底 → 会中对照 → 会后留痕" },
] as const;

const bentoItems = [
  {
    span: "md:col-span-2 md:row-span-1",
    title: "证据评估工作台",
    desc: "配置学术 / 现实 / 上传权重，流式生成可引用的综合草稿。",
    href: "/research",
    cta: "启动评估",
    featured: true,
  },
  {
    span: "",
    title: "商业模式模板",
    desc: "四象限清单与典型业态，便于与证据逐项咬合。",
    href: "/templates",
    cta: "打开模板",
    featured: false,
  },
  {
    span: "",
    title: "案例库",
    desc: "示范性问法与视角组合，缩短团队对齐时间。",
    href: "/cases",
    cta: "浏览案例",
    featured: false,
  },
  {
    span: "md:col-span-4",
    title: "模型沙盘",
    desc: "工作坊用交互视图；示意数据，用于对齐假设而非替代评分引擎。",
    href: "/model",
    cta: "进入视图",
    featured: false,
  },
] as const;

export default function HomeAward() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 bg-[linear-gradient(180deg,rgba(10,22,38,0.04)_0%,transparent_88%)]"
        style={{ height: "min(52vh, 520px)" }}
        aria-hidden
      />

      <section className="relative grid gap-12 pb-16 pt-2 lg:grid-cols-12 lg:gap-8 lg:pb-24">
        <div className="relative lg:col-span-7">
          <div className="absolute -left-4 top-1 hidden h-[4.5rem] w-px bg-[color:var(--color-accent)]/70 sm:block" aria-hidden />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)] sm:pl-3">
            iTRUST Evaluation Model
          </p>
          <h1 className="mt-4 max-w-[22ch] text-[clamp(2rem,5.2vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink)]">
            证据先于叙事
            <span className="block text-[color:var(--color-ink)]/35">决策才有重量</span>
          </h1>
          <p className="mt-8 max-w-xl text-[15px] leading-[1.75] text-[color:var(--color-ink)]/78">
            以顶尖咨询公司项目纪律为参照，为多源检索、引用约束与流式合成提供统一工作台——在投前、战略会、政策立项与内创评审中，用可审计的证据链支撑合伙人级别的判断。
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/research"
              className={`${buttonBaseClassName} ${buttonVariantClassNames.primary} px-6`}
            >
              启动证据评估
            </Link>
            <Link
              href="/uploads"
              className={`${buttonBaseClassName} ${buttonVariantClassNames.secondary}`}
            >
              资料入库
            </Link>
            <Link
              href="/model"
              className={`${buttonBaseClassName} ${buttonVariantClassNames.ghost} hidden sm:inline-flex`}
            >
              沙盘视图
            </Link>
          </div>
          <p className="mt-8 max-w-xl text-xs leading-relaxed text-[color:var(--color-ink)]/48">
            输出为草稿级综合，须由责任人对照原文与引用终裁；不替代法律、财务或投资建议。
          </p>
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-5 lg:justify-center lg:pl-4">
          {heroStrips.map((row) => (
            <div
              key={row.label}
              className="group rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/10 bg-[color:var(--color-surface)] px-5 py-4 transition-[border-color,box-shadow] duration-200 hover:border-[color:var(--color-accent)]/35 hover:shadow-[0_12px_40px_-16px_rgba(10,22,38,0.12)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-ink)]/45">
                {row.label}
              </p>
              <p className="mt-1.5 text-sm font-medium tracking-tight text-[color:var(--color-ink)]">
                {row.value}
              </p>
            </div>
          ))}
        </aside>
      </section>

      <section className="grid gap-10 border-t border-[color:var(--color-ink)]/10 py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <div className="lg:col-span-5">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[color:var(--color-ink)]/40">
            {narrativeTension.eyebrow}
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-[color:var(--color-ink)] sm:text-[1.65rem]">
            {narrativeTension.headline}
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="text-[15px] leading-[1.8] text-[color:var(--color-ink)]/76">
            {narrativeTension.body}
          </p>
        </div>
      </section>

      <section className="border-t border-[color:var(--color-ink)]/10 py-16 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)]/40">
              Operating model
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--color-ink)] sm:text-2xl">
              证据工作流：从提问到可复核草稿
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-[color:var(--color-ink)]/52">
            与 Stitch / Agent 管线一致：检索结果归一为 EvidenceRecord，策略门后再流式合成。
          </p>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {methodSteps.map((item) => (
            <li
              key={item.step}
              className="relative rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/10 p-6 transition-[border-color,background-color] duration-200 hover:border-[color:var(--color-ink)]/18 hover:bg-[color:var(--color-accent-muted)]"
            >
              <span className="font-mono text-3xl font-light tabular-nums leading-none text-[color:var(--color-ink)]/12">
                {item.step}
              </span>
              <h3 className="mt-4 text-sm font-semibold tracking-tight text-[color:var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--color-ink)]/68">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/12 bg-[color:var(--color-accent-muted)] px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)]/50">
              平台商业模式
            </p>
            <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-[color:var(--color-ink)] sm:text-2xl">
              以「可交付证据结果」为核心的价值交换
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[color:var(--color-ink)]/72">
              我们不贩卖不可验证的结论，而贩卖可重复调用的检索、归一与引用纪律——让组织在每一次重大议题上，少付一次「信息对齐税」。
            </p>
            <ul className="mt-8 space-y-5">
              {platformValueLayers.map((layer) => (
                <li key={layer.title} className="flex gap-4 border-l-2 border-[color:var(--color-accent)]/50 pl-4">
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-ink)]">
                    {layer.title}
                  </span>
                  <span className="text-sm leading-relaxed text-[color:var(--color-ink)]/75">
                    {layer.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/10 bg-[color:var(--color-surface)] p-6 sm:p-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)]/40">
                标的商业模式梳理
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]/72">
                与「商业模式参考模板」四模块一一对应：在评估工作台拉出证据后，用下列清单描述被分析对象如何创造与捕获价值，并与引用逐条咬合。
              </p>
              <ul className="mt-6 space-y-3">
                {businessCanvasRows.map((row) => (
                  <li
                    key={row.label}
                    className="flex flex-col gap-0.5 border-b border-[color:var(--color-ink)]/8 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm font-medium text-[color:var(--color-ink)]">{row.label}</span>
                    <span className="text-xs text-[color:var(--color-ink)]/55">{row.hint}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/templates"
              className={`${buttonBaseClassName} ${buttonVariantClassNames.secondary} mt-8 w-full justify-center sm:w-auto sm:justify-center`}
            >
              查看完整模板
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)]/40">
          Entry points
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--color-ink)] sm:text-2xl">
          按交付场景进入
        </h2>
        <div className="mt-10 grid auto-rows-fr gap-4 md:grid-cols-4 md:grid-rows-2">
          {bentoItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-col justify-between rounded-[var(--radius-md)] border p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-accent)]/40 hover:shadow-[0_20px_48px_-24px_rgba(10,22,38,0.18)] ${
                item.featured
                  ? "border-[color:var(--color-ink)]/14 bg-[color:var(--color-surface)] md:col-span-2"
                  : "border-[color:var(--color-ink)]/10 bg-[color:var(--color-surface)]"
              } ${item.span}`}
            >
              <div>
                <h3 className="text-base font-semibold tracking-tight text-[color:var(--color-ink)] group-hover:text-[color:var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-ink)]/68">{item.desc}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-accent)]">
                {item.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[color:var(--color-ink)]/10 py-12 text-center">
        <p className="text-sm font-medium text-[color:var(--color-ink)]/80">
          准备进入下一轮合伙人材料？
        </p>
        <Link
          href="/research"
          className={`${buttonBaseClassName} ${buttonVariantClassNames.primary} mx-auto mt-6 px-8`}
        >
          启动证据评估
        </Link>
      </section>
    </div>
  );
}
