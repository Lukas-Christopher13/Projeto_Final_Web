const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Gera token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Formata resposta com token
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'E-mail e senha são obrigatórios.',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Conta desativada. Contate o administrador.',
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

// POST /api/auth/google
// Autentica via Google Identity Services (token ID do frontend)
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Token Google não fornecido.' });
    }

    // Verifica o token com a API do Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Busca usuário existente por googleId ou email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Primeiro login Google - cria automaticamente como member
      // (Admin pode gerenciar roles depois no painel)
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        role: 'member',
        isActive: true,
      });
    } else {
      // Atualiza dados do Google se necessário
      if (!user.googleId) user.googleId = googleId;
      if (!user.avatar && picture) user.avatar = picture;
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Conta desativada. Contate o administrador.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Erro no Google Auth:', error);
    res.status(401).json({ success: false, message: 'Token Google inválido.' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro interno.' });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logout realizado com sucesso.' });
};
