import React from 'react';
import axios from 'axios';
import { MessageSquare, CheckCircle, Phone, DollarSign } from 'lucide-react';

const RemindersTable = ({ reminders, onReminderCompleted }) => {
    const handleComplete = async (id) => {
        try {
            await axios.patch(`http://localhost:5001/api/customers/${id}/complete`);
            onReminderCompleted();
        } catch (error) {
            console.error('Error completing reminder', error);
        }
    };

    const getWhatsAppUrl = (contact, name) => {
        const message = `Hello ${name}, this is a reminder from Your Medical Store. Your medicines might be finishing soon. Please visit us to refill your prescription.`;
        return `https://wa.me/${contact}?text=${encodeURIComponent(message)}`;
    };

    const openWhatsApp = (contact, name) => {
        window.open(getWhatsAppUrl(contact, name), '_blank');
    };

    const sendAllMessages = () => {
        reminders.forEach((customer, index) => {
            // Slight delay to help browser handle multiple popups
            setTimeout(() => {
                window.open(getWhatsAppUrl(customer.contact, customer.name), '_blank');
            }, index * 600);
        });
    };

    if (reminders.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <CheckCircle size={48} color="var(--medical-green)" style={{ marginBottom: '1rem' }} />
                <h3>No Reminders!</h3>
                <p color="var(--secondary)">Everything is up to date.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>All Active Reminders</h2>
                <button
                    className="btn btn-primary"
                    onClick={sendAllMessages}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <MessageSquare size={18} /> Send Message to All
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Contact</th>
                            <th>Reminder Date</th>
                            <th>Last Bill</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reminders.map((customer) => (
                            <tr key={customer._id}>
                                <td style={{ fontWeight: 600 }}>{customer.name}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Phone size={14} color="var(--secondary)" />
                                        {customer.contact}
                                    </div>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                                        {new Date(customer.reminderDate).toLocaleDateString()}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                                        <DollarSign size={14} />
                                        {customer.billAmount}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn btn-success"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                            onClick={() => openWhatsApp(customer.contact, customer.name)}
                                        >
                                            <MessageSquare size={16} /> Message
                                        </button>
                                        <button
                                            className="btn"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.85rem',
                                                backgroundColor: 'var(--gray-200)',
                                                color: 'var(--gray-800)'
                                            }}
                                            onClick={() => handleComplete(customer._id)}
                                        >
                                            <CheckCircle size={16} /> Done
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RemindersTable;
