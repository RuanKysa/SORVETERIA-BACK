const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true, enum: ["PICOLES DE FRUTA", "PICOLES DE CREME", "BOLOS DE SORVETE", "POTES", "POTINHOS"] },
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
