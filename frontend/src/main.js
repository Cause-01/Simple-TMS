// main.js (修改后)
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'


const app = createApp(App)

app.use(router)
    .use(vuetify)

// 修改为 Vue CLI 的环境变量访问方式
if (process.env.NODE_ENV === 'production') {
    app.config.errorHandler = (err) => {
        console.error('全局错误:', err)
    }
}

app.mount('#app')