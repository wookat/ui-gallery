import { createCn } from "cn/config"

/**
 * 类名合并（clsx + tailwind-merge 语义）。默认引擎把所有 `text-*` 未知值当作文字颜色，
 * 会让 theme.css 的字体角色类（text-role-caption …）与 text-fg-* 互相覆盖而丢失；
 * 这里把 text-role-* 登记为 font-size 组，使字体角色与颜色可以共存。
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["role-caption", "role-body", "role-label", "role-title", "role-heading", "role-display"] }],
    },
  },
})
