<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">运输订单</router-link></li>
        <li><router-link to="/vehicles">车辆管理</router-link></li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style scoped>
nav {
  margin: 20px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

ul {
  list-style: none;
  display: flex;
}

li {
  margin-right: 15px;
}
</style>
