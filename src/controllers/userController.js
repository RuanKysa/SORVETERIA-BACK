const User = require('../models/User');

// Criar Usuário
const createUser = async (req, res) => {
    console.log(req.body);
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Listar Usuários
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Não retorna a senha
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter Usuário por ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password'); // Não retorna a senha
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar Usuário
const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário atualizado com sucesso', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deletar Usuário
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
