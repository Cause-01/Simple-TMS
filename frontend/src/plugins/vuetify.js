import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

// 所有Vuetify配置集中在此
export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#1867C0',  // 主色
                    secondary: '#5CBBF6', // 辅色
                }
            }
        }
    },
    defaults: {  // 全局组件默认值（可选）
        VBtn: {
            variant: 'flat',
            color: 'primary'
        }
    }
})