<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <h1 class="logo">TMS 系统</h1>
      <nav>
        <ul>
          <li>
            <router-link to="/" exact-active-class="active-link">
              🚚 运输订单
            </router-link>
          </li>
          <li>
            <router-link to="/vehicles" exact-active-class="active-link">
              🚗 车辆管理
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <!-- 主体内容区域 -->
    <main class="app-main">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <small>© 2025 TMS Management System</small>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style scoped>
/* 基础布局 */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 顶部栏 */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #2c3e50;
  color: #fff;
}

.logo {
  font-size: 1.4rem;
  margin: 0;
}

/* 导航菜单 */
nav ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

nav li {
  margin-left: 20px;
}

nav a {
  color: #fff;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 4px;
  transition: background 0.2s;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.15);
}

.active-link {
  background: #3498db;
}

/* 主体内容 */
.app-main {
  flex: 1;
  padding: 20px;
  background: #f5f6fa;
}

/* 页脚 */
.app-footer {
  text-align: center;
  padding: 10px;
  background: #ecf0f1;
  font-size: 0.85rem;
  color: #7f8c8d;
}

/* 响应式 */
@media (max-width: 600px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }

  nav ul {
    flex-direction: column;
    width: 100%;
  }

  nav li {
    margin: 10px 0;
  }
}
</style>
