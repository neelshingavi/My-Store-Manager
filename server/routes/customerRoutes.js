const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const MockDB = require('../mockDb');

// Helper to return current date in India as YYYY-MM-DD
function getIndiaDateString(date = new Date()) {
    const india = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const yyyy = india.getFullYear();
    const mm = String(india.getMonth() + 1).padStart(2, '0');
    const dd = String(india.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

const isDbConnected = () => false; // Forced false for verification without MongoDB

// Add a new customer
router.post('/', async (req, res) => {
    try {
        const { name, contact, address, daysUntilReminder, billAmount, delivery } = req.body;
        console.log('Received payload:', req.body);

        // Validate contact: must be exactly 10 digits
        const contactPattern = /^\d{10}$/;
        if (!contactPattern.test(contact)) {
            return res.status(400).json({ message: 'Contact must be a 10-digit number (digits only).' });
        }

        // Validate delivery option and set default if missing
        const allowedDelivery = ['On counter', 'Home Delivery'];
        const deliveryValue = delivery && typeof delivery === 'string' ? delivery : 'On counter';
        if (!allowedDelivery.includes(deliveryValue)) {
            return res.status(400).json({ message: 'Invalid delivery option.' });
        }

        // Calculate reminder date
        const days = parseInt(daysUntilReminder);
        if (isNaN(days)) {
            return res.status(400).json({ message: 'Invalid daysUntilReminder' });
        }

        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + days);
        reminderDate.setHours(0, 0, 0, 0);

        console.log('Calculated reminderDate:', reminderDate);

        const customerData = {
            name,
            contact,
            address,
            delivery: deliveryValue,
            reminderDate,
            visitedDate: getIndiaDateString(),
            billAmount,
            completed: false
        };

        console.log('customerData:', customerData);

        // Remove any existing records with same contact to prevent duplicates
        try {
            if (isDbConnected()) {
                await Customer.deleteMany({ contact });
                console.log(`Removed existing records for contact ${contact} from MongoDB`);
            } else {
                const removed = await MockDB.deleteByContact(contact);
                if (removed) console.log(`Removed ${removed} existing record(s) for contact ${contact} from MockDB`);
            }
        } catch (delErr) {
            console.error('Error removing duplicates by contact:', delErr);
        }

        if (isDbConnected()) {
            const customer = new Customer(customerData);
            await customer.save();
            res.status(201).json(customer);
        } else {
            console.log('MongoDB not connected, using MockDB');
            const customer = await MockDB.save(customerData);
            res.status(201).json(customer);
        }
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get all pending reminders
router.get('/reminders', async (req, res) => {
    try {
        if (isDbConnected()) {
            const reminders = await Customer.find({
                completed: false
            }).sort({ reminderDate: 1 });
            res.json(reminders);
        } else {
            const reminders = await MockDB.find({ allPending: true });
            // Sort mock data by date
            reminders.sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));
            res.json(reminders);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all customers (including completed)
router.get('/', async (req, res) => {
    try {
        if (isDbConnected()) {
            const customers = await Customer.find().sort({ createdAt: -1 });
            res.json(customers);
        } else {
            const customers = await MockDB.findAll();
            // sort by createdAt descending
            customers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            res.json(customers);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
    try {
        if (isDbConnected()) {
            const deleted = await Customer.findByIdAndDelete(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Customer not found' });
            res.json({ message: 'Deleted' });
        } else {
            const deleted = await MockDB.findByIdAndDelete(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Customer not found' });
            res.json({ message: 'Deleted' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark reminder as completed
router.patch('/:id/complete', async (req, res) => {
    try {
        if (isDbConnected()) {
            const customer = await Customer.findByIdAndUpdate(
                req.params.id,
                { completed: true },
                { new: true }
            );
            res.json(customer);
        } else {
            const customer = await MockDB.findByIdAndUpdate(req.params.id, { completed: true });
            res.json(customer);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Deduplicate entries by contact (keep latest)
router.post('/deduplicate', async (req, res) => {
    try {
        if (isDbConnected()) {
            // For MongoDB we can aggregate and remove duplicates keeping newest
            const duplicates = await Customer.aggregate([
                { $group: { _id: '$contact', count: { $sum: 1 }, docs: { $push: { id: '$_id', createdAt: '$createdAt' } } } },
                { $match: { count: { $gt: 1 } } }
            ]);

            let removed = 0;
            for (const dup of duplicates) {
                const docs = await Customer.find({ contact: dup._id }).sort({ createdAt: -1 });
                const keep = docs[0];
                const removeIds = docs.slice(1).map(d => d._id);
                const resDel = await Customer.deleteMany({ _id: { $in: removeIds } });
                removed += resDel.deletedCount || 0;
            }
            res.json({ removed });
        } else {
            const removed = await MockDB.deduplicate();
            res.json({ removed });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
