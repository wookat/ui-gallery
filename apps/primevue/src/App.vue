<script setup lang="ts">
import Toast from "primevue/toast"
import ConfirmDialog from "primevue/confirmdialog"
import ConfirmPopup from "primevue/confirmpopup"
import ScrollTop from "primevue/scrolltop"
import { RouterView } from "vue-router"
import AppIcon from "@/icons/AppIcon.vue"
</script>

<template>
  <RouterView />
  <Toast position="top-right" />
  <ConfirmDialog><template #icon="{ class: iconClass }"><AppIcon name="alert-triangle" :size="28" :class="iconClass" /></template></ConfirmDialog>
  <ConfirmPopup group="popup" />
  <ScrollTop />
</template>
