// backend/vehicle.js
const express = require('express');
const router = express.Router();

let vehicles = [
  { id: 1, plate: 'AB1234', type: '货车', status: '空闲' },
  { id: 2, plate: 'XY5678', type: '厢式车', status: '运输中' }
];

// 获取所有车辆信息
router.get('/vehicles', (req, res) => {
  res.json(vehicles);
});

// 创建新车辆
router.post('/vehicles', (req, res) => {
  const { plate, type, status } = req.body;
  const newVehicle = { id: vehicles.length + 1, plate, type, status };
  vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

// 更新车辆信息
router.put('/vehicles/:id', (req, res) => {
  const { id } = req.params;
  const { plate, type, status } = req.body;
  let vehicle = vehicles.find(v => v.id == id);

  if (vehicle) {
    vehicle.plate = plate;
    vehicle.type = type;
    vehicle.status = status;
    res.json(vehicle);
  } else {
    res.status(404).send('车辆未找到');
  }
});

// 删除车辆
router.delete('/vehicles/:id', (req, res) => {
  const { id } = req.params;
  vehicles = vehicles.filter(v => v.id != id);
  res.status(204).send();
});

module.exports = router;

