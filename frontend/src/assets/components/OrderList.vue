<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon start>mdi-clipboard-list</v-icon>
      运输订单管理
      <v-spacer></v-spacer>

      <!-- 搜索和筛选 -->
      <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="搜索订单"
          single-line
          hide-details
          class="mr-4"
          style="max-width: 300px;"
      ></v-text-field>

      <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="createOrder"
      >
        新建订单
      </v-btn>
    </v-card-title>

    <!-- 高级筛选 -->
    <v-card-text>
      <v-expansion-panels flat>
        <v-expansion-panel>
          <v-expansion-panel-title>高级筛选</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                    v-model="filters.status"
                    :items="statusOptions"
                    label="订单状态"
                    multiple
                    clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                        v-bind="props"
                        label="日期范围"
                        :model-value="dateRangeText"
                        prepend-inner-icon="mdi-calendar-range"
                        readonly
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="filters.dateRange"
                      range
                      @update:modelValue="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    v-model="filters.customer"
                    :items="customerOptions"
                    label="客户筛选"
                    multiple
                    clearable
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>

    <!-- 数据表格 -->
    <v-data-table
        :headers="headers"
        :items="filteredOrders"
        :search="search"
        :loading="isLoading"
        loading-text="加载中..."
        no-data-text="没有找到订单数据"
        items-per-page="10"
    >
      <!-- 自定义订单号显示 -->
      <template v-slot:item.id="{ item }">
        <v-chip small color="grey-lighten-2">
          #{{ item.id }}
        </v-chip>
      </template>

      <!-- 自定义状态显示 -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" small>
          {{ item.status }}
        </v-chip>
      </template>

      <!-- 自定义操作列 -->
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                v-bind="props"
            ></v-btn>
          </template>
          <v-list density="compact">
            <v-list-item
                value="view"
                @click="viewOrder(item.id)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-eye</v-icon>
              </template>
              <v-list-item-title>查看详情</v-list-item-title>
            </v-list-item>
            <v-list-item
                value="edit"
                @click="editOrder(item.id)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-pencil</v-icon>
              </template>
              <v-list-item-title>编辑</v-list-item-title>
            </v-list-item>
            <v-list-item
                value="delete"
                @click="confirmDelete(item)"
            >
              <template v-slot:prepend>
                <v-icon>mdi-delete</v-icon>
              </template>
              <v-list-item-title>删除</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <!-- 表格底部 -->
      <template v-slot:bottom>
        <div class="d-flex align-center pa-4">
          <v-spacer></v-spacer>
          <span class="text-caption text-disabled">
            共 {{ filteredOrders.length }} 条记录
          </span>
        </div>
      </template>
    </v-data-table>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>确认删除</v-card-title>
        <v-card-text>
          确定要删除订单 #{{ selectedOrder?.id }} 吗？此操作不可撤销。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">取消</v-btn>
          <v-btn color="error" @click="deleteOrder">确认删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// 数据状态
const orders = ref([])
const isLoading = ref(false)
const search = ref('')
const dateMenu = ref(false)
const deleteDialog = ref(false)
const selectedOrder = ref(null)

// 筛选条件
const filters = ref({
  status: [],
  dateRange: [],
  customer: []
})

// 表格列配置
const headers = [
  { title: '订单号', key: 'id', width: '120px' },
  { title: '客户', key: 'customer' },
  { title: '货物信息', key: 'goods' },
  { title: '状态', key: 'status', width: '120px' },
  { title: '创建时间', key: 'createdAt', width: '150px' },
  { title: '操作', key: 'actions', sortable: false, width: '80px' }
]

// 选项数据
const statusOptions = ['运输中', '已完成', '已取消', '待确认']
const customerOptions = computed(() => {
  return [...new Set(orders.value.map(order => order.customer))]
})

// 获取订单数据
const fetchOrders = async () => {
  try {
    isLoading.value = true
    const response = await axios.get('http://localhost:3000/orders')
    orders.value = response.data.map(order => ({
      ...order,
      createdAt: formatDate(order.createdAt)
    }))
  } catch (error) {
    console.error('获取订单失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 日期格式化
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('zh-CN', options)
}

// 日期范围显示文本
const dateRangeText = computed(() => {
  if (!filters.value.dateRange || filters.value.dateRange.length < 2) {
    return '选择日期范围'
  }
  return `${filters.value.dateRange[0]} 至 ${filters.value.dateRange[1]}`
})

// 状态颜色映射
const getStatusColor = (status) => {
  const colors = {
    '运输中': 'orange',
    '已完成': 'success',
    '已取消': 'error',
    '待确认': 'grey'
  }
  return colors[status] || 'primary'
}

// 筛选后的订单数据
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // 状态筛选
    if (filters.value.status.length > 0 && !filters.value.status.includes(order.status)) {
      return false
    }
    // 客户筛选
    if (filters.value.customer.length > 0 && !filters.value.customer.includes(order.customer)) {
      return false
    }
    // 日期筛选
    if (filters.value.dateRange.length === 2) {
      const orderDate = new Date(order.createdAt)
      const startDate = new Date(filters.value.dateRange[0])
      const endDate = new Date(filters.value.dateRange[1])
      if (orderDate < startDate || orderDate > endDate) return false
    }
    return true
  })
})

// 操作函数
const createOrder = () => {
  router.push({ name: 'CreateOrder' })
}

const viewOrder = (id) => {
  router.push({ name: 'ViewOrder', params: { id } })
}

const editOrder = (id) => {
  router.push({ name: 'EditOrder', params: { id } })
}

const confirmDelete = (order) => {
  selectedOrder.value = order
  deleteDialog.value = true
}

const deleteOrder = async () => {
  try {
    await axios.delete(`http://localhost:3000/orders/${selectedOrder.value.id}`)
    await fetchOrders() // 刷新数据
    deleteDialog.value = false
  } catch (error) {
    console.error('删除订单失败:', error)
  }
}

// 初始化加载
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>

</style>