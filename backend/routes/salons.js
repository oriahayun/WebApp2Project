const router = require('express').Router();
const { Salon } = require('../models/Salon');
const verifyUser = require('../utils/verifyToken');
const mongoose = require('mongoose');

router.get('/', verifyUser(['admin', 'user']), async (req, res) => {

    const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';
    const filterParams = {
        $and: [
            {
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { location: { $regex: searchQuery, $options: 'i' } },
                ],
            },
        ],
    };
    const totalCount = await Salon.countDocuments({});
    const salons = await Salon.find(filterParams).select('-__v');

    return res.send({
        totalCount,
        salons,
        filteredCount: salons.length,
    })
});

router.post('/create', verifyUser(['admin']), async (req, res) => {
    const { name, location, latitude, longitude, description } = req.body;
    const salon = new Salon({
        name: name,
        location: location,
        latitude: latitude,
        longitude: longitude,
        description: description
    });
    try {
        const savedSalon = await salon.save()

        return res.send({ salon: savedSalon, message: 'Salon successfully created' });
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.put('/update/:id', verifyUser(['admin', 'user']), async (req, res) => {
    const updateValues = req.body;
    const updatedSalon = await Salon.findOneAndUpdate({ _id: req.params.id }, updateValues, {
        new: true,
    }).select('-__v');
    return res.send({ salon: updatedSalon, message: 'Salon successfully updated' });
});

router.delete('/delete/:id', verifyUser(['admin']), async (req, res) => {
    await Salon.deleteOne({ _id: req.params.id });
    return res.send({ message: 'Salon successfully deleted!' });
});

router.get('/getSalon/:id', verifyUser(['admin']), async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Malformed salon id');
    }

    const salon = await Salon.findById(req.params.id).select('-__v');
    if (!salon) {
        return res.status(400).send('salon not found');
    }
    return res.send(salon);
});

module.exports = router;