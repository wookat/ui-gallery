import type { ReactNode } from "react"

export type ComponentDemo = () => ReactNode

export type ComponentDemoMap = Record<string, ComponentDemo>

export const componentOptions = [
  { label: "选项一", value: "one" },
  { label: "选项二", value: "two" },
  { label: "选项三", value: "three" },
]

export const treeOptions = [
  {
    label: "业务中心",
    value: "business",
    children: [
      { label: "订单", value: "orders" },
      { label: "客户", value: "customers", disabled: true },
    ],
  },
  { label: "设置中心", value: "settings" },
]

export const demoImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23dfeafd'/%3E%3Crect x='48' y='48' width='544' height='264' rx='16' fill='%23ffffff'/%3E%3Crect x='80' y='88' width='210' height='20' rx='10' fill='%235c8df6'/%3E%3Crect x='80' y='136' width='420' height='14' rx='7' fill='%23d7e2f7'/%3E%3Crect x='80' y='184' width='280' height='74' rx='10' fill='%23eef3ff'/%3E%3C/svg%3E"

export function DemoPanel({ children }: { children: ReactNode }) {
  return <div className="component-demo-panel">{children}</div>
}

export function DemoRow({ children }: { children: ReactNode }) {
  return <div className="component-demo-row">{children}</div>
}
