// backend/vehicle.js
const express = require('express');
const router = express.Router();

// 假设你有一个简单的车辆列表
let vehicles = [
  { id: 1, plate: 'AB1234', type: '卡车', status: '空闲' },
  { id: 2, plate: 'XY5678', type: '厢式货车', status: '运输中' }
];

// 车辆相关的 API 路由
router.get('/vehicles', (req, res) => {
  res.json(vehicles);
});

router.post('/vehicles', (req, res) => {
  const newVehicle = { ...req.body, id: vehicles.length + 1 };
  vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

module.exports = router;
