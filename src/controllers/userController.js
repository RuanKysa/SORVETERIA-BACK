const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    console.log(req.body);

    const { name, email, password, cpf, phone } = req.body;

    if (!name || !email || !password || !cpf || !phone) {
        return res.status(400).json({ message: 'Campos obrigatórios estão ausentes' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe com esse email' });
        }

        const cpfExists = await User.findOne({ cpf });
        if (cpfExists) {
            return res.status(400).json({ message: 'Já existe um usuário com esse CPF' });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso', userId: user._id });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro ao listar usuários', error: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        res.status(500).json({ message: 'Erro ao obter usuário', error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário atualizado com sucesso', user });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    console.log(`Tentando excluir usuário com ID: ${id}`);

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            console.log(`Usuário não encontrado: ${id}`);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        console.log(`Usuário excluído com sucesso: ${user._id}`);
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
