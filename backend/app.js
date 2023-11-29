const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const salonRoute = require('./routes/salons');
const reportRoute = require('./routes/reports');
const appointmentRoute = require('./routes/appointments');

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
app.use('/api/salons', salonRoute);
app.use('/api/appointments', appointmentRoute);
app.use('/api/reports', reportRoute);

const server = http.createServer(app);
// Set up Socket.io with proper CORS handling
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000'], // Include all client app origins
    methods: ["GET", "POST"], // Allowed methods
    credentials: true // Enable credentials (cookies, sessions, etc.)
  }
});

const activeUsers = new Set();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('login', (userId) => {
    activeUsers.add(userId);
    io.emit('activeUsers', Array.from(activeUsers)); // Update all clients
  });

  socket.on('logout', (userId) => {
    activeUsers.delete(userId);
    io.emit('activeUsers', Array.from(activeUsers)); // Update all clients
  });

  socket.on('disconnect', () => {
    // Handle user disconnect if necessary
    console.log('Client disconnected:', socket.id);
  });
});
server.listen(PORT, () => console.log(`🏎  API Server up and running at ${process.env.SERVER_URL}`));