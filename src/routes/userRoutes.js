const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const generateToken = require('../utils/generateToken');

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

// Rota para registrar um novo usuário e fazer login
router.post('/register', async (req, res) => {
  const { name, email, password, cpf, phone, address } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criação do novo usuário
    const user = await User.create({
      name,
      email,
      password,
      cpf,
      phone,
      address,
    });

    // Gera o token para o novo usuário
    const token = generateToken(user._id);  // Gerar o token

    // Retorna o token no response junto com os dados do usuário
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token, // Envia o token gerado para o cliente
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
});


// Rota para fazer login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera o token usando o ID do usuário
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
    // O ID do usuário vem do token
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ email: user.email, name: user.name }); // Retornando dados do usuário
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter dados do usuário' });
  }
});

module.exports = router;
