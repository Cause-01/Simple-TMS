<template>
  <div>
    <h2>运输订单</h2>
    <table>
      <thead>
      <tr>
        <th>订单号</th>
        <th>客户</th>
        <th>货物</th>
        <th>状态</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.id }}</td>
        <td>{{ order.customer }}</td>
        <td>{{ order.goods }}</td>
        <td>{{ order.status }}</td>
        <td><button @click="viewOrder(order.id)">查看</button></td>
      </tr>
      </tbody>
    </table>
    <button @click="createOrder">创建订单</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: []
    };
  },
  methods: {
    fetchOrders() {
      axios.get('http://localhost:3000/orders')
          .then(response => {
            this.orders = response.data;
          })
          .catch(error => {
            console.error('Error fetching orders:', error);
          });
    },
    createOrder() {
      this.$router.push({ name: 'CreateOrder' });
    },
    viewOrder(orderId) {
      this.$router.push({ name: 'ViewOrder', params: { id: orderId } });
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>
