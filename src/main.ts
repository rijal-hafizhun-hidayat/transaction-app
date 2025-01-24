import './assets/main.css'
import 'nprogress/nprogress.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
