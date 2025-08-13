import { createRouter, createWebHistory } from 'vue-router';
import OrderList from './components/OrderList.vue';
import CreateOrder from './components/CreateOrder.vue';

const routes = [
    { path: '/', component: OrderList, name: 'OrderList' },
    { path: '/create', component: CreateOrder, name: 'CreateOrder' },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
