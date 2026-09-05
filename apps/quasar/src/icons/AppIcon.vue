<script setup lang="ts">
import { computed } from "vue"
import { componentSets, materialNames } from "./sets"
import { useQuerySettings, type IconName, type IconSet } from "../lib/url"

const props = withDefaults(defineProps<{ name: IconName | string; size?: number | string }>(), { size: 20 })
const selected = useQuerySettings().iconSet
const set = computed<IconSet>(() => (["native", "lucide", "tabler", "phosphor", "heroicons"].includes(selected) ? selected : "native"))
const component = computed(() => set.value === "native" ? null : componentSets[set.value as Exclude<IconSet, "native">]?.[props.name])
const materialName = computed(() => materialNames[props.name] ?? props.name)
</script>

<template>
  <q-icon v-if="set === 'native'" :name="materialName" :size="`${size}px`" />
  <q-icon v-else :size="`${size}px`">
    <component :is="component" v-if="component" :size="size" :width="size" :height="size" />
  </q-icon>
</template>
