const User = require('../models/User');
const bcrypt = require('bcryptjs');  // Importando bcrypt para a criptografia, se necessário

// Criar Usuário
const createUser = async (req, res) => {
    console.log(req.body); // Usado apenas para depuração

    const { name, email, password, cpf, phone } = req.body;

    // Validação simples de entrada
    if (!name || !email || !password || !cpf || !phone) {
        return res.status(400).json({ message: 'Campos obrigatórios estão ausentes' });
    }

    try {
        // Verificar se o email já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe com esse email' });
        }

        // Verificar se o CPF já existe
        const cpfExists = await User.findOne({ cpf });
        if (cpfExists) {
            return res.status(400).json({ message: 'Já existe um usuário com esse CPF' });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso', userId: user._id });
    } catch (error) {
        console.error(error);  // Para depuração
        res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
};

// Listar Usuários
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');  // Exclui a senha
        res.json(users);
    } catch (error) {
        console.error(error);  // Para depuração
        res.status(500).json({ message: 'Erro ao listar usuários', error: error.message });
    }
};

// Obter Usuário por ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);  // Para depuração
        res.status(500).json({ message: 'Erro ao obter usuário', error: error.message });
    }
};

// Atualizar Usuário
const updateUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Se a senha for alterada, criptografá-la antes de salvar
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
        console.error(error);  // Para depuração
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
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
        console.error(error);  // Para depuração
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
