<template>
  <v-card class="form-card">
    <v-card-title class="text-h5">添加车辆</v-card-title>

    <v-card-text>
      <v-form @submit.prevent="submitVehicle">
        <v-text-field
            v-model="vehicle.plate"
            label="车牌号"
            required
            clearable
            :rules="[v => !!v || '车牌号不能为空']"
        ></v-text-field>

        <v-select
            v-model="vehicle.type"
            :items="vehicleTypes"
            label="车辆类型"
            required
            :rules="[v => !!v || '请选择车辆类型']"
        ></v-select>

        <v-select
            v-model="vehicle.status"
            :items="statusOptions"
            label="状态"
            required
            :rules="[v => !!v || '请选择状态']"
        ></v-select>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              type="submit"
              color="primary"
              prepend-icon="mdi-check"
              :loading="isSubmitting"
              :disabled="isSubmitting"
          >
            提交
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useToast } from 'vuetify'

const router = useRouter()
const toast = useToast()
const isSubmitting = ref(false)
const vehicle = ref({
  plate: '',
  type: '',
  status: '空闲'
})
const vehicleTypes = ['卡车', '厢式货车', '冷藏车', '平板车']
const statusOptions = ['空闲', '运输中', '维修中']

const submitVehicle = async () => {
  try {
    isSubmitting.value = true
    const response = await axios.post('http://localhost:3000/vehicles', vehicle.value)
    console.log('提交成功:', response.data)
    toast.success('车辆添加成功')
    router.push({ name: 'VehicleList' })
  } catch (error) {
    console.error('提交失败:', error.response?.data || error.message)
    toast.error('车辆添加失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-card {
  max-width: 600px;
  margin: 20px auto;
}
</style>