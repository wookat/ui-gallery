import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css"
import { createVuetify } from "vuetify"
import { mdi } from "vuetify/iconsets/mdi"
import { VAvatarGroup, VCommandPalette, VDateInput, VFileUpload, VIconBtn, VMaskInput, VPie, VStepperVertical, VColorInput } from "vuetify/labs/components"
import { readUrlTheme } from "@/composables/settings"
import { buildAliases, currentIconSet } from "@/icons"

export const vuetify = createVuetify({
  components: { VAvatarGroup, VCommandPalette, VDateInput, VFileUpload, VIconBtn, VMaskInput, VPie, VStepperVertical, VColorInput },
  icons: { defaultSet: "mdi", aliases: buildAliases(currentIconSet()), sets: { mdi } },
  theme: {
    defaultTheme: readUrlTheme(),
    variations: { colors: ["primary", "secondary", "success", "warning", "info", "error"], lighten: 1, darken: 3 },
    themes: {
      light: { variables: { "medium-emphasis-opacity": 0.74 } },
      dark: { colors: { "on-primary": "#000000" }, variables: { "medium-emphasis-opacity": 0.74 } },
    },
  },
})
