import { createRouter, createWebHistory } from 'vue-router';
import OrderList from './components/OrderList.vue';
import CreateOrder from './components/CreateOrder.vue';
import VehicleList from './components/VehicleList.vue';
import AddVehicle from './components/AddVehicle.vue';

const routes = [
  { path: '/', component: OrderList, name: 'OrderList' },
  { path: '/create', component: CreateOrder, name: 'CreateOrder' },
  { path: '/vehicles', component: VehicleList, name: 'VehicleList' },  // 车辆管理列表
  { path: '/vehicles/add', component: AddVehicle, name: 'AddVehicle' },  // 添加新车辆
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
