const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/trainBooking'; // Update this for deployment
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define schema and model
const bookingSchema = new mongoose.Schema({
    from: String,
    to: String,
    date: String,
    travelClass: String,
    flexible: Boolean,
    berth: Boolean,
    searchDate: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema);

// API Endpoint to handle search
app.post('/search', async (req, res) => {
    try {
        const { from, to, date, travelClass, flexible, berth } = req.body;

        // Save search details to the database
        const newBooking = new Booking({ from, to, date, travelClass, flexible, berth });
        await newBooking.save();

        // Simulate finding trains (use real logic in production)
        const mockTrains = [
            { trainName: 'Express A', departure: '10:00 AM', arrival: '4:00 PM' },
            { trainName: 'Express B', departure: '2:00 PM', arrival: '8:00 PM' },
        ];

        if (mockTrains.length) {
            res.json({ success: true, trains: mockTrains });
        } else {
            res.json({ success: false, message: 'No trains found.' });
        }
    } catch (error) {
        console.error('Error processing search:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
