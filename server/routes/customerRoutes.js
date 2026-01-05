const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const MockDB = require('../mockDb');

const isDbConnected = () => false; // Forced false for verification without MongoDB

// Add a new customer
router.post('/', async (req, res) => {
    try {
        const { name, contact, address, daysUntilReminder, billAmount } = req.body;
        console.log('Received payload:', req.body);

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
            reminderDate,
            billAmount,
            completed: false
        };

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

module.exports = router;
