<template>
  <div>
    <h2>创建运输订单</h2>
    <form @submit.prevent="submitOrder">
      <div>
        <label for="customer">客户：</label>
        <input type="text" id="customer" v-model="order.customer" required />
      </div>
      <div>
        <label for="goods">货物：</label>
        <input type="text" id="goods" v-model="order.goods" required />
      </div>
      <div>
        <label for="status">状态：</label>
        <select v-model="order.status" required>
          <option value="运输中">运输中</option>
          <option value="已完成">已完成</option>
        </select>
      </div>
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      order: {
        customer: '',
        goods: '',
        status: '运输中'
      }
    };
  },
  methods: {
    submitOrder() {
      axios.post('http://localhost:3000/orders', this.order)
          .then(response => {
            this.$router.push({ name: 'OrderList' });
          })
          .catch(error => {
            console.error('Error submitting order:', error);
          });
    }
  }
};
</script>
