const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true,
        match: [/^\\d{10}$/, 'Contact must be a 10-digit number (digits only).'],
        minlength: 10,
        maxlength: 10
    },
    address: {
        type: String,
        trim: true
    },
    delivery: {
        type: String,
        enum: ['On counter', 'Home Delivery'],
        default: 'On counter'
    },
    reminderDate: {
        type: Date,
        required: true
    },
    visitedDate: {
        // Stored as YYYY-MM-DD according to India timezone
        type: String,
        default: function() {
            const now = new Date();
            const india = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            const yyyy = india.getFullYear();
            const mm = String(india.getMonth() + 1).padStart(2, '0');
            const dd = String(india.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    },
    billAmount: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Customer', customerSchema);
