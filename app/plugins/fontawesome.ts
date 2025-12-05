import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import {
  faFileText,
  faSun,
  faMoon,
  faRightFromBracket,
  faRightToBracket,
  faHome,
  faPlus,
  faUser,
  faSave,
  faTrash,
  faHeading,
  faBold,
  faItalic,
  faCode,
  faStrikethrough,
  faList,
  faListOl,
  faCheckSquare,
  faQuoteRight,
  faTable,
  faMinus,
  faAsterisk,
  faHighlighter,
  faSuperscript,
  faSubscript,
  faLink,
  faImage,
  faEdit,
  faXmark,
  faArrowLeft,
  faFolder,
  faSearch,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'

// 配置 Font Awesome
config.autoAddCss = false

// 添加常用图标到库
library.add(
  faFileText,
  faSun,
  faMoon,
  faRightFromBracket,
  faRightToBracket,
  faHome,
  faPlus,
  faUser,
  faSave,
  faTrash,
  faHeading,
  faBold,
  faItalic,
  faCode,
  faStrikethrough,
  faList,
  faListOl,
  faCheckSquare,
  faQuoteRight,
  faTable,
  faMinus,
  faAsterisk,
  faHighlighter,
  faSuperscript,
  faSubscript,
  faLink,
  faImage,
  faEdit,
  faXmark,
  faArrowLeft,
  faFolder,
  faSearch,
  faSpinner
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
