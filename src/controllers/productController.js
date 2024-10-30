const Product = require('../models/Product');

// Criar Produto
const createProduct = async (req, res) => {
    console.log(req.body); 
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Listar Produtos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct, getAllProducts };
