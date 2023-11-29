const mongoose = require("mongoose");

const salonSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        description: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updateAt: { type: Date, default: Date.now, required: false },
    }
);

const Salon = mongoose.model("Salon", salonSchema);

module.exports = { Salon };