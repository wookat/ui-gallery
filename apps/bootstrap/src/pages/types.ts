export type PageResult = { html: string; mount?: (root: HTMLElement) => (() => void) | void }
export type Page = () => PageResult
