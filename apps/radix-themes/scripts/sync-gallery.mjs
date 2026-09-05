import { readFileSync, writeFileSync } from "node:fs"

const root = new URL("../../../", import.meta.url).pathname
const contract = JSON.parse(readFileSync(`${root}packages/spec/contract.json`, "utf8"))
const source = readFileSync(`${root}apps/radix-themes/src/coverage.ts`, "utf8")
const galleryPath = `${root}apps/radix-themes/gallery.json`
const gallery = JSON.parse(readFileSync(galleryPath, "utf8"))
const entries = Object.fromEntries([...source.matchAll(/^\s{2}([A-Za-z0-9]+): "(implemented|composed|missing)",$/gm)].map((match) => [match[1], match[2]]))
gallery.coverage = Object.fromEntries(contract.components.map((name) => [name, entries[name]]))
writeFileSync(galleryPath, `${JSON.stringify(gallery, null, 2)}\n`)
