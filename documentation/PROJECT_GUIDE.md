# Medical Store Customer Reminder Management System - Project Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [API Documentation](#api-documentation)
7. [Components Documentation](#components-documentation)
8. [Database Schema](#database-schema)
9. [Workflow](#workflow)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

The **Medical Store Customer Reminder Management System** is a web application designed to help medical stores manage customer records and send timely reminders for medicine refills via WhatsApp. The system tracks customer visits, calculates reminder dates, and provides tools for bulk communication.

### Key Objectives
- Manage customer information (name, contact, address, delivery preferences)
- Track customer visits and bill amounts
- Automatically calculate reminder dates based on days until reminder
- Send WhatsApp reminders to customers
- Export customer data for reporting
- Create WhatsApp broadcast lists from all customer contacts

---

## Architecture

The application follows a **client-server architecture**:

### Frontend (Client)
- **Framework**: React 19.2.0 with Vite
- **UI Library**: Custom CSS with Lucide React icons
- **HTTP Client**: Axios for API communication
- **Export Library**: XLSX for Excel file generation

### Backend (Server)
- **Framework**: Express.js 5.2.1
- **Database**: MockDB (JSON file) or MongoDB (optional)
- **ORM**: Mongoose (when MongoDB is used)
- **Environment**: Node.js with dotenv

### Communication
- RESTful API endpoints
- JSON data format
- CORS enabled for cross-origin requests

---

## Features

### 1. Reminders Management
- **View Active Reminders**: Display all pending reminders sorted by reminder date
- **Send Individual WhatsApp Messages**: Click "Message" button to send a pre-formatted reminder via WhatsApp
- **Send Messages to All**: "Send Message to All" button opens WhatsApp links for all active reminders
- **Mark as Complete**: Mark reminders as done after contacting customers

### 2. Add Customer
- **Customer Information Form**:
  - Customer Name (required)
  - Contact Number (required, exactly 10 digits)
  - Address (optional)
  - Delivery Option: "On counter" or "Home Delivery"
  - Days until Remind (required)
  - Bill Amount (required)
- **Validation**: 
  - Contact must be exactly 10 digits (numbers only)
  - All required fields validated on client and server
- **Auto-deduplication**: Automatically removes old records with the same contact number

### 3. All Records
- **View All Customers**: Display all customer records (pending and completed)
- **Search Functionality**: Search by name or contact number
- **Sortable Columns**: 
  - Name (ascending/descending)
  - Contact (ascending/descending)
  - Delivery (ascending/descending)
  - Visited Date (ascending/descending)
  - Bill Amount (ascending/descending)
- **Actions**:
  - Delete individual records
  - Download all records as Excel file
  - **Add to WhatsApp Broadcast**: Generate vCard file with all unique contacts formatted with India country code (+91)

### 4. WhatsApp Integration
- **Individual Messages**: Opens WhatsApp Web with pre-filled message
- **Bulk Messages**: Opens multiple WhatsApp windows with delay to prevent browser blocking
- **Broadcast List**: Generates .vcf file with all contacts that can be imported into WhatsApp

-------

## Technology Stack

### Frontend Dependencies
```
react: ^19.2.0
react-dom: ^19.2.0
axios: ^1.13.2
lucide-react: ^0.562.0
xlsx: ^0.18.5
vite: ^7.2.4
```

### Backend Dependencies
```
express: ^5.2.1
mongoose: ^9.1.1
cors: ^2.8.5
dotenv: ^17.2.3
```

### Development Tools
- Vite for fast development and building
- ESLint for code quality
- Nodemon for auto-restarting server (dev mode)

---

## Project Structure

```
Medical Software/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddCustomer.jsx     # Form to add new customers
│   │   │   ├── AllData.jsx         # All records view with search/sort/export
│   │   │   └── RemindersTable.jsx  # Active reminders display
│   │   ├── App.jsx                 # Main app component with routing
│   │   ├── App.css                 # Application styles
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Backend Express application
│   ├── routes/
│   │   └── customerRoutes.js       # Customer API endpoints
│   ├── models/
│   │   └── Customer.js             # Customer Mongoose schema
│   ├── mockDb.js                   # JSON file-based database
│   ├── db.json                     # Data storage (auto-generated)
│   ├── index.js                    # Express server entry point
│   └── package.json
│
├── scripts/
│   ├── start-all.sh                # Start both client and server
│   └── stop-all.sh                 # Stop both client and server
│
└── documentation/                   # Project documentation
    ├── PROJECT_GUIDE.md            # This file
    └── SETUP_GUIDE.md              # Setup instructions
```

---

## API Documentation

### Base URL
```
http://localhost:5001/api/customers
```

### Endpoints

#### 1. Get All Customers
```
GET /api/customers
```
**Response**: Array of all customer objects
```json
[
  {
    "_id": "1234567890",
    "name": "John Doe",
    "contact": "9876543210",
    "address": "123 Main St",
    "delivery": "Home Delivery",
    "reminderDate": "2026-01-20T00:00:00.000Z",
    "visitedDate": "2026-01-07",
    "billAmount": 2000,
    "completed": false,
    "createdAt": "2026-01-07T10:00:00.000Z"
  }
]
```

#### 2. Get Active Reminders
```
GET /api/customers/reminders
```
**Response**: Array of pending reminder objects (sorted by reminderDate)

#### 3. Add Customer
```
POST /api/customers
```
**Request Body**:
```json
{
  "name": "John Doe",
  "contact": "9876543210",
  "address": "123 Main St",
  "daysUntilReminder": "25",
  "billAmount": "2000",
  "delivery": "Home Delivery"
}
```
**Response**: Created customer object (201 status)

**Validation**:
- Contact must be exactly 10 digits
- Delivery must be "On counter" or "Home Delivery"
- daysUntilReminder must be a valid number

#### 4. Delete Customer
```
DELETE /api/customers/:id
```
**Response**: `{ "message": "Deleted" }` (200 status)

#### 5. Mark Reminder as Complete
```
PATCH /api/customers/:id/complete
```
**Response**: Updated customer object with `completed: true`

#### 6. Deduplicate Contacts
```
POST /api/customers/deduplicate
```
**Response**: `{ "removed": 5 }` (number of duplicate records removed)

#### 7. Get Contacts for Broadcast
```
GET /api/customers/broadcast
```
**Response**:
```json
{
  "contacts": [
    {
      "name": "John Doe",
      "contact": "9876543210"
    }
  ],
  "count": 17
}
```
Returns all unique contacts (deduplicated by contact number)

---

## Components Documentation

### 1. App.jsx (Main Component)
**Purpose**: Root component that manages navigation and state
- **State Management**:
  - `activeTab`: Current view ('reminders', 'add', 'alldata')
  - `reminders`: Array of active reminders
  - `allData`: Array of all customers
- **Methods**:
  - `fetchReminders()`: Fetch pending reminders
  - `fetchAll()`: Fetch all customers
- **Tabs**:
  - Reminders: Shows `RemindersTable` component
  - Add Customer: Shows `AddCustomer` component
  - All Records: Shows `AllData` component

### 2. RemindersTable.jsx
**Purpose**: Display and manage active reminders
- **Props**:
  - `reminders`: Array of reminder objects
  - `onReminderCompleted`: Callback when reminder is marked complete
  - `loading`: Loading state
- **Features**:
  - Displays reminders in table format
  - "Message" button: Opens WhatsApp with pre-filled message
  - "Send Message to All": Opens WhatsApp for all reminders with delay
  - "Done" button: Marks reminder as complete
- **WhatsApp Message Format**:
  ```
  Hello {name}, this is a reminder from Your Medical Store. 
  Your medicines might be finishing soon. Please visit us to refill your prescription.
  ```

### 3. AddCustomer.jsx
**Purpose**: Form to add new customer records
- **Form Fields**:
  - Contact Number: 10-digit validation, numeric input only
  - Delivery: Dropdown (On counter / Home Delivery)
  - Customer Name: Text input
  - Address: Optional text input
  - Days until Remind: Number input
  - Bill Amount: Number input
- **Validation**:
  - Client-side validation for contact (10 digits)
  - Server-side validation for all fields
- **Auto-deduplication**: Server removes old records with same contact

### 4. AllData.jsx
**Purpose**: View, search, sort, and manage all customer records
- **Features**:
  - **Search**: Filter by name or contact number
  - **Sorting**: Click column headers to sort (toggle asc/desc)
  - **Actions**:
    - Delete: Remove individual records
    - Download: Export to Excel (.xlsx)
    - Add to Broadcast: Generate vCard (.vcf) for WhatsApp import
- **Sortable Columns**:
  - Name, Contact, Delivery, Visited Date, Bill Amount
- **Broadcast Feature**:
  - Fetches all unique contacts from backend
  - Formats with India country code (+91)
  - Generates vCard file for import
  - Downloads automatically

---

## Database Schema

### Customer Model
```javascript
{
  _id: String (auto-generated),
  name: String (required),
  contact: String (required, exactly 10 digits),
  address: String (optional),
  delivery: String (enum: ['On counter', 'Home Delivery']),
  reminderDate: Date (required, calculated),
  visitedDate: String (YYYY-MM-DD format, auto-generated),
  billAmount: Number (default: 0),
  completed: Boolean (default: false),
  createdAt: Date (auto-generated)
}
```

### Storage
- **Default**: JSON file (`server/db.json`) via MockDB
- **Optional**: MongoDB with Mongoose (requires MongoDB connection)

### Date Handling
- All dates stored in UTC
- `visitedDate` stored as YYYY-MM-DD string in India timezone (Asia/Kolkata)
- `reminderDate` calculated as: current date + daysUntilReminder

---

## Workflow

### Adding a Customer
1. Navigate to "Add Customer" tab
2. Fill in required information:
   - Contact (10 digits)
   - Name
   - Days until Remind
   - Bill Amount
   - Delivery option
3. Optional: Add address
4. Click "Save Customer Details"
5. System validates input
6. System removes any existing records with same contact
7. System calculates reminder date
8. System saves new record
9. Redirects to Reminders tab

### Managing Reminders
1. View active reminders in "Reminders" tab
2. Reminders sorted by date (earliest first)
3. Options:
   - Click "Message" to send WhatsApp reminder to individual customer
   - Click "Send Message to All" to send reminders to all customers
   - Click "Done" to mark reminder as complete
4. Completed reminders removed from active list

### Exporting Data
1. Navigate to "All Records" tab
2. Use search to filter records (optional)
3. Sort by any column (optional)
4. Click "Download" to export as Excel file
5. File includes all filtered/sorted records

### Creating WhatsApp Broadcast
1. Navigate to "All Records" tab
2. Click "Add to Broadcast" button
3. System fetches all unique contacts
4. System generates vCard (.vcf) file
5. File downloads automatically
6. Import file to phone contacts or WhatsApp
7. Create broadcast list in WhatsApp from imported contacts

---

## Troubleshooting

### Common Issues

#### 1. Server Not Starting
**Problem**: Server fails to start or crashes
**Solutions**:
- Check if port 5001 is already in use
- Verify Node.js is installed (`node --version`)
- Check `server/server.log` for error messages
- Ensure dependencies are installed (`npm install` in server folder)

#### 2. Client Not Loading
**Problem**: Frontend doesn't load or shows errors
**Solutions**:
- Check if Vite dev server is running
- Verify Node.js is installed
- Check `client/client.log` for errors
- Ensure dependencies are installed (`npm install` in client folder)
- Check browser console for JavaScript errors

#### 3. API Connection Errors
**Problem**: "Cannot GET /api/customers" or similar errors
**Solutions**:
- Ensure server is running on port 5001
- Check server logs for route registration
- Verify CORS is enabled in server
- Restart server after code changes

#### 4. Broadcast Feature Not Working
**Problem**: "Error: Could not fetch contacts for broadcast"
**Solutions**:
- Ensure server is running and restarted after adding the route
- Check server logs for errors
- Verify the `/api/customers/broadcast` endpoint exists
- Test endpoint directly: `curl http://localhost:5001/api/customers/broadcast`

#### 5. MongoDB Connection Errors
**Problem**: "Could not connect to MongoDB"
**Solutions**:
- System uses MockDB (JSON file) by default - MongoDB connection errors are non-critical
- If using MongoDB: ensure MongoDB is installed and running
- Check MongoDB connection string in `.env` file
- System will automatically use MockDB if MongoDB is unavailable

#### 6. WhatsApp Links Not Opening
**Problem**: WhatsApp links don't open or show error
**Solutions**:
- Ensure WhatsApp Web is open in browser or WhatsApp app is installed on device
- Check if phone number format is correct (should be 10 digits, no country code for link)
- Verify browser allows popups (for "Send Message to All")

#### 7. Excel Export Issues
**Problem**: Excel file doesn't download or is corrupted
**Solutions**:
- Check browser download settings
- Verify XLSX library is installed
- Check browser console for errors

#### 8. Search/Sort Not Working
**Problem**: Search or sort functionality doesn't work
**Solutions**:
- Clear browser cache
- Check browser console for JavaScript errors
- Ensure data is loaded (check network tab)

### Logs Location
- **Server logs**: `server/server.log`
- **Client logs**: `client/client.log`
- **Browser console**: F12 → Console tab

### Debug Mode
- Server: Check `server/server.log` for detailed logs
- Client: Check browser developer tools (F12)
- Network: Check Network tab for API requests/responses

---

## Additional Notes

### Timezone Handling
- All dates stored in UTC internally
- `visitedDate` displayed and stored in India timezone (Asia/Kolkata)
- Reminder dates calculated based on server timezone

### Data Deduplication
- System automatically removes old records when adding customer with existing contact
- `/api/customers/deduplicate` endpoint can manually remove duplicates (keeps latest)

### Contact Number Format
- Stored as 10-digit string
- Displayed as-is in UI
- WhatsApp links use 10-digit format (no country code)
- Broadcast vCard uses +91 country code for India

### Performance Considerations
- MockDB (JSON file) suitable for small to medium datasets
- For large datasets, consider using MongoDB
- Search and sort operations happen client-side for better responsiveness

---

## Support

For issues or questions:
1. Check logs in `server/server.log` and `client/client.log`
2. Review browser console for client-side errors
3. Verify all dependencies are installed
4. Ensure Node.js version is compatible (v16+ recommended)
5. Restart both server and client after making changes

---

**Last Updated**: January 2026
**Version**: 1.0.0

