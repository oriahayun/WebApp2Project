const router = require('express').Router();
const { Appointment } = require('../models/Appointment');
const verifyUser = require('../utils/verifyToken');
const mongoose = require('mongoose');

router.get('/', verifyUser(['admin', 'user']), async (req, res) => {
    const statusFilter = req.query.status !== '' && typeof req.query.status !== 'undefined' ? { status: req.query.status } : {};
    const permissionFilter = req.user.role !== 'admin' ? { userId: req.user._id } : {};
    const filterParams = {
        ...statusFilter,
        ...permissionFilter,
    };
    const totalCount = await Appointment.countDocuments({});
    const appointments = await Appointment.find(filterParams)
        .populate({
            path: 'userId',
            select: {
                _id: 1, firstName: 1, lastName: 1, email: 1, location: 1,
            },
        })
        .populate({
            path: 'salonId',
            select: {
                _id: 1, name: 1, description: 1,
            },
        })
        .select('-__v');

    return res.send({
        totalCount,
        appointments,
        filteredCount: appointments.length,
    })
});

router.post('/create', verifyUser(['admin', 'user']), async (req, res) => {
    const { startDate, endDate, salon } = req.body;
    const appointment = new Appointment({
        startDate: startDate,
        endDate: endDate,
        salonId: salon,
        userId: req.user._id,
        status: 'pending',
    });
    try {
        const savedAppointment = await appointment.save()

        return res.send({ appointment: savedAppointment, message: 'Appointment successfully created' });
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.put('/update/:id', verifyUser(['admin', 'user']), async (req, res) => {
    const { startDate, endDate, salon } = req.body;
    const updateValues = {
        startDate: startDate,
        endDate: endDate,
        salonId: salon
    }

    const updatedAppointment = await Appointment.findOneAndUpdate({ _id: req.params.id }, updateValues, {
        new: true,
    }).select('-__v');
    return res.send({ appointment: updatedAppointment, message: 'Appointment successfully updated' });
});

router.delete('/delete/:id', verifyUser(['admin', 'user']), async (req, res) => {
    await Appointment.deleteOne({ _id: req.params.id });
    return res.send({ message: 'Appointment successfully deleted!' });
});

router.get('/getAppointment/:id', verifyUser(['admin', 'user']), async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Malformed appointment id');
    }

    const appointment = await Appointment.findById(req.params.id).select('-__v').populate('salonId');;
    if (!appointment) {
        return res.status(400).send('appointment not found');
    }
    return res.send(appointment);
});

router.put('/changeStatus/:id', verifyUser(['admin']), async (req, res) => {
    const updateValues = req.body;
    await Appointment.findOneAndUpdate({ _id: req.params.id }, updateValues, {
        new: true,
    });
    return res.send({ message: 'successfully updated' });
});


module.exports = router;