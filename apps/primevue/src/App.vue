<script setup lang="ts">
import Toast from "primevue/toast"
import ConfirmDialog from "primevue/confirmdialog"
import ConfirmPopup from "primevue/confirmpopup"
import ScrollTop from "primevue/scrolltop"
import { RouterView } from "vue-router"
</script>

<template>
  <RouterView />
  <Toast position="top-right" />
  <ConfirmDialog />
  <ConfirmPopup group="popup" />
  <ScrollTop />
</template>
