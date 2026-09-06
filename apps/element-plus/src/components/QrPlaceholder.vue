<script setup lang="ts">
const size = 21
const hash = (value: string) => [...value].reduce((total, char, index) => (total * 31 + char.charCodeAt(0) + index) % 997, 7)
const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= 14 && y < 7) || (x < 7 && y >= 14)
const moduleOn = (x: number, y: number) => {
  if (finder(x, y)) {
    const edge = x % 7 === 0 || y % 7 === 0 || x % 7 === 6 || y % 7 === 6
    return edge || (x % 7 >= 2 && x % 7 <= 4 && y % 7 >= 2 && y % 7 <= 4)
  }
  return (hash("ui-gallery") + x * 17 + y * 29) % 7 < 3
}
</script>

<template>
  <svg class="qr-placeholder" viewBox="0 0 21 21" role="img" aria-label="示例二维码" shape-rendering="crispEdges">
    <rect width="21" height="21" class="qr-bg" />
    <template v-for="y in size" :key="y">
      <rect v-for="x in size" :key="x" v-show="moduleOn(x - 1, y - 1)" :x="x - 1" :y="y - 1" width="1" height="1" class="qr-module" />
    </template>
  </svg>
</template>

<style scoped>
.qr-bg {
  fill: var(--el-bg-color);
}
.qr-module {
  fill: var(--el-text-color-primary);
}
</style>
