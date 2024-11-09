const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // Para validação adicional

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Email inválido',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isLength(value, { min: 11, max: 11 }) && validator.isNumeric(value),
      message: 'CPF deve ter 11 caracteres numéricos',
    },
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Método para criptografar a senha antes de salvar o usuário
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar a senha durante o login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
