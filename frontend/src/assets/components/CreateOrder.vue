<template>
  <v-card class="form-card">
    <v-card-title class="text-h5">
      <v-icon start>mdi-truck-delivery</v-icon>
      创建运输订单
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="submitOrder" ref="orderForm">
        <!-- 客户选择 -->
        <v-autocomplete
            v-model="order.customer"
            :items="customerList"
            label="客户"
            item-title="name"
            item-value="id"
            :rules="customerRules"
            clearable
            required
        >
          <template v-slot:item="{ props }">
            <v-list-item v-bind="props" :subtitle="`联系电话: ${props.item.phone}`"></v-list-item>
          </template>
        </v-autocomplete>

        <!-- 货物信息 -->
        <v-textarea
            v-model="order.goods"
            label="货物详情"
            :rules="goodsRules"
            rows="2"
            auto-grow
            required
        ></v-textarea>

        <!-- 运输状态 -->
        <v-select
            v-model="order.status"
            :items="statusOptions"
            label="运输状态"
            :rules="[v => !!v || '请选择状态']"
            required
        ></v-select>

        <!-- 日期选择 -->
        <v-date-picker
            v-model="order.deliveryDate"
            label="预计送达日期"
            :min="new Date().toISOString().substr(0, 10)"
        ></v-date-picker>

        <!-- 车辆选择 -->
        <v-select
            v-model="order.vehicleId"
            :items="availableVehicles"
            label="分配车辆"
            item-title="plate"
            item-value="id"
            :hint="selectedVehicleHint"
            persistent-hint
        ></v-select>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="secondary"
              @click="$router.back()"
          >
            取消
          </v-btn>
          <v-btn
              type="submit"
              color="primary"
              :loading="isSubmitting"
              prepend-icon="mdi-content-save"
          >
            提交订单
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const orderForm = ref(null)
const isSubmitting = ref(false)

// 表单数据
const order = ref({
  customer: null,
  goods: '',
  status: '运输中',
  deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().substr(0, 10), // 默认3天后
  vehicleId: null
})

// 数据选项
const statusOptions = ['运输中', '已完成', '已取消']
const customerList = ref([])
const availableVehicles = ref([])

// 验证规则
const customerRules = [
  v => !!v || '请选择客户',
  v => customerList.value.some(c => c.id === v) || '无效的客户选择'
]

const goodsRules = [
  v => !!v || '请输入货物信息',
  v => (v && v.length <= 200) || '不能超过200个字符'
]

// 计算属性
const selectedVehicleHint = computed(() => {
  const vehicle = availableVehicles.value.find(v => v.id === order.value.vehicleId)
  return vehicle ? `${vehicle.type} | ${vehicle.status}` : '未选择车辆'
})

// 初始化加载数据
onMounted(async () => {
  try {
    const [customersRes, vehiclesRes] = await Promise.all([
      axios.get('http://localhost:3000/customers'),
      axios.get('http://localhost:3000/vehicles?status=空闲')
    ])
    customerList.value = customersRes.data
    availableVehicles.value = vehiclesRes.data
  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 提交订单
const submitOrder = async () => {
  const { valid } = await orderForm.value.validate()
  if (!valid) return

  try {
    isSubmitting.value = true
    await axios.post('http://localhost:3000/orders', order.value)
    router.push({ name: 'OrderList' })
  } catch (error) {
    console.error('订单提交失败:', error.response?.data || error.message)
    // 这里可以添加错误提示 toast
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-card {
  max-width: 800px;
  margin: 20px auto;
}
</style>