const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const vehicleRoutes = require('./vehicle');
app.use(bodyParser.json());

let orders = [
    { id: 1, customer: '客户A', goods: '商品A', status: '运输中' },
    { id: 2, customer: '客户B', goods: '商品B', status: '已完成' }
];

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.post('/orders', (req, res) => {
    const newOrder = { ...req.body, id: orders.length + 1 };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.listen(port, () => {
    console.log(`TMS server running on http://localhost:${port}`);
});

app.use('/api', vehicleRoutes);

// 引入车辆 API

app.use('/api', vehicleRoutes);  // 所有车辆相关的 API 路由都会加上 /api 前缀

app.listen(port, () => {
    console.log(`TMS server running on http://localhost:${port}`);
});


