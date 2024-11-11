const Order = require('../models/Order');

// Cria um novo pedido
const createOrder = async (req, res) => {
    try {
        const { userEmail, items, address } = req.body;

        if (!userEmail || !items || items.length === 0 || !address) {
            return res.status(400).json({ message: 'Dados do pedido incompletos.' });
        }

        const newOrder = new Order({
            userEmail,
            items,
            address,
            status: 'Pendente',
        });

        await newOrder.save();
        res.status(201).json({ message: 'Pedido criado com sucesso.', order: newOrder });
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        res.status(500).json({ message: 'Erro ao criar o pedido.' });
    }
};

// Atualiza o status de um pedido
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });

        res.status(200).json({ message: 'Status do pedido atualizado.', order });
    } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        res.status(500).json({ message: 'Erro ao atualizar o status.' });
    }
};

// Obtém todos os pedidos
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.productId', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        console.error("Erro ao obter pedidos:", error);
        res.status(500).json({ message: 'Erro ao obter pedidos.' });
    }
};

// Obtém um pedido pelo ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('items.productId', 'name price');
        if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });

        res.status(200).json(order);
    } catch (error) {
        console.error("Erro ao obter pedido:", error);
        res.status(500).json({ message: 'Erro ao obter o pedido.' });
    }
};

// Exclui um pedido pelo ID
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });

        res.status(200).json({ message: 'Pedido excluído com sucesso.' });
    } catch (error) {
        console.error("Erro ao excluir pedido:", error);
        res.status(500).json({ message: 'Erro ao excluir o pedido.' });
    }
};

module.exports = {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getOrderById,
    deleteOrder, // Exporta a função de exclusão de pedido
};
