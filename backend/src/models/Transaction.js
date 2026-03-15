const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Valor é obrigatório'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
