const express = require('express');
const {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getOrderById,
} = require('../controllers/orderController');

const router = express.Router();

// Rotas
router.post('/', createOrder);
router.put('/:id', updateOrderStatus);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;
