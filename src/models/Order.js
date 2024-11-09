const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true },
        },
    ],
    address: {
        street: { type: String, required: true },
        number: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    status: { type: String, default: "pendente" }, // Novo campo para status do pedido
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
