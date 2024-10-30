const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts } = require('../controllers/productController');

// POST: Criar um produto
router.post('/', createProduct);

// GET: Listar todos os produtos
router.get('/', getAllProducts);

module.exports = router;
