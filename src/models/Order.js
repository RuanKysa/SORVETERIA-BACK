const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    address: { type: String, required: true },
    status: { type: String, default: 'Pendente' },  // Status inicial do pedido
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
