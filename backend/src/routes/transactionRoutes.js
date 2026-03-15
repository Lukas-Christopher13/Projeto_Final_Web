const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);
router.get('/summary', getSummary);

module.exports = router;
