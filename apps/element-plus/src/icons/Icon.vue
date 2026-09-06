<script setup lang="ts">
import { onMounted, shallowRef } from "vue"
import { getNativeIcon, iconName, warnIconMissing } from "./maps"

const props = withDefaults(defineProps<{ name: string; size?: number | string }>(), { size: 16 })
const params = new URLSearchParams(window.location.search)
const family = params.get("icon") ?? params.get("icons") ?? "native"
const resolvedComponent = shallowRef<unknown>(family === "native" ? getNativeIcon(props.name) : undefined)
const loaders: Record<string, () => Promise<Record<string, unknown>>> = {
  lucide: () => import("lucide-vue-next") as Promise<Record<string, unknown>>,
  tabler: () => import("@tabler/icons-vue") as Promise<Record<string, unknown>>,
  phosphor: () => import("@phosphor-icons/vue") as Promise<Record<string, unknown>>,
  heroicons: () => import("@heroicons/vue/24/outline") as Promise<Record<string, unknown>>,
}
const familyPromise = new Map<string, Promise<Record<string, unknown>>>()
const loadFamily = (name: string) => familyPromise.get(name) ?? (() => {
  const promise = loaders[name]?.() ?? Promise.resolve({})
  familyPromise.set(name, promise)
  return promise
})()
onMounted(async () => {
  if (family === "native") return
  const source = await loadFamily(family)
  const result = source[iconName(family, props.name)]
  if (result) resolvedComponent.value = result
  else {
    warnIconMissing(family, props.name)
    resolvedComponent.value = source[iconName(family, "circle-help")] ?? Object.values(source)[0]
  }
})
</script>

<template>
  <el-icon :size="props.size"><component v-if="resolvedComponent" :is="resolvedComponent" /><span v-else aria-hidden="true" /></el-icon>
</template>
