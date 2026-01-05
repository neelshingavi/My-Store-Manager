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
