<template>
  <div>
    <h2>车辆管理</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>车牌</th>
          <th>类型</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehicle in vehicles" :key="vehicle.id">
          <td>{{ vehicle.id }}</td>
          <td>{{ vehicle.plate }}</td>
          <td>{{ vehicle.type }}</td>
          <td>{{ vehicle.status }}</td>
          <td>
            <button @click="editVehicle(vehicle.id)">编辑</button>
            <button @click="deleteVehicle(vehicle.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="addVehicle">添加车辆</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      vehicles: []
    };
  },
  methods: {
    fetchVehicles() {
      axios.get('http://localhost:3000/api/vehicles')
        .then(response => {
          this.vehicles = response.data;
        })
        .catch(error => {
          console.error('Error fetching vehicles:', error);
        });
    },
    addVehicle() {
      this.$router.push({ name: 'AddVehicle' });
    },
    editVehicle(id) {
      this.$router.push({ name: 'EditVehicle', params: { id } });
    },
    deleteVehicle(id) {
      axios.delete(`http://localhost:3000/api/vehicles/${id}`)
        .then(() => {
          this.fetchVehicles();
        })
        .catch(error => {
          console.error('Error deleting vehicle:', error);
        });
    }
  },
  mounted() {
    this.fetchVehicles();
  }
};
</script>
