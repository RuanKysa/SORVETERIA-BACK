const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Configuração da sessão
app.use(session({
  secret: 'ruan', // Use um segredo seguro em produção
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

app.use(cors());
app.use(cookieParser());

// Rotas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/cart', cartRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
