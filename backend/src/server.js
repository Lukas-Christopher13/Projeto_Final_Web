require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const User = require('./models/User');

// Rotas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Conecta ao banco de dados
connectDB();

// Middlewares globais
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada.' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor.',
  });
});

// Cria admin padrão na primeira execução
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Administrador',
        email: process.env.ADMIN_EMAIL || 'admin@financeapp.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
      });
      console.log('✅ Admin padrão criado!');
      console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@financeapp.com'}`);
      console.log(`   Senha: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    }
  } catch (err) {
    console.error('Erro ao criar admin padrão:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  await createDefaultAdmin();
});

module.exports = app;
