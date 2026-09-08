import { createCn } from "cn/config"

/**
 * 类名合并（clsx + tailwind-merge 语义）。默认引擎把所有 `text-*` 未知值当作文字颜色，
 * 会让 theme.css 的字体角色类（text-role-caption …）与 text-fg-* 互相覆盖而丢失；
 * 这里把 text-role-* 登记为 font-size 组，使字体角色与颜色可以共存。
 * theme.css 的间距 / 尺寸刻度全是命名令牌（w-sheet、h-navbar、min-h-hit …），默认引擎不认识命名值，
 * 同组两个类会一起保留、由 CSS 顺序决定胜负；把命名值登记进 spacing 刻度后，后传的 w-* / h-* / gap-* 才能覆盖组件基类；
 * 命名宽度（w-popover / w-sheet / w-sidebar-drawer …）另在 width 组显式登记一次（chat 侧引入，两侧并集）。
 * vite / tsconfig 把裸 `cn` 解析到 src/lib/utils.ts（再转出本文件），组件从哪个入口 import 均一致。
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: [(v: string) => v.startsWith("role-")] }],
      w: [{ w: [(v: string) => /^[a-z][a-z-]*$/.test(v)] }],
    },
    theme: { spacing: [(v: string) => /^[a-z][a-z0-9-]*$/.test(v)] },
  },
})
