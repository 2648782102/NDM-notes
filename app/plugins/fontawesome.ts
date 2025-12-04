import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 配置 Font Awesome
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

// 只注册组件，不添加任何图标
// 图标将在使用时直接导入
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
