import { createApp } from 'vue'
import {createPinia } from 'pinia'
import App from './App.vue'
import './assets/base.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/el-message.css';
import "element-plus/theme-chalk/el-message-box.css";
import piniaPersist from 'pinia-plugin-persist'


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist);
app.use(pinia)



import router from './router'
app.use(router)

app.mount('#app')