import { readFileSync, writeFileSync } from "node:fs"
const root = new URL("../../../", import.meta.url).pathname
const contract = JSON.parse(readFileSync(`${root}packages/spec/contract.json`, "utf8"))
const coverageSource = readFileSync(`${root}apps/pico-css/src/coverage.ts`, "utf8")
const galleryPath = `${root}apps/pico-css/gallery.json`
const gallery = JSON.parse(readFileSync(galleryPath, "utf8"))
const readSet = (name) => new Set((coverageSource.match(new RegExp(`${name} = new Set\\(\\[([^\\]]+)`))?.[1] ?? "").matchAll(/"([^"]+)"/g).map((match) => match[1]))
const implemented = readSet("implemented")
const missing = readSet("missing")
const entries = Object.fromEntries(contract.components.map((key) => [key, missing.has(key) ? "missing" : implemented.has(key) ? "implemented" : "composed"]))
const coverage = Object.fromEntries(contract.components.map((key) => [key, entries[key]]))
if (Object.values(coverage).some((value) => !value)) throw new Error("Coverage is missing a contract component")
gallery.coverage = coverage
gallery.notes = "Pico CSS 2.1.1 官方默认（azure）主题，使用含少量类名的默认构建 pico.min.css（.grid/.container/.secondary/.contrast/.outline/.dropdown）；无自带图标体系，?icons= 通过内联 SVG 适配层切换 lucide/tabler/phosphor/heroicons；图表用 Chart.js（external）；暗色用 html[data-theme=dark]。"
writeFileSync(galleryPath, `${JSON.stringify(gallery, null, 2)}\n`)
