import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, List, Activity } from 'lucide-react';
import AddCustomer from './components/AddCustomer';
import RemindersTable from './components/RemindersTable';
import AllData from './components/AllData';

function App() {
  const [activeTab, setActiveTab] = useState('reminders');
  const [reminders, setReminders] = useState([]);
  const [allData, setAllData] = useState([]);
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

  const fetchAll = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/customers');
      setAllData(res.data || []);
    } catch (err) {
      console.error('Error fetching all customers', err);
    }
  };

  useEffect(() => {
    fetchReminders();
    fetchAll();
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
          </a>          <a
            className={`nav-item ${activeTab === 'alldata' ? 'active' : ''}`}
            onClick={() => setActiveTab('alldata')}
          >
            All Records
          </a>        </div>
      </nav>

      <main className="container">
        {activeTab === 'reminders' ? (
          <RemindersTable
            reminders={reminders}
            onReminderCompleted={() => { fetchReminders(); fetchAll(); }}
            loading={loading}
          />
        ) : activeTab === 'add' ? (
          <AddCustomer
            onCustomerAdded={() => {
              fetchReminders();
              fetchAll();
              setActiveTab('reminders');
            }}
          />
        ) : (
          <AllData
            data={allData}
            refreshAll={fetchAll}
            onChange={() => { fetchReminders(); fetchAll(); }}
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
