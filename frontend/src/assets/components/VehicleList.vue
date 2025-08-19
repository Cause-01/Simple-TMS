<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon start>mdi-truck</v-icon>
      车辆管理
      <v-spacer></v-spacer>

      <!-- 搜索框 -->
      <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="搜索车辆"
          single-line
          hide-details
          class="mr-4"
          style="max-width: 300px;"
      ></v-text-field>

      <!-- 添加车辆按钮 -->
      <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="addVehicle"
      >
        添加车辆
      </v-btn>
    </v-card-title>

    <!-- 数据表格 -->
    <v-data-table
        :headers="headers"
        :items="vehicles"
        :search="search"
        :loading="isLoading"
        loading-text="加载中..."
        no-data-text="没有找到车辆数据"
        items-per-page="10"
    >
      <!-- 自定义车牌号显示 -->
      <template #item.plate="{ item }">
        <v-chip color="blue-grey-lighten-5">
          {{ item.plate }}
        </v-chip>
      </template>

      <!-- 自定义状态显示 -->
      <template #item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" small>
          <v-icon start :icon="getStatusIcon(item.status)"></v-icon>
          {{ item.status }}
        </v-chip>
      </template>

      <!-- 自定义操作列 -->
      <template #item.actions="{ item }">
        <div class="d-flex">
          <v-btn
              icon="mdi-pencil"
              variant="text"
              color="primary"
              @click="editVehicle(item.id)"
              size="small"
          ></v-btn>
          <v-btn
              icon="mdi-delete"
              variant="text"
              color="error"
              @click="confirmDelete(item)"
              size="small"
          ></v-btn>
        </div>
      </template>

      <!-- 表格底部 -->
      <template #bottom>
        <div class="d-flex align-center pa-4">
          <v-spacer></v-spacer>
          <span class="text-caption text-disabled">
            共 {{ vehicles.length }} 辆车辆
          </span>
        </div>
      </template>
    </v-data-table>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>确认删除</v-card-title>
        <v-card-text>
          确定要删除车牌为 <strong>{{ selectedVehicle?.plate }}</strong> 的车辆吗？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">取消</v-btn>
          <v-btn color="error" @click="deleteVehicle">确认删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// 数据状态
const vehicles = ref([])
const isLoading = ref(false)
const search = ref('')
const deleteDialog = ref(false)
const selectedVehicle = ref(null)

// 表格列配置
const headers = [
  { title: 'ID', key: 'id', width: '100px' },
  { title: '车牌号', key: 'plate', width: '150px' },
  { title: '车辆类型', key: 'type' },
  { title: '状态', key: 'status', width: '150px' },
  { title: '最后维护', key: 'lastMaintenance', width: '150px' },
  { title: '操作', key: 'actions', sortable: false, width: '120px' }
]

// 获取车辆数据
const fetchVehicles = async () => {
  try {
    isLoading.value = true
    const response = await axios.get('http://localhost:3000/vehicles')
    vehicles.value = response.data.map(vehicle => ({
      ...vehicle,
      lastMaintenance: formatDate(vehicle.lastMaintenance)
    }))
  } catch (error) {
    console.error('获取车辆失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 日期格式化
const formatDate = (dateString) => {
  if (!dateString) return '未记录'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

// 状态颜色映射
const getStatusColor = (status) => {
  const colors = {
    '空闲': 'green',
    '运输中': 'orange',
    '维修中': 'red',
    '保养中': 'blue'
  }
  return colors[status] || 'grey'
}

// 状态图标映射
const getStatusIcon = (status) => {
  const icons = {
    '空闲': 'mdi-car-off',
    '运输中': 'mdi-truck-delivery',
    '维修中': 'mdi-wrench',
    '保养中': 'mdi-oil'
  }
  return icons[status] || 'mdi-help'
}

// 操作函数
const addVehicle = () => {
  router.push({ name: 'AddVehicle' })
}

const editVehicle = (id) => {
  router.push({ name: 'EditVehicle', params: { id } })
}

const confirmDelete = (vehicle) => {
  selectedVehicle.value = vehicle
  deleteDialog.value = true
}

const deleteVehicle = async () => {
  try {
    await axios.delete(`http://localhost:3000/vehicles/${selectedVehicle.value.id}`)
    await fetchVehicles() // 刷新数据
    deleteDialog.value = false
  } catch (error) {
    console.error('删除车辆失败:', error)
  }
}

// 初始化加载
onMounted(() => {
  fetchVehicles()
})
</script>

<style>

</style>