import { readFileSync, writeFileSync } from "node:fs"

const root = new URL("../../../", import.meta.url).pathname
const source = readFileSync(`${root}apps/rsuite/src/coverage.ts`, "utf8")
const galleryPath = `${root}apps/rsuite/gallery.json`
const gallery = JSON.parse(readFileSync(galleryPath, "utf8"))
gallery.coverage = Object.fromEntries([...source.matchAll(/([A-Za-z0-9]+): "(implemented|composed|missing)"/g)].map((match) => [match[1], match[2]]))
writeFileSync(galleryPath, `${JSON.stringify(gallery, null, 2)}\n`)
