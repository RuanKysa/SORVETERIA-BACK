const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Rota para criar um pedido
router.post('/orders', async (req, res) => {
    const { userEmail, items, address } = req.body;

    try {
        // Criação de um novo pedido no banco de dados
        const newOrder = new Order({
            userEmail,
            items,
            address,
            status: 'Pendente',  // Defina o status do pedido como 'Pendente' inicialmente
            createdAt: new Date(),
        });

        await newOrder.save();
        res.status(201).json({ message: 'Pedido criado com sucesso', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar pedido', error });
    }
});

// Rota para obter todos os pedidos de um usuário
router.get('/orders/user/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Buscando todos os pedidos que correspondem ao email do usuário
        const orders = await Order.find({ userEmail: email });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Nenhum pedido encontrado para esse usuário' });
        }

        res.status(200).json(orders);  // Retorna todos os pedidos
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedidos', error });
    }
});

// Rota para obter o status do pedido mais recente usando o email
router.get('/orders/status/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Buscando o último pedido feito pelo usuário (ou o pedido mais recente)
        const order = await Order.findOne({ userEmail: email }).sort({ createdAt: -1 });

        if (!order) {
            return res.status(404).json({ message: 'Nenhum pedido encontrado para esse usuário' });
        }

        res.status(200).json({ status: order.status, orderId: order._id }); // Retorna o status do pedido
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o status do pedido', error });
    }
});

// Rota para obter um pedido específico por ID
router.get('/orders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Buscando o pedido pelo ID
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        res.status(200).json(order);  // Retorna o pedido específico
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedido', error });
    }
});

// Rota para atualizar o status de um pedido
router.put('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        // Atualizando o status do pedido
        order.status = status || order.status;
        await order.save();

        res.status(200).json({ message: 'Status do pedido atualizado', order });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o status', error });
    }
});

module.exports = router;
