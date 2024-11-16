const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  email: {
    type: String, required: true, unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Email inválido',
    },
  },
  password: { type: String, required: true, minlength: 6, },
  cpf: {
    type: String, required: true, unique: true,
    validate: {
      validator: (value) => {
        const cleanCpf = value.replace(/\D/g, '');
        return validator.isLength(cleanCpf, { min: 11, max: 11 }) && validator.isNumeric(cleanCpf);
      },
      message: 'CPF deve ter 11 caracteres numéricos',
    },
  },
  phone: {
    type: String, required: true, validate: {
      validator: (value) => {
        const cleanPhone = value.replace(/\D/g, '');
        return (cleanPhone.length === 10 || cleanPhone.length === 11) && validator.isNumeric(cleanPhone);
      },
      message: 'Telefone deve ter 10 ou 11 caracteres numéricos',
    },
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user', },
  createdAt: { type: Date, default: Date.now, },
});

userSchema.pre('save', async function (next) {
  if (this.cpf) {
    this.cpf = this.cpf.replace(/\D/g, '');
  }
  if (this.phone) {
    this.phone = this.phone.replace(/\D/g, '');
  }


  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
