import express from 'express';
const router = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
  res.send('Rota de utilizadores funcionando');
});

module.exports = router;