import type { Metadata } from "next";
import HomeAward from "@/components/home/HomeAward";

export const metadata: Metadata = {
  title: "首页",
  description:
    "以证据纪律支撑董事层与项目组决策：多源检索、可核验引用与商业模式模板，对标顶尖咨询交付工作流。",
};

export default function Home() {
  return <HomeAward />;
}
