import { readFileSync, writeFileSync } from "node:fs"

const root = new URL("../../../", import.meta.url).pathname
const contract = JSON.parse(readFileSync(`${root}packages/spec/contract.json`, "utf8"))
const source = readFileSync(`${root}apps/shadcn-svelte/src/coverage.ts`, "utf8")
const galleryPath = `${root}apps/shadcn-svelte/gallery.json`
const gallery = JSON.parse(readFileSync(galleryPath, "utf8"))
const entries = {}
for (const status of ["implemented", "composed", "missing"]) {
  const match = source.match(new RegExp(`const ${status} = \\[(.*?)\\]`, "s"))
  for (const name of match?.[1].matchAll(/"([^"]+)"/g) ?? []) entries[name[1]] = status
}
gallery.coverage = Object.fromEntries(
  contract.components.map((name) => [name, entries[name] ?? "missing"])
)
writeFileSync(galleryPath, `${JSON.stringify(gallery, null, 2)}\n`)
