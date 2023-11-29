const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

// Mongo DB conncetion
const database = process.env.MONGO_URL;
mongoose.set('strictQuery', false);
mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MONGO CONNECTION OPEN!!'))
    .catch(err => console.log(err));
    
const saltLength = 10;
//Seed User For admin
const seedDB = async () => {
    const salt = await bcrypt.genSalt(saltLength);
    const password = await bcrypt.hash("admin!@#", salt)
    const seedUsers = [
        {
            firstName: "admin",
            lastName: "admin",
            email: "admin@admin.com",
            role: "admin",
            gender: 'male',
            location: 'Rothschild Boulevard, Tel Aviv-Yafo, Israel',
            latitude: '32.0654326',
            longitude: '34.7766433',
            password: password
        }
    ];
    await User.deleteMany({});
    await User.insertMany(seedUsers);
}

seedDB().then(() => {
    mongoose.connection.close();
})