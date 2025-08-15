<template>
  <div>
    <h2>添加车辆</h2>
    <form @submit.prevent="submitVehicle">
      <div>
        <label for="plate">车牌：</label>
        <input type="text" id="plate" v-model="vehicle.plate" required />
      </div>
      <div>
        <label for="type">类型：</label>
        <input type="text" id="type" v-model="vehicle.type" required />
      </div>
      <div>
        <label for="status">状态：</label>
        <select v-model="vehicle.status" required>
          <option value="空闲">空闲</option>
          <option value="运输中">运输中</option>
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
      vehicle: {
        plate: '',
        type: '',
        status: '空闲'
      }
    };
  },
  methods: {
    submitVehicle() {
      axios.post('http://localhost:3000/api/vehicles', this.vehicle)
        .then(() => {
          this.$router.push({ name: 'VehicleList' });
        })
        .catch(error => {
          console.error('Error submitting vehicle:', error);
        });
    }
  }
};
</script>
