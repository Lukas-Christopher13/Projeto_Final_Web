const express = require('express');
const router = express.Router();
const {
  getMembers,
  addMember,
  toggleMember,
  deleteMember,
  getStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect, authorize('admin'));

router.get('/members', getMembers);
router.post('/members', addMember);
router.patch('/members/:id/toggle', toggleMember);
router.delete('/members/:id', deleteMember);
router.get('/stats', getStats);

module.exports = router;
