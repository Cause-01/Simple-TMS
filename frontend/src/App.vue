<template>
  <v-app>
    <!-- 顶部应用栏 -->
    <v-app-bar
        color="primary"
        :height="mobileLayout ? '56px' : '64px'"
        app
    >
      <!-- 移动端菜单按钮 -->
      <v-app-bar-nav-icon
          v-if="mobileLayout"
          @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <!-- 系统logo -->
      <v-toolbar-title class="d-flex align-center">
        <v-icon icon="mdi-truck-delivery" class="mr-2"></v-icon>
        <span class="logo-text">TMS 运输系统</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- 桌面导航 -->
      <v-tabs
          v-if="!mobileLayout"
          center-active
          color="white"
      >
        <v-tab
            v-for="nav in navigation"
            :key="nav.to"
            :to="nav.to"
            :prepend-icon="nav.icon"
            exact
        >
          {{ nav.title }}
        </v-tab>
      </v-tabs>

      <!-- 用户菜单 -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
              variant="text"
              v-bind="props"
          >
            <v-avatar size="36" color="primary-lighten-2">
              <v-icon icon="mdi-account"></v-icon>
            </v-avatar>
            <span class="ml-2 d-none d-sm-flex">管理员</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              v-for="(item, index) in userMenu"
              :key="index"
              :value="index"
              @click="handleUserMenu(item.action)"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 移动端导航抽屉 -->
    <v-navigation-drawer
        v-model="drawer"
        temporary
        location="left"
    >
      <v-list nav>
        <v-list-item
            v-for="nav in navigation"
            :key="nav.to"
            :to="nav.to"
            :prepend-icon="nav.icon"
            :title="nav.title"
            exact
            @click="drawer = false"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 主内容区 -->
    <v-main>
      <v-container
          fluid
          :class="{'px-4': mobileLayout, 'px-6': !mobileLayout}"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- 页脚 -->
    <v-footer
        color="grey-lighten-3"
        app
        inset
    >
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex align-center">
              <v-icon icon="mdi-heart" color="red-lighten-1" class="mr-2"></v-icon>
              <span class="text-caption">TMS Transport Management System v2.0</span>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <span class="text-caption">
              © 2025 版权所有 |
              <a href="#" class="text-decoration-none">隐私政策</a> |
              <a href="#" class="text-decoration-none">使用条款</a>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- 全局通知 -->
    <v-snackbar
        v-model="showNotification"
        :color="notification.color"
        timeout="3000"
        location="bottom right"
    >
      {{ notification.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

// 响应式布局控制
const mobileLayout = computed(() => mobile.value)
const drawer = ref(false)

// 导航菜单配置
const navigation = ref([
  { to: '/', title: '运输订单', icon: 'mdi-clipboard-list' },
  { to: '/vehicles', title: '车辆管理', icon: 'mdi-truck' },
  { to: '/drivers', title: '司机管理', icon: 'mdi-account-tie' },
  { to: '/reports', title: '数据报表', icon: 'mdi-chart-bar' }
])

// 用户菜单配置
const userMenu = ref([
  { title: '个人中心', icon: 'mdi-account-cog', action: 'profile' },
  { title: '系统设置', icon: 'mdi-cog', action: 'settings' },
  { title: '退出登录', icon: 'mdi-logout', action: 'logout' }
])

// 通知系统
const showNotification = ref(false)
const notification = ref({
  color: 'success',
  message: ''
})

// 用户菜单操作
const handleUserMenu = (action) => {
  switch (action) {
    case 'logout':
      notification.value = {
        color: 'info',
        message: '您已安全退出系统'
      }
      showNotification.value = true
      // 实际项目中这里调用退出登录API
      break
    default:
      console.log('执行操作:', action)
  }
}
</script>

<style scoped>
/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Logo样式 */
.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 主内容区调整 */
.v-main {
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px - 56px); /* 减去header和footer高度 */
}

/* 移动端优化 */
@media (max-width: 960px) {
  .v-toolbar__title {
    font-size: 1.1rem;
  }
}
</style>