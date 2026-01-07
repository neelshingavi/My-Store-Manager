import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Calendar, Phone, MapPin, DollarSign } from 'lucide-react';

const AddCustomer = ({ onCustomerAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        address: '',
        daysUntilReminder: '',
        billAmount: '',
        delivery: 'On counter'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        // For contact field, allow only digits and cap at 10 characters
        if (e.target.name === 'contact') {
            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, contact: digitsOnly });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Client-side validation for contact: must be exactly 10 digits
        const contactPattern = /^\d{10}$/;
        if (!contactPattern.test(formData.contact)) {
            setMessage({ type: 'danger', text: 'Contact must be 10 digits (numbers only).' });
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/customers', formData);
            setMessage({ type: 'success', text: 'Customer added successfully!' });
            setFormData({
                name: '',
                contact: '',
                address: '',
                daysUntilReminder: '',
                billAmount: '',
                delivery: 'On counter'
            });
            if (onCustomerAdded) onCustomerAdded();
        } catch (error) {
            setMessage({ type: 'danger', text: error.response?.data?.message || 'Error adding customer' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2><UserPlus size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Add New Customer</h2>
            {message.text && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: 'var(--radius)',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    fontWeight: 500
                }}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label"><Phone size={16} /> Contact Number</label>
                    <input
                        className="form-control"
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 9876543210"
                        inputMode="numeric"
                        pattern="\d{10}"
                        maxLength={10}
                        aria-label="Contact number, 10 digits"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Delivery</label>
                    <select
                        className="form-control"
                        name="delivery"
                        value={formData.delivery}
                        onChange={handleChange}
                        aria-label="Delivery option"
                    >
                        <option value="On counter">On counter</option>
                        <option value="Home Delivery">Home Delivery</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label"><UserPlus size={16} /> Customer Name</label>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Full Name"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label"><MapPin size={16} /> Address</label>
                    <input
                        className="form-control"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Optional"
                    />
                </div>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label"><Calendar size={16} /> Days until Remind</label>
                        <input
                            className="form-control"
                            type="number"
                            name="daysUntilReminder"
                            value={formData.daysUntilReminder}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 30"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><DollarSign size={16} /> Bill Amount</label>
                        <input
                            className="form-control"
                            type="number"
                            name="billAmount"
                            value={formData.billAmount}
                            onChange={handleChange}
                            required
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                    {loading ? 'Adding...' : 'Save Customer Details'}
                </button>
            </form>
        </div>
    );
};

export default AddCustomer;
