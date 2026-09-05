import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css"
import { createVuetify } from "vuetify"
import { aliases, mdi } from "vuetify/iconsets/mdi"
import { VAvatarGroup, VCommandPalette, VDateInput, VFileUpload, VIconBtn, VMaskInput, VPie, VStepperVertical, VColorInput } from "vuetify/labs/components"
import { readUrlTheme } from "@/composables/settings"

export const vuetify = createVuetify({
  components: { VAvatarGroup, VCommandPalette, VDateInput, VFileUpload, VIconBtn, VMaskInput, VPie, VStepperVertical, VColorInput },
  icons: { defaultSet: "mdi", aliases, sets: { mdi } },
  theme: {
    defaultTheme: readUrlTheme(),
    variations: { colors: ["primary", "secondary", "success", "warning", "info", "error"], lighten: 1, darken: 3 },
    themes: { dark: { colors: { "on-primary": "#000000" } } },
  },
})
