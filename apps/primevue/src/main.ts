import { createApp } from "vue"
import PrimeVue, { defaultOptions } from "primevue/config"
import Aura from "@primeuix/themes/aura"
import ToastService from "primevue/toastservice"
import ConfirmationService from "primevue/confirmationservice"
import Tooltip from "primevue/tooltip"
import Ripple from "primevue/ripple"
import "primeicons/primeicons.css"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist"
import "@fontsource-variable/noto-sans-sc"
import "lxgw-wenkai-screen-webfont/style.css"
import "./styles.css"
import App from "./App.vue"
import { router } from "./router"
import { applyUrlSettings } from "./settings"

applyUrlSettings()

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: { prefix: "p", darkModeSelector: ".dark", cssLayer: false },
    },
    locale: {
      ...defaultOptions.locale,
      emptyMessage: "暂无选项",
      emptySelectionMessage: "未选择任何项",
      emptySearchMessage: "没有匹配结果",
      emptyFilterMessage: "没有匹配结果",
      searchMessage: "共 {0} 条结果",
      selectionMessage: "已选 {0} 项",
      noFileChosenMessage: "未选择文件",
      choose: "选择",
      upload: "上传",
      cancel: "取消",
      accept: "确定",
      reject: "取消",
      clear: "清除",
      today: "今天",
      weekHeader: "周",
      dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
      dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
      monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      firstDayOfWeek: 1,
      dateFormat: "yy-mm-dd",
    },
    ripple: false,
  })
  .use(ToastService)
  .use(ConfirmationService)
  .use(router)
  .directive("tooltip", Tooltip)
  .directive("ripple", Ripple)
  .mount("#app")
