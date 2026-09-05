import { readFileSync, writeFileSync } from "node:fs"
const root = new URL("../../../", import.meta.url).pathname
const contract = JSON.parse(readFileSync(`${root}packages/spec/contract.json`, "utf8"))
const source = readFileSync(`${root}apps/antd/src/coverage.ts`, "utf8")
const galleryPath = `${root}apps/antd/gallery.json`
const gallery = JSON.parse(readFileSync(galleryPath, "utf8"))
const entries = Object.fromEntries([...source.matchAll(/([A-Za-z0-9]+): "(implemented|composed|missing)"/g)].map((m) => [m[1], m[2]]))
gallery.coverage = Object.fromEntries(contract.components.map((name) => [name, entries[name] ?? "missing"]))
writeFileSync(galleryPath, `${JSON.stringify(gallery, null, 2)}\n`)
