const express = require('express');
const router = express.Router();

router.post('/add', (req, res) => {
    const { productId, quantity } = req.body;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    const existingProduct = req.session.cart.find(item => item.productId === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        req.session.cart.push({ productId, quantity });
    }
    res.status(200).json({ message: 'Produto adicionado ao carrinho' });
});

router.get('/', (req, res) => {
    res.status(200).json({ cart: req.session.cart || [] });
});

module.exports = router;
