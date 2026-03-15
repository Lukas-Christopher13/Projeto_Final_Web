const User = require('../models/User');

// GET /api/admin/members
exports.getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' }).sort({ createdAt: -1 });
    res.json({ success: true, count: members.length, members });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar membros.' });
  }
};

// POST /api/admin/members
exports.addMember = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, e-mail e senha são obrigatórios.',
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'E-mail já cadastrado.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'member',
      temporaryPassword: true,
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Erro ao adicionar membro:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar membro.' });
  }
};

// PATCH /api/admin/members/:id/toggle
exports.toggleMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Não é possível desativar um admin.' });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, user, message: `Usuário ${user.isActive ? 'ativado' : 'desativado'}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar usuário.' });
  }
};

// DELETE /api/admin/members/:id
exports.deleteMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Não é possível excluir um admin.' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'Membro removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao remover membro.' });
  }
};

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const activeMembers = await User.countDocuments({ role: 'member', isActive: true });

    res.json({
      success: true,
      stats: { totalMembers, activeMembers, inactiveMembers: totalMembers - activeMembers },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas.' });
  }
};
