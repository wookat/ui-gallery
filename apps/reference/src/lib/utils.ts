import { createCn } from "cn/config"

/**
 * 全局 cn：默认 tailwind-merge 规则把 `text-role-*`（theme.css 的排版角色 utility）当成文字颜色，
 * 与 `text-fg` / `text-danger` 同组互斥，后者会把前者删掉（label / caption 全部回落到 body 字号）。
 * 这里把 `text-role-*` 归入 font-size 组；vite / tsconfig 把裸 `cn` 解析到本文件，所有组件无需改 import。
 */
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: [(v: string) => v.startsWith("role-")] }] } },
})
