# Medical Store Customer Reminder Management System - Setup Guide

## Step-by-Step Installation Guide for New PC

This guide will help you set up the Medical Store Customer Reminder Management System on a new computer from scratch.

---

## Prerequisites

### Required Software

1. **Node.js** (v16.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: Open terminal/command prompt and run:
     ```bash
     node --version
     npm --version
     ```
   - Should display version numbers (e.g., v18.17.0, 9.6.7)

2. **Git** (Optional but recommended)
   - Download from: https://git-scm.com/
   - Verify installation:
     ```bash
     git --version
     ```

3. **Text Editor / IDE** (Optional)
   - Recommended: Visual Studio Code
   - Download from: https://code.visualstudio.com/

### Optional Software

- **MongoDB** (Optional - System works without it)
  - Only needed if you want to use MongoDB instead of JSON file storage
  - Download from: https://www.mongodb.com/try/download/community

---

## Installation Steps

### Step 1: Download Project Files

**Option A: If you have the project files (ZIP/Folder)**
1. Extract the project folder to your desired location
   - Example: `C:\Users\YourName\Documents\Medical Software` (Windows)
   - Example: `/Users/YourName/Documents/Medical Software` (macOS/Linux)

**Option B: If using Git**
```bash
git clone <repository-url>
cd Medical\ Software
```

### Step 2: Verify Project Structure

Ensure you have the following structure:
```
Medical Software/
├── client/
│   ├── package.json
│   └── src/
├── server/
│   ├── package.json
│   └── index.js
├── scripts/
│   ├── start-all.sh
│   └── stop-all.sh
└── documentation/
```

### Step 3: Install Node.js Dependencies

#### 3.1 Install Server Dependencies

1. Open terminal/command prompt
2. Navigate to the server directory:
   ```bash
   cd server
   ```
   **Windows (PowerShell/CMD):**
   ```powershell
   cd server
   ```
   **macOS/Linux:**
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
   This will install:
   - express
   - mongoose
   - cors
   - dotenv
   - nodemon (dev dependency)

4. Wait for installation to complete (may take 1-2 minutes)

#### 3.2 Install Client Dependencies

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
   Or from project root:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   This will install:
   - react
   - react-dom
   - axios
   - lucide-react
   - xlsx
   - vite
   - And other dev dependencies

3. Wait for installation to complete (may take 2-3 minutes)

### Step 4: Configure Environment (Optional)

1. Navigate to the server directory:
   ```bash
   cd ../server
   ```

2. Create a `.env` file (optional):
   ```bash
   # Windows (PowerShell)
   New-Item .env
   
   # macOS/Linux
   touch .env
   ```

3. Add the following to `.env` (optional - has defaults):
   ```env
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/medical-reminder
   ```
   **Note**: The system works without this file. It will use default values.

### Step 5: Start the Application

#### Option A: Using Start Script (Recommended)

**macOS/Linux:**
1. Navigate to project root:
   ```bash
   cd ..
   ```

2. Make scripts executable (if needed):
   ```bash
   chmod +x scripts/start-all.sh
   chmod +x scripts/stop-all.sh
   ```

3. Start the application:
   ```bash
   ./scripts/start-all.sh
   ```

**Windows (PowerShell):**
1. Navigate to project root:
   ```powershell
   cd ..
   ```

2. Start the application:
   ```powershell
   bash scripts/start-all.sh
   ```
   (Requires Git Bash or WSL)

**Windows (Alternative - Manual Start):**
1. Open two separate terminal windows:
   - Terminal 1: Navigate to `server` folder and run `npm start`
   - Terminal 2: Navigate to `client` folder and run `npm start`

#### Option B: Manual Start (Alternative)

**Terminal 1 - Start Server:**
```bash
cd server
npm start
```

**Terminal 2 - Start Client:**
```bash
cd client
npm start
```

### Step 6: Verify Installation

1. **Check Server**:
   - Look for message: `Server is running on port 5001`
   - Test in browser: http://localhost:5001
   - Should see: "Medical Store Reminder API is running..."

2. **Check Client**:
   - Look for message: `Local: http://localhost:5173` (or similar)
   - Open browser to the URL shown in terminal
   - Should see the Medical Reminder application interface

3. **Test Application**:
   - Click "Add Customer" tab
   - Fill in a test customer:
     - Name: Test Customer
     - Contact: 1234567890
     - Days until Remind: 30
     - Bill Amount: 1000
     - Delivery: On counter
   - Click "Save Customer Details"
   - Should see success message

---

## Running the Application

### Starting the Application

**Using Start Script:**
```bash
./scripts/start-all.sh      # macOS/Linux
bash scripts/start-all.sh   # Windows (Git Bash)
```

**Manual Start:**
```bash
# Terminal 1
cd server && npm start

# Terminal 2
cd client && npm start
```

### Stopping the Application

**Using Stop Script:**
```bash
./scripts/stop-all.sh       # macOS/Linux
bash scripts/stop-all.sh    # Windows (Git Bash)
```

**Manual Stop:**
- Press `Ctrl + C` in both terminal windows
- Or close the terminal windows

### Accessing the Application

- **Frontend**: http://localhost:5173 (or port shown in terminal)
- **Backend API**: http://localhost:5001

---

## Troubleshooting Setup Issues

### Issue 1: Node.js Not Found

**Problem**: `'node' is not recognized as an internal or external command`

**Solution**:
1. Verify Node.js is installed: https://nodejs.org/
2. Restart terminal/command prompt after installation
3. Add Node.js to PATH (usually done automatically)

### Issue 2: npm Install Fails

**Problem**: `npm install` shows errors

**Solutions**:
1. Check Node.js version (should be v16+):
   ```bash
   node --version
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

3. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json  # macOS/Linux
   del /s /q node_modules package-lock.json  # Windows
   ```

4. Reinstall:
   ```bash
   npm install
   ```

### Issue 3: Port Already in Use

**Problem**: `Port 5001 is already in use` or `Port 5173 is already in use`

**Solutions**:

**For Server (Port 5001):**
1. Find process using port:
   ```bash
   # macOS/Linux
   lsof -i :5001
   
   # Windows
   netstat -ano | findstr :5001
   ```

2. Kill the process:
   ```bash
   # macOS/Linux
   kill -9 <PID>
   
   # Windows
   taskkill /PID <PID> /F
   ```

**For Client (Port 5173):**
- Vite will automatically use the next available port (5174, 5175, etc.)
- Check terminal for actual port number

### Issue 4: Permission Denied (macOS/Linux)

**Problem**: `Permission denied` when running scripts

**Solution**:
```bash
chmod +x scripts/start-all.sh
chmod +x scripts/stop-all.sh
```

### Issue 5: Cannot Connect to Server

**Problem**: Frontend shows connection errors

**Solutions**:
1. Verify server is running (check Terminal 1)
2. Check server logs in `server/server.log`
3. Verify port 5001 is accessible:
   ```bash
   curl http://localhost:5001
   ```
4. Check browser console for errors (F12)

### Issue 6: MongoDB Connection Error

**Problem**: `Could not connect to MongoDB`

**Solution**:
- **This is normal and non-critical!**
- The system uses MockDB (JSON file) by default
- MongoDB connection errors are ignored
- System automatically uses `server/db.json` for storage
- If you want to use MongoDB:
  1. Install MongoDB: https://www.mongodb.com/try/download/community
  2. Start MongoDB service
  3. Update `.env` file with correct connection string

### Issue 7: Scripts Don't Work on Windows

**Problem**: `.sh` scripts don't run on Windows

**Solutions**:

**Option A: Use Git Bash**
- Install Git for Windows (includes Git Bash)
- Use Git Bash terminal instead of CMD/PowerShell

**Option B: Use WSL (Windows Subsystem for Linux)**
- Install WSL from Microsoft Store
- Use WSL terminal

**Option C: Manual Start**
- Open two terminal windows
- Terminal 1: `cd server && npm start`
- Terminal 2: `cd client && npm start`

**Option D: Create Windows Batch Files**
- Create `scripts/start-all.bat`:
  ```batch
  @echo off
  start "Server" cmd /k "cd server && npm start"
  start "Client" cmd /k "cd client && npm start"
  ```

---

## Verification Checklist

After installation, verify:

- [ ] Node.js is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] Server dependencies installed (`server/node_modules` exists)
- [ ] Client dependencies installed (`client/node_modules` exists)
- [ ] Server starts successfully (check `server/server.log`)
- [ ] Client starts successfully (check browser console)
- [ ] Can access frontend in browser
- [ ] Can access backend API in browser (http://localhost:5001)
- [ ] Can add a test customer
- [ ] Can view reminders
- [ ] Can view all records
- [ ] Can export data to Excel
- [ ] Can generate WhatsApp broadcast file

---

## Post-Installation

### First Run

1. Start the application
2. Navigate to "Add Customer" tab
3. Add a few test customers
4. Check "Reminders" tab to see them listed
5. Check "All Records" tab to view all data
6. Test "Download" feature to export Excel
7. Test "Add to Broadcast" to generate vCard file

### Default Data

- The system starts with no data
- Data is stored in `server/db.json` (JSON file)
- If you have existing data, copy `db.json` to `server/` folder

### Backup Recommendations

- Regularly backup `server/db.json` (contains all customer data)
- Consider automated backups for production use

---

## Development Mode

### Using Development Tools

**Server with Auto-Restart:**
```bash
cd server
npm run dev
```
(Uses nodemon to auto-restart on file changes)

**Client with Hot Reload:**
```bash
cd client
npm start
```
(Vite provides hot module replacement)

---

## Production Build

### Building Client for Production

```bash
cd client
npm run build
```

Output will be in `client/dist/` folder

### Running Production Build

1. Build the client:
   ```bash
   cd client
   npm run build
   ```

2. Serve the built files:
   - Use a web server (nginx, Apache)
   - Or use Vite preview:
     ```bash
     npm run preview
     ```

3. Run server in production mode:
   ```bash
   cd server
   npm start
   ```

---

## System Requirements

### Minimum Requirements

- **OS**: Windows 10+, macOS 10.14+, or Linux (any modern distribution)
- **RAM**: 2GB minimum, 4GB recommended
- **Disk Space**: 500MB for installation
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)

### Recommended Requirements

- **OS**: Latest stable version
- **RAM**: 4GB or more
- **Disk Space**: 1GB available
- **Node.js**: Latest LTS version
- **Browser**: Chrome, Firefox, Safari, or Edge (latest version)

---

## Next Steps

1. **Read Documentation**: See `PROJECT_GUIDE.md` for detailed feature documentation
2. **Customize**: Modify styles, messages, or add features
3. **Test**: Test all features to ensure everything works
4. **Backup**: Set up regular backups of `server/db.json`

---

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Check `PROJECT_GUIDE.md` for detailed documentation
3. Check logs:
   - Server: `server/server.log`
   - Client: Browser console (F12)
4. Verify all prerequisites are installed correctly
5. Ensure both server and client are running

---

**Last Updated**: January 2026
**Version**: 1.0.0

