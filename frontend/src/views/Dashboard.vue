<template>
  <v-container fluid>
    <!-- 顶部欢迎栏 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card color="primary" dark>
          <v-card-text class="d-flex align-center">
            <v-avatar size="60" class="mr-4">
              <v-icon icon="mdi-truck-fast" size="x-large"></v-icon>
            </v-avatar>
            <div>
              <div class="text-h5">运输管理系统控制台</div>
              <div class="text-subtitle-1">欢迎回来，{{ user.name }}！今天是 {{ currentDate }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 数据概览卡片 -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" v-for="(stat, index) in stats" :key="index">
        <v-card :color="stat.color" dark>
          <v-card-text class="d-flex justify-space-between">
            <div>
              <div class="text-h6">{{ stat.title }}</div>
              <div class="text-h4">{{ stat.value }}</div>
              <div class="text-caption">{{ stat.change }} 较上月</div>
            </div>
            <v-avatar size="60" :color="stat.iconColor">
              <v-icon :icon="stat.icon" size="x-large"></v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 图表和活动记录 -->
    <v-row>
      <!-- 订单统计图表 -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
            月度运输订单趋势
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="chartRange" mandatory>
              <v-btn size="small" value="week">周</v-btn>
              <v-btn size="small" value="month">月</v-btn>
              <v-btn size="small" value="year">年</v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text>
            <OrderChart :range="chartRange" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 最近活动 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
            最近活动
          </v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item
                  v-for="(activity, index) in recentActivities"
                  :key="index"
                  :dot-color="activity.color"
                  size="small"
              >
                <div class="d-flex justify-space-between">
                  <strong>{{ activity.action }}</strong>
                  <small class="text-grey">{{ activity.time }}</small>
                </div>
                <div class="text-caption">
                  {{ activity.details }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 待办任务 -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon icon="mdi-format-list-checks" class="mr-2"></v-icon>
            待办任务
          </v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-item
                  v-for="(task, index) in pendingTasks"
                  :key="index"
                  :value="task.id"
              >
                <template v-slot:prepend>
                  <v-checkbox-btn v-model="task.completed"></v-checkbox-btn>
                </template>
                <v-list-item-title>{{ task.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip size="small" :color="getPriorityColor(task.priority)" class="mr-2">
                    {{ task.priority }}
                  </v-chip>
                  截止: {{ task.dueDate }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import OrderChart from '@/components/charts/OrderChart.vue'

// 用户数据
const user = ref({
  name: '管理员',
  role: '系统管理员'
})

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// 统计卡片数据
const stats = ref([
  {
    title: '运输中订单',
    value: '24',
    change: '+12%',
    icon: 'mdi-truck-delivery',
    color: 'indigo-darken-2',
    iconColor: 'indigo'
  },
  {
    title: '可用车辆',
    value: '8',
    change: '-5%',
    icon: 'mdi-car',
    color: 'teal-darken-2',
    iconColor: 'teal'
  },
  {
    title: '本月收入',
    value: '¥86,540',
    change: '+23%',
    icon: 'mdi-currency-cny',
    color: 'deep-orange-darken-2',
    iconColor: 'deep-orange'
  },
  {
    title: '客户数量',
    value: '32',
    change: '+8%',
    icon: 'mdi-account-group',
    color: 'purple-darken-2',
    iconColor: 'purple'
  }
])

// 图表时间范围
const chartRange = ref('month')

// 最近活动数据
const recentActivities = ref([
  {
    action: '新订单创建',
    details: '订单 #ORD-10023 发往上海市',
    time: '10分钟前',
    color: 'blue'
  },
  {
    action: '车辆维护',
    details: '沪A12345 完成定期保养',
    time: '2小时前',
    color: 'green'
  },
  {
    action: '系统更新',
    details: '已升级至 v2.3.0 版本',
    time: '昨天',
    color: 'orange'
  }
])

// 待办任务
const pendingTasks = ref([
  {
    id: 1,
    title: '审核本月运输合同',
    priority: '高',
    dueDate: '2023-06-15',
    completed: false
  },
  {
    id: 2,
    title: '安排车辆季度检修',
    priority: '中',
    dueDate: '2023-06-20',
    completed: false
  }
])

// 优先级颜色映射
const getPriorityColor = (priority) => {
  const colors = {
    '高': 'red',
    '中': 'orange',
    '低': 'green'
  }
  return colors[priority] || 'grey'
}
</script>

<!--<style scoped>-->

<!--/* 自定义卡片悬停效果 */-->

<!--.v-card:hover {-->
<!--  transform: translateY(-2px);-->
<!--  transition: transform 0.3s ease;-->
<!--}-->

<!--/* 时间线项目间距 */-->
<!--.v-timeline-item {-->
<!--  padding-bottom: 16px;-->
<!--}-->

<!--/* 响应式调整 */-->
<!--@media (max-width: 960px) {-->
<!--  .v-col-md-8, .v-col-md-4 {-->
<!--    flex: 0 0 100%;-->
<!--    max-width: 100%;-->
<!--  }-->
<!--} -->

<!--</style>-->