const router = require('express').Router();
const { Appointment } = require('../models/Appointment');
const verifyUser = require('../utils/verifyToken');
const mongoose = require('mongoose');

router.get('/', verifyUser(['admin', 'user']), async (req, res) => {
    const roleFilter = req.user.role !== 'admin' ? { userId: new mongoose.Types.ObjectId(req.user._id) } : {};
    const statusFilter = req.query.status !== '' && typeof req.query.status !== 'undefined' ? { status: req.query.status } : {};
    const report = await Appointment.aggregate([
        {
            $match: {
                ...statusFilter,
                ...roleFilter
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" }
                },
                groupedDate: { $min: '$createdAt' },
                appointments: { $sum: 1 }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "_id.day": 1
            }
        }

    ]);

    return res.send(report)
});

module.exports = router;