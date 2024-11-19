const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();
router.post('/add', async (req, res) => {
  const { userEmail, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userEmail });

    if (!cart) {
      cart = new Cart({ userEmail, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.equals(productId));

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:userEmail', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userEmail: req.params.userEmail }).populate('items.productId');
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/remove', async (req, res) => {
  const { userEmail, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userEmail });

    if (!cart) return res.status(404).json({ message: 'Carrinho não encontrado' });

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/clear', async (req, res) => {
  const { userEmail } = req.body;

  try {
    const cart = await Cart.findOne({ userEmail });

    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Carrinho limpo com sucesso', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
