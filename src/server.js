const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes'); 


const cors = require('cors');

const session = require('express-session');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Configuração da sessão
app.use(session({
  secret: 'ruan', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());

app.use('/api/products', productRoutes);
console.log('Rotas de produtos carregadas');
app.use('/api/users', userRoutes);
console.log('Rotas de usuários carregadas');
app.use('/uploads', express.static('uploads'));
app.use('/api/cart', cartRoutes);
console.log('Rotas de carrinho carregadas');
app.use('/api/orders', orderRoutes);
console.log('Rotas de pedidos carregadas');

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
