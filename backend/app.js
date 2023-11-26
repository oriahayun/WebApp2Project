const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');

const PORT = process.env.PORT || 3008;

// Connect to DB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    // Connection successful
    console.log('💾 Connected to DB')
  })
  .catch((error) => {
    // Handle connection error
    console.log('Connection Error => : ', error.message)
  });

// increase parse limit
app.use(bodyParser.json({ limit: '50mb', extended: true }));

// Middleware
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
    ],
  }),
);

app.use(express.json());
app.use(cookieParser());

// Route middleware
app.get('/', (req, res) => {
  res.send('Salon api server is running!');
});

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen(PORT, () => console.log(`🏎  API Server up and running at ${process.env.SERVER_URL}`));