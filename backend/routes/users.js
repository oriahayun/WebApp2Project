const router = require('express').Router();
const User = require('../models/User');
const verifyUser = require('../utils/verifyToken');
const mongoose = require('mongoose');

router.get('/', verifyUser(['admin']), async (req, res) => {
  const roleFilter = req.query.role !== '' && typeof req.query.role !== 'undefined' ? { role: req.query.role } : {};
  const statusFilter = req.query.status !== '' && typeof req.query.status !== 'undefined' ? { status: req.query.status } : {};
  const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';
  const filterParams = {
    $and: [
      {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
        ],
      },
      roleFilter,
      statusFilter
    ],
  };
  const totalCount = await User.countDocuments({});
  const users = await User.find(filterParams).select('-password -__v');

  return res.send({
    totalCount,
    users,
    filteredCount: users.length,
  })
});

router.put('/update/:id', verifyUser(['admin', 'user']), async (req, res) => {
  const updateValues = req.body;
  const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, updateValues, {
    new: true,
  }).select('-password -__v');
  return res.send({ user: updatedUser, message: 'User successfully updated' });
});

router.delete('/delete/:id', verifyUser(['admin']), async (req, res) => {
  await User.deleteOne({ _id: req.params.id });
  return res.send({ message: 'User successfully deleted!' });
});

router.get('/getUser/:id', verifyUser(['admin']), async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Malformed user id');
  }

  const user = await User.findById(req.params.id).select('-password -__v');
  if (!user) {
    return res.status(400).send('user not found');
  }
  return res.send(user);
});

router.get('/personal/me', verifyUser(['admin', 'user']), async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v');

  return res.send({ user: user })
});

router.get('/logout', verifyUser(['admin', 'user']), async (req, res) => {
  res.cookie('refreshToken', '', { maxAge: 1 });
  await User.findOneAndUpdate({ _id: req.user._id }, { status: 'offline' }, {
    new: true,
  })
  return res.status(200).json({ userId: req.user._id, status: 'success' });
});

module.exports = router;