import { createCn } from "cn/config"

/**
 * 类名合并（clsx + tailwind-merge 语义）。默认引擎把所有 `text-*` 未知值当作文字颜色，
 * 会让 theme.css 的字体角色类（text-role-caption …）与 text-fg-* 互相覆盖而丢失；
 * 这里把 text-role-* 登记为 font-size 组，使字体角色与颜色可以共存。
 * vite / tsconfig 把裸 `cn` 解析到 src/lib/utils.ts（再转出本文件），组件从哪个入口 import 均一致。
 */
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: [(v: string) => v.startsWith("role-")] }] } },
})
