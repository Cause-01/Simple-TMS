const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// 启用 CORS
app.use(cors({
    origin: '*',  // 允许所有域名的请求
}));

// 解析 JSON 请求体
app.use(bodyParser.json());

// 示例订单数据
let orders = [
    { id: 1, customer: '客户A', goods: '商品A', status: '运输中' },
    { id: 2, customer: '客户B', goods: '商品B', status: '已完成' }
];

// 定义 API 路由
app.get('/api/orders', (req, res) => {
    res.json(orders);  // 返回订单数据
});

// 启动服务器
app.listen(port, () => {
    console.log(`TMS server running on http://localhost:${port}`);
});
