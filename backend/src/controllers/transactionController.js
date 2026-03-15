const Transaction = require('../models/Transaction');

// GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
      Transaction.countDocuments(query),
    ]);

    res.json({ success: true, total, page: parseInt(page), transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar transações.' });
  }
};

// POST /api/transactions
exports.createTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date, notes } = req.body;

    if (!description || !amount || !type || !category) {
      return res.status(400).json({ success: false, message: 'Campos obrigatórios faltando.' });
    }

    const transaction = await Transaction.create({
      description,
      amount: Math.abs(amount),
      type,
      category,
      date: date || new Date(),
      notes,
      user: req.user._id,
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar transação.' });
  }
};

// DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transação não encontrada.' });
    }
    await transaction.deleteOne();
    res.json({ success: true, message: 'Transação removida.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao remover transação.' });
  }
};

// GET /api/transactions/summary
exports.getSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const targetMonth = parseInt(month) || now.getMonth() + 1;
    const targetYear = parseInt(year) || now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const result = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = result.find((r) => r._id === 'income')?.total || 0;
    const expense = result.find((r) => r._id === 'expense')?.total || 0;

    res.json({
      success: true,
      summary: { income, expense, balance: income - expense, month: targetMonth, year: targetYear },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao calcular resumo.' });
  }
};
