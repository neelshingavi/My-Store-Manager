const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medical-reminder';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Medical Store Reminder API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
