const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const isAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão.' });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = isAdmin;
