import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, List, Activity } from 'lucide-react';
import AddCustomer from './components/AddCustomer';
import RemindersTable from './components/RemindersTable';

function App() {
  const [activeTab, setActiveTab] = useState('reminders');
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/customers/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">
          <Activity size={28} /> MedicalReminder
        </div>
        <div className="nav-links">
          <a
            className={`nav-item ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab('reminders')}
          >
            Reminders
          </a>
          <a
            className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Customer
          </a>
        </div>
      </nav>

      <main className="container">
        {activeTab === 'reminders' ? (
          <RemindersTable
            reminders={reminders}
            onReminderCompleted={fetchReminders}
            loading={loading}
          />
        ) : (
          <AddCustomer
            onCustomerAdded={() => {
              fetchReminders();
              setActiveTab('reminders');
            }}
          />
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} Medical Store Customer Reminder Management System
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          Disclaimer: This system is for convenience and does not replace medical advice.
        </p>
      </footer>
    </div>
  );
}

export default App;
