import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { key } from './store'
import { useElement } from '@/components'
import { installCustomComponent } from '@/custom-components'

// import style
import 'element-plus/packages/theme-chalk/src/base.scss'
import '@/assets/styles/reset.css'
import '@/assets/styles/animate.css'

const app = createApp(App)
installCustomComponent(app)
useElement(app).use(store, key).use(router).mount('#app')
