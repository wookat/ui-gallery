<script setup lang="ts">
import { computed, type Component } from "vue"
import { iconFamily } from "@/settings"
import type { IconName } from "./names"
import { primeIconClass } from "./primeicons"
import { lucideIcons } from "./lucide"
import { tablerIcons } from "./tabler"
import { phosphorIcons } from "./phosphor"
import { heroIcons } from "./heroicons"

const props = withDefaults(defineProps<{ name: IconName; size?: number; spin?: boolean }>(), { size: 16, spin: false })
const family = iconFamily()
const component = computed<Component | null>(() => {
  if (family === "lucide") return lucideIcons[props.name]
  if (family === "tabler") return tablerIcons[props.name]
  if (family === "phosphor") return phosphorIcons[props.name]
  if (family === "heroicons") return heroIcons[props.name]
  return null
})
const style = computed(() => ({ width: `${props.size}px`, height: `${props.size}px`, fontSize: `${props.size}px` }))
</script>

<template>
  <component
    :is="component"
    v-if="component"
    :size="size"
    :style="style"
    class="app-icon"
    :class="{ 'app-icon--spin': spin }"
    aria-hidden="true"
  />
  <i v-else :class="[primeIconClass(name), 'app-icon', { 'pi-spin': spin }]" :style="style" aria-hidden="true" />
</template>

<style>
.app-icon { display: inline-flex; flex: none; vertical-align: middle; line-height: 1; }
.app-icon--spin { animation: app-icon-spin 1s linear infinite; }
@keyframes app-icon-spin { to { transform: rotate(360deg); } }
</style>
