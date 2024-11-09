const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// Middleware para verificar o token JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // O ID do usuário estará aqui
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar se o usuário é um admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Você não tem permissão.' });
  }
  next();
};

// Rota para registrar um novo usuário e fazer login
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha muito curta'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('cpf').notEmpty().withMessage('CPF é obrigatório'),
    body('phone').notEmpty().withMessage('Telefone é obrigatório'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, cpf, phone } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }

      const user = await User.create({ name, email, password, cpf, phone });

      const token = generateToken(user._id); 

      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
  }
);

// Rota para fazer login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
});

// Rota para obter os dados do usuário logado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter dados do usuário' });
  }
});

// Rota para obter todos os usuários (somente para admin)
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

// Rota para editar um usuário (somente para admin)
router.put('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, cpf, phone } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.cpf = cpf || user.cpf;
    user.phone = phone || user.phone;

    await user.save();

    res.json({ message: 'Usuário atualizado', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// Rota para deletar um usuário (somente para admin)
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.remove();
    res.json({ message: 'Usuário deletado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
});

module.exports = router;
