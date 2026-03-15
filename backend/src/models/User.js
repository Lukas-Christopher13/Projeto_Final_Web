const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'E-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'E-mail inválido'],
    },
    password: {
      type: String,
      minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
      select: false, // nunca retorna senha por padrão
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    googleId: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    temporaryPassword: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove campos sensíveis do JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.googleId;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
