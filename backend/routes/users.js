const router = require('express').Router();
const User = require('../models/User');
const verifyUser = require('../utils/verifyToken');

router.get('/', verifyUser(['admin']), async (req, res) => {
  const totalCount = await User.countDocuments({});
  const users = await User.find();

  return res.send({
    totalCount,
    results: users
  })
});

router.get('/me', verifyUser(['admin', 'user']), async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v');

  return res.send({ user: user })
});

module.exports = router;