import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Trash2, Download, Phone, DollarSign } from 'lucide-react';

const AllData = ({ onChange, data: propData, refreshAll }) => {
    const [data, setData] = useState(propData || []);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc'); // 'asc' or 'desc'

    const normalize = (v) => (v === undefined || v === null ? '' : String(v).toLowerCase());

    const filterAndSortData = React.useCallback(() => {
        const q = (searchQuery || '').trim().toLowerCase();
        let out = (data || []).filter(item => {
            if (!q) return true;
            const name = normalize(item.name);
            const contact = normalize(item.contact);
            return name.includes(q) || contact.includes(q);
        });

        out.sort((a, b) => {
            const key = sortKey;
            let va = a[key];
            let vb = b[key];

            if (key === 'visitedDate') {
                va = va || (a.createdAt ? new Date(new Date(a.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toISOString().slice(0,10) : '');
                vb = vb || (b.createdAt ? new Date(new Date(b.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toISOString().slice(0,10) : '');
            }

            if (key === 'billAmount') {
                va = Number(va) || 0;
                vb = Number(vb) || 0;
                return (va - vb) * (sortDir === 'asc' ? 1 : -1);
            }

            va = va === undefined || va === null ? '' : String(va);
            vb = vb === undefined || vb === null ? '' : String(vb);
            const cmp = va.localeCompare(vb, undefined, { numeric: true, sensitivity: 'base' });
            return cmp * (sortDir === 'asc' ? 1 : -1);
        });

        return out;
    }, [data, searchQuery, sortKey, sortDir]);

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5001/api/customers');
            setData(res.data || []);
        } catch (err) {
            console.error('Error fetching all customers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // If parent passed data, use it; otherwise fetch
        if (propData && propData.length) {
            setData(propData);
        } else {
            fetchAll();
        }
    }, [propData]);

    useEffect(() => {
        // If parent provides a refresh function, use it as a fallback to reload
        if (refreshAll) {
            const cleanup = () => {};
            return cleanup;
        }
    }, [refreshAll]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record? This cannot be undone.')) return;
        try {
            await axios.delete(`http://localhost:5001/api/customers/${id}`);
            setMessage('Record deleted');
            fetchAll();
            if (onChange) onChange();
        } catch (err) {
            console.error('Error deleting record', err);
            setMessage('Error deleting record');
        }
        setTimeout(() => setMessage(''), 2500);
    };

    const downloadAll = () => {
        const filename = `customers-${new Date().toISOString().slice(0,10)}.xlsx`;
        // Use the filtered & sorted dataset
        const view = filterAndSortData();
        // Prepare rows with readable dates
        const rows = view.map(item => ({
            Name: item.name,
            Contact: item.contact,
            Delivery: item.delivery || 'On counter',
            Address: item.address || '',
            VisitedDate: item.visitedDate || (item.createdAt ? new Date(new Date(item.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toISOString().slice(0,10) : ''),
            BillAmount: item.billAmount,
            CreatedAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
            ID: item._id || ''
        }));

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Customers');
        XLSX.writeFile(wb, filename);
    };

    if (loading) return <div className="card">Loading...</div>;

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                <h2 style={{ margin: 0 }}>All Records</h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search by name or contact"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #ddd', minWidth: 220 }}
                    />
                    <button className="btn" onClick={() => { setSearchQuery(''); setSortKey('createdAt'); setSortDir('desc'); }} title="Clear filters">Clear</button>
                    <button className="btn btn-primary" onClick={downloadAll}>
                        <Download size={16} /> Download
                    </button>
                </div>
            </div>

            {message && (
                <div style={{ padding: '0.75rem', backgroundColor: '#eef2ff', borderRadius: 6, marginBottom: '1rem' }}>
                    {message}
                </div>
            )}

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>Name {sortKey === 'name' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('contact')}>Contact {sortKey === 'contact' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('delivery')}>Delivery {sortKey === 'delivery' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('visitedDate')}>Visited Date {sortKey === 'visitedDate' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}</th>
                            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('billAmount')}>Bill {sortKey === 'billAmount' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterAndSortData().map(item => {
                            // Compute visited date (prefer stored visitedDate, otherwise derive from createdAt in India timezone)
                            const visited = item.visitedDate || (item.createdAt ? new Date(new Date(item.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).toISOString().slice(0,10) : '-');
                            return (
                                <tr key={item._id}>
                                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Phone size={14} /> {item.contact}
                                        </div>
                                    </td>
                                    <td>{item.delivery || 'On counter'}</td>
                                    <td>{visited}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <DollarSign size={14} /> {item.billAmount}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filterAndSortData().length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllData;
