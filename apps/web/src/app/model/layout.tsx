import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "模型可视化",
  description: "iTRUST Evaluation Model 交互式雷达与多维图表",
};

export default function ModelLayout({ children }: { children: ReactNode }) {
  return children;
}
