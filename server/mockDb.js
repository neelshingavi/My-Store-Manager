const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Ensure db.json exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

class MockDB {
    static async findAll() {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    }

    static async save(item) {
        const data = await this.findAll();
        item._id = Date.now().toString();
        item.createdAt = new Date();
        // ensure contact is stored as string
        if (item.contact !== undefined && item.contact !== null) {
            item.contact = String(item.contact);
        }
        // visitedDate stored as YYYY-MM-DD in India timezone
        const india = new Date(item.createdAt.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const yyyy = india.getFullYear();
        const mm = String(india.getMonth() + 1).padStart(2, '0');
        const dd = String(india.getDate()).padStart(2, '0');
        item.visitedDate = `${yyyy}-${mm}-${dd}`;
        console.log('MockDB saving item:', item);
        data.push(item);
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return item;
    }

    static async findByIdAndUpdate(id, update) {
        const data = await this.findAll();
        const index = data.findIndex(item => item._id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...update };
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
            return data[index];
        }
        return null;
    }

    static async findByIdAndDelete(id) {
        const data = await this.findAll();
        const index = data.findIndex(item => item._id === id);
        if (index !== -1) {
            const removed = data.splice(index, 1)[0];
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
            return removed;
        }
        return null;
    }

    static async deleteByContact(contact) {
        console.log('MockDB.deleteByContact called with:', contact, 'type:', typeof contact);
        const data = await this.findAll();
        const initialLen = data.length;
        const filtered = data.filter(item => String(item.contact) !== String(contact));
        const removedCount = initialLen - filtered.length;
        if (removedCount > 0) {
            fs.writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2));
        }
        console.log('MockDB.deleteByContact removedCount:', removedCount);
        return removedCount;
    }

    static async deduplicate() {
        const data = await this.findAll();
        const byContact = {};
        for (const item of data) {
            if (!item.contact) continue;
            if (!byContact[item.contact]) byContact[item.contact] = [];
            byContact[item.contact].push(item);
        }

        let removedCount = 0;
        const keepIds = new Set();
        for (const contact of Object.keys(byContact)) {
            const entries = byContact[contact];
            if (entries.length > 1) {
                // keep the latest by createdAt
                entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                keepIds.add(entries[0]._id);
                for (let i = 1; i < entries.length; i++) {
                    removedCount++;
                }
            } else {
                keepIds.add(entries[0]._id);
            }
        }

        const deduped = data.filter(item => keepIds.has(item._id));
        if (removedCount > 0) {
            fs.writeFileSync(DB_PATH, JSON.stringify(deduped, null, 2));
        }
        console.log('MockDB.deduplicate removedCount:', removedCount);
        return removedCount;
    }

    static async find(query) {
        let data = await this.findAll();

        if (query.allPending) {
            data = data.filter(item => !item.completed);
        } else if (query.reminderDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            data = data.filter(item => {
                const date = new Date(item.reminderDate);
                return date >= today && date < tomorrow && !item.completed;
            });
        }
        return data;
    }
}

module.exports = MockDB;
