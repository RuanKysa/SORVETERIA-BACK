const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const handleError = (res, error, message = 'Erro no servidor') => {
    console.error(message, error);
    res.status(500).json({ message, error: error.message });
};

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidCpf = (cpf) => /^\d{11}$/.test(cpf);

const createUser = async (req, res) => {
    const { name, email, password, cpf, phone } = req.body;

    if (!name || !email || !password || !cpf || !phone) {
        return res.status(400).json({ message: 'Campos obrigatórios estão ausentes' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Email inválido' });
    }

    if (!isValidCpf(cpf)) {
        return res.status(400).json({ message: 'CPF inválido' });
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

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new User({ name, email, password: hashedPassword, cpf, phone });
        await user.save();

        res.status(201).json({ message: 'Usuário criado com sucesso', userId: user._id });
    } catch (error) {
        handleError(res, error, 'Erro ao criar usuário');
    }
};

const getAllUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const users = await User.find()
            .select('-password')
            .limit(limit)
            .skip((page - 1) * limit);

        const totalUsers = await User.countDocuments();
        res.json({ users, total: totalUsers, page, totalPages: Math.ceil(totalUsers / limit) });
    } catch (error) {
        handleError(res, error, 'Erro ao listar usuários');
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
        handleError(res, error, 'Erro ao obter usuário');
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const allowedUpdates = ['name', 'email', 'password', 'phone'];
    const updates = Object.keys(req.body).filter((key) => allowedUpdates.includes(key));

    if (updates.length === 0) {
        return res.status(400).json({ message: 'Nenhum campo válido para atualizar' });
    }

    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
    } catch (error) {
        handleError(res, error, 'Erro ao atualizar usuário');
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        handleError(res, error, 'Erro ao deletar usuário');
    }
};

module.exports = {
    createUser, getAllUsers, getUserById, updateUser, deleteUser,
};
