const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }

        const token = authHeader.replace('Bearer ', '');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('role'); 
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Permissão negada.' });
        }

        req.user = { id: user._id, role: user.role };
        next();
    } catch (error) {
        console.error('Erro na verificação de token:', error.message);
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = isAdmin;
