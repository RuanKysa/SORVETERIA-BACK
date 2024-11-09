const jwt = require('jsonwebtoken');
const User = require('../models/User'); // O modelo de usuário, onde a role é armazenada

// Middleware de verificação de autenticação e autorização
const isAdmin = async (req, res, next) => {
    try {
        // Verificar se o token está presente no cabeçalho Authorization
        const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }

        // Decodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId); // Encontrar o usuário no banco de dados
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Verificar se o usuário tem a role de administrador
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão.' });
        }

        req.user = user; // Adiciona o usuário à requisição
        next(); // Chama o próximo middleware ou a rota
    } catch (error) {
        // Caso o token seja inválido ou expirado
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = isAdmin;
