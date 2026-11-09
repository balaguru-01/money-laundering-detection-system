# 🏗️ Project Directory Guide

## 📂 Project Structure

```
Proactive Money Laundering/
│
├── 📁 NEW-Backend/                    ← NEW REBUILT BACKEND
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── middleware/
│   │   └── server.js
│   ├── package.json
│   ├── .env
│   ├── README.md
│   └── [15 files total]
│
├── 📁 NEW-Frontend/                   ← NEW REBUILT FRONTEND
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── README.md
│   └── [20+ files total]
│
├── 📄 REBUILD_README.md               ← START HERE! (Complete documentation)
├── 📄 REBUILD_SUMMARY.md              ← Quick reference & checklist
├── 📄 quick-start.bat                 ← Windows quick start script
├── 📄 quick-start.sh                  ← Unix/Linux quick start script
│
├── 📁 Backend/                        ← Old backend (can be deleted)
├── 📁 Frontend/                       ← Old frontend (can be deleted)
├── 📄 README.md                       ← Original README
└── 📄 ADVANCED_FEATURES.md            ← Old documentation

```

---

## 🚀 Getting Started (3 Steps)

### Step 1: Read Documentation

```
Open: REBUILD_README.md
Quick ref: REBUILD_SUMMARY.md
```

### Step 2: Run Quick Start

```bash
# Windows
quick-start.bat

# or Linux/Mac
bash quick-start.sh

# or Manual
cd NEW-Backend && npm install && npm start
# Terminal 2:
cd NEW-Frontend && npm install && npm run dev
```

### Step 3: Access Application

```
http://localhost:5173
```

---

## 📋 What's New in v2.0

✅ **Complete Rebuild** from scratch
✅ **Modern Architecture** - Clean, modular code
✅ **Better Documentation** - Comprehensive guides
✅ **More Features** - 8 detection rules, 5 UI components
✅ **Real-Time Updates** - WebSocket integration
✅ **Better UI** - Modern, responsive design
✅ **Better Code Quality** - Error handling, validation
✅ **Production Ready** - Deployment instructions included

---

## 📚 Documentation Files

| File                       | Purpose                           |
| -------------------------- | --------------------------------- |
| **REBUILD_README.md**      | Complete guide to the new system  |
| **REBUILD_SUMMARY.md**     | Quick reference & checklist       |
| **NEW-Backend/README.md**  | Backend setup & API documentation |
| **NEW-Frontend/README.md** | Frontend setup & component guide  |

---

## 🔑 Key Improvements Over Original

| Feature           | Old       | New                       |
| ----------------- | --------- | ------------------------- |
| Code Organization | Mixed     | Modular (MVC)             |
| Error Handling    | Basic     | Comprehensive             |
| WebSocket Support | Socket.IO | Socket.IO + Service Layer |
| Frontend Build    | Manual    | Vite (fast builds)        |
| Components        | 5 basic   | 5 advanced                |
| Detection Rules   | Generic   | 8 specific rules          |
| Real-Time Updates | Basic     | Full integration          |
| Documentation     | Basic     | Complete                  |
| Security          | Basic     | Enhanced validation       |

---

## 🎯 Project Structure Logic

```
NEW-Backend/
├── server.js              → Entry point
├── src/
│   ├── config/            → Configuration (DB)
│   ├── models/            → MongoDB schemas (Transaction, Account, Alert)
│   ├── controllers/       → Business logic (handle routes)
│   ├── routes/            → API endpoints (define routes)
│   ├── utils/             → Helper functions (detection, analysis)
│   └── middleware/        → Utilities (error handling)

NEW-Frontend/
├── main.jsx               → React entry point
├── App.jsx                → Main app component
├── components/            → UI components (5 major ones)
├── services/              → API client & WebSocket client
└── hooks/                 → Custom React hooks
```

---

## 🔗 API Quick Reference

```bash
# Create Transaction
POST /api/transactions
{
  "transactionId": "TXN001",
  "fromAccount": "ACC001",
  "toAccount": "ACC002",
  "amount": 2500000
}

# Get Alerts
GET /api/alerts

# Get Network
GET /api/network

# Update Alert Status
PATCH /api/alerts/:id/status
{ "status": "resolved" }
```

---

## ✨ Features Overview

### Dashboard 📊

- Real-time KPIs
- Alert distribution charts
- Transaction volume graphs
- Live data updates

### Alerts 🚨

- Real-time notifications
- 4 severity levels (critical/high/medium/low)
- Status management
- Bulk operations

### Transactions 💳

- Complete history
- Filtering & search
- Status tracking
- Real-time updates

### Network 🕸️

- Interactive D3.js graph
- Account clustering
- Transaction flows
- Network statistics

### Reports 📈

- Custom report generation
- Date filtering
- Top accounts analysis
- Export to file

---

## 🧪 Quick Test

```bash
# After both servers are running:

# 1. Create a transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TEST001",
    "fromAccount": "ACC001",
    "toAccount": "ACC002",
    "amount": 5000000,
    "type": "transfer"
  }'

# 2. Check alerts in UI or API
curl http://localhost:5000/api/alerts

# 3. View in dashboard at http://localhost:5173
```

---

## 🗑️ Cleanup (Optional)

After confirming everything works with NEW-Backend and NEW-Frontend, you can delete:

- `Backend/` directory (old backend)
- `Frontend/` directory (old frontend)
- `ADVANCED_FEATURES.md` (old docs)
- Keep `README.md` for reference

---

## 📞 Support

### If Something Doesn't Work:

1. **Check Prerequisites**

   - Node.js 16+ installed?
   - MongoDB running?
   - Ports 5000 & 5173 available?

2. **Check Logs**

   - Terminal output for errors
   - Browser console (F12)
   - Browser network tab (F12 → Network)

3. **Try Again**

   - Delete node_modules
   - Run `npm install` again
   - Restart servers

4. **Read Docs**
   - Check REBUILD_README.md
   - Check specific README in folder

---

## 🎓 Learning Path

1. Start with REBUILD_README.md
2. Read Backend setup section
3. Run backend
4. Read Frontend setup section
5. Run frontend
6. Explore UI
7. Create test transactions
8. View alerts
9. Check network visualization
10. Generate reports

---

## ✅ Checklist Before Production

- [ ] Read REBUILD_README.md
- [ ] Set up MongoDB
- [ ] Install Node.js dependencies
- [ ] Test all API endpoints
- [ ] Test all UI features
- [ ] Update .env for production
- [ ] Enable HTTPS
- [ ] Set up logging
- [ ] Configure backups
- [ ] Deploy to server

---

## 🎉 You're All Set!

The Money Laundering Detection System v2.0 is ready!

**Start with**: REBUILD_README.md

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready
