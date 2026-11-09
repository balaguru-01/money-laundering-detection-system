# 💰 Money Laundering Detection System - v2.0 (Complete Rebuild)

A comprehensive, modern full-stack application for detecting and preventing financial crime through advanced anomaly detection, network analysis, and real-time monitoring.

**Status**: ✅ Production Ready | **Architecture**: Modern React + Express | **Database**: MongoDB

---

## 🎯 What's New in v2.0

✨ **Complete Rebuild** from scratch with:

- Clean, modular architecture
- Modern ES6+ code structure
- Comprehensive error handling
- Real-time WebSocket integration
- Advanced detection algorithms
- Beautiful, responsive UI
- Full API documentation

---

## 📂 Directory Structure

```
Proactive Money Laundering/
├── NEW-Backend/              # Express.js + MongoDB Backend
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Detection & analysis
│   │   ├── middleware/       # Express middleware
│   │   └── server.js         # Express + Socket.IO entry
│   ├── package.json
│   ├── .env                  # Configuration file
│   └── README.md
│
└── NEW-Frontend/             # React + Vite Frontend
    ├── src/
    │   ├── components/       # React components
    │   ├── services/         # API & WebSocket clients
    │   ├── hooks/            # Custom React hooks
    │   ├── App.jsx           # Main app component
    │   └── index.css         # Global styles
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 16 or higher
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1️⃣ Backend Setup

```bash
cd NEW-Backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/money-laundering-detection
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF

# Start server
npm start
```

✅ Backend running at: `http://localhost:5000`

### 2️⃣ Frontend Setup (New Terminal)

```bash
cd NEW-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

Open your browser and navigate to **http://localhost:5173**

---

## 🏗️ Architecture Overview

### Backend Architecture

```
Express Server (Port 5000)
├── REST API Routes
│   ├── /api/transactions    - Transaction CRUD
│   ├── /api/alerts          - Alert management
│   └── /api/network         - Network analysis
├── WebSocket (Socket.IO)
│   ├── Real-time alerts
│   └── Real-time transactions
└── MongoDB Database
    ├── Transactions
    ├── Accounts
    └── Alerts
```

### Frontend Architecture

```
React App (Port 5173)
├── Components
│   ├── Dashboard            - Analytics & KPIs
│   ├── AlertsPanel          - Alert management
│   ├── TransactionList      - Transaction history
│   ├── NetworkVisualization - D3.js graph
│   └── ReportsSection       - Reports & exports
├── Services
│   ├── apiService.js        - REST client
│   └── socketService.js     - WebSocket client
└── Hooks
    └── useRealtimeData.js   - Real-time subscriptions
```

---

## 📊 Key Features

### 🚨 Intelligent Detection System

**8 Advanced Detection Rules**:

1. **Large Amount Detection** - Transactions > ₹10 Lakhs
2. **Rapid Succession** - 5+ transactions in 5 minutes
3. **Cross-Border Transfers** - International transactions
4. **Circular Patterns** - A→B→C→A cyclic transfers
5. **Unusual Time** - Transactions at night (10 PM - 5 AM)
6. **Round Amounts** - Suspiciously round figures
7. **Multiple Destinations** - 10+ destinations in 24h
8. **Dormant Activation** - Inactive accounts suddenly active

### 📈 Real-Time Dashboard

- **KPI Cards**: Critical metrics and alerts
- **Pie Chart**: Alert distribution by severity
- **Bar Chart**: Alert status breakdown
- **Line Chart**: Transaction volumes over time
- **Live Updates**: WebSocket-powered real-time data

### 🕸️ Network Analysis

- **Force-Directed Graph**: Interactive D3.js visualization
- **Account Clustering**: Identify transaction groups
- **Centrality Measures**: Find key accounts
- **Anomaly Detection**: Suspicious patterns in networks
- **Flow Analysis**: Track money movement

### 🚨 Alert Management

- **Severity Levels**: Critical, High, Medium, Low
- **Real-Time Notifications**: Instant alert streaming
- **Status Tracking**: Open, Reviewed, Resolved, False Positive
- **Detailed Metadata**: Full transaction context
- **Batch Operations**: Review multiple alerts

### 📋 Comprehensive Reports

- **Summary Reports**: High-level overview
- **Detailed Analysis**: Transaction-by-transaction breakdown
- **Anomaly Reports**: Suspicious pattern detection
- **Date Filtering**: 24h, 7 days, 30 days
- **Export**: Download reports as text files

### 💳 Transaction Tracking

- **Real-Time Updates**: WebSocket notifications
- **Full History**: Complete transaction log
- **Filtering**: By status, date range, accounts
- **Status Management**: Update transaction status
- **Search**: Find transactions by account or amount

---

## 🔗 API Reference

### Transaction Endpoints

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| GET    | `/api/transactions`            | Fetch transactions (paginated) |
| GET    | `/api/transactions/:id`        | Get single transaction         |
| POST   | `/api/transactions`            | Create new transaction         |
| PATCH  | `/api/transactions/:id/status` | Update status                  |

**Query Parameters**:

- `limit` - Records per page (default: 50)
- `status` - Filter by status (completed, pending, flagged, cleared)
- `fromAccount` - Filter by source account
- `toAccount` - Filter by destination account

**Example Request**:

```bash
curl -X GET "http://localhost:5000/api/transactions?limit=10&status=flagged"
```

### Alert Endpoints

| Method | Endpoint                 | Description      |
| ------ | ------------------------ | ---------------- |
| GET    | `/api/alerts`            | Fetch alerts     |
| GET    | `/api/alerts/:id`        | Get single alert |
| GET    | `/api/alerts/stats`      | Get statistics   |
| PATCH  | `/api/alerts/:id/status` | Update status    |

### Network Endpoints

| Method | Endpoint                                 | Description         |
| ------ | ---------------------------------------- | ------------------- |
| GET    | `/api/network`                           | Get network graph   |
| GET    | `/api/network/anomalies`                 | Anomalous subgraphs |
| GET    | `/api/network/accounts`                  | All accounts        |
| GET    | `/api/network/accounts/:accountId/stats` | Account stats       |

---

## 📨 Sample Payloads

### Create Transaction

```json
POST /api/transactions
{
  "transactionId": "TXN20250108001",
  "fromAccount": "ACC001",
  "toAccount": "ACC002",
  "amount": 2500000,
  "currency": "INR",
  "type": "transfer",
  "metadata": {
    "country": "IN",
    "paymentMethod": "wire",
    "reference": "REF20250108"
  }
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "transaction": {
      /* full transaction object */
    },
    "alerts": [
      {
        "alertId": "alert_123",
        "level": "high",
        "rule": "LARGE_AMOUNT",
        "message": "Large transaction detected: 2500000"
      }
    ]
  }
}
```

### Update Alert Status

```json
PATCH /api/alerts/alert_123/status
{
  "status": "resolved",
  "reviewedBy": "admin@system.com"
}
```

---

## 🔄 WebSocket Events

### Real-Time Subscriptions

```javascript
import {
  subscribeToAlerts,
  subscribeToTransactions,
} from "./services/socketService";

// Listen for new alerts
subscribeToAlerts((alert) => {
  console.log("🚨 New Alert:", alert);
});

// Listen for new transactions
subscribeToTransactions((transaction) => {
  console.log("💳 New Transaction:", transaction);
});
```

### WebSocket Endpoints

| Event                    | Direction       | Payload            | Purpose                         |
| ------------------------ | --------------- | ------------------ | ------------------------------- |
| `subscribe-alerts`       | Client → Server | -                  | Subscribe to alert stream       |
| `subscribe-transactions` | Client → Server | -                  | Subscribe to transaction stream |
| `new-alert`              | Server → Client | Alert object       | Real-time alert notification    |
| `new-transaction`        | Server → Client | Transaction object | Real-time transaction update    |

---

## 🎨 UI Components

### Dashboard (`/dashboard`)

Central hub with analytics and KPIs

### Alerts (`/alerts`)

Real-time alert management and tracking

### Transactions (`/transactions`)

Complete transaction history with filtering

### Network (`/network`)

Interactive transaction network visualization

### Reports (`/reports`)

Generate and export comprehensive reports

---

## 🔒 Security Features

✅ **Input Validation** - All inputs validated server-side
✅ **Error Handling** - Comprehensive error middleware
✅ **CORS Protection** - Configurable CORS headers
✅ **Database Indexing** - Optimized query performance
✅ **Status Tracking** - Immutable transaction records
✅ **Alert Logging** - Complete audit trail

---

## 📦 Dependencies

### Backend

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "socket.io": "^4.7.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### Frontend

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.2",
  "socket.io-client": "^4.7.2",
  "recharts": "^2.10.3",
  "d3": "^7.8.5"
}
```

---

## 🚀 Deployment

### Docker Setup

**Backend Dockerfile**:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Frontend Dockerfile**:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Configuration

**Production Backend (.env)**:

```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mld
NODE_ENV=production
CORS_ORIGIN=https://app.yourdomain.com
```

**Production Frontend (.env)**:

```
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
```

---

## 🧪 Testing

### Test API Endpoints

```bash
# Create test transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TEST001",
    "fromAccount": "ACC001",
    "toAccount": "ACC002",
    "amount": 5000000,
    "type": "transfer"
  }'

# Fetch alerts
curl http://localhost:5000/api/alerts

# Get network
curl http://localhost:5000/api/network
```

---

## 📊 Database Schema

### Transaction

```javascript
{
  transactionId: String (unique),
  fromAccount: String,
  toAccount: String,
  amount: Number,
  currency: String,
  date: Date,
  type: String (enum),
  status: String (enum),
  detectionFlags: Array,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Account

```javascript
{
  accountId: String (unique),
  accountHolder: String,
  accountType: String,
  balance: Number,
  country: String,
  riskLevel: String,
  status: String,
  transactionHistory: Array
}
```

### Alert

```javascript
{
  alertId: String (unique),
  transactionId: String,
  level: String (critical|high|medium|low),
  rule: String,
  message: String,
  details: Object,
  status: String (open|reviewed|resolved|false-positive),
  createdAt: Date,
  reviewedAt: Date,
  reviewedBy: String
}
```

---

## 🎯 Performance Optimizations

✅ **Database Indexing** - Indexed fields for fast queries
✅ **Pagination** - Limited result sets
✅ **Real-Time Caching** - Socket.IO for instant updates
✅ **Lazy Loading** - Components load on demand
✅ **Code Splitting** - Vite automatic chunking
✅ **Request Debouncing** - Avoid duplicate API calls

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port 5000 is in use
lsof -i :5000

# Check MongoDB connection
mongosh "mongodb://localhost:27017"
```

### Frontend can't connect to API

- Verify backend is running on port 5000
- Check VITE_API_URL in .env
- Check browser console for CORS errors

### WebSocket not connecting

- Ensure Socket.IO server is initialized
- Check VITE_SOCKET_URL matches backend
- Verify firewall allows WebSocket connections

---

## 📚 Documentation Files

- [Backend README](./NEW-Backend/README.md) - Backend setup & API details
- [Frontend README](./NEW-Frontend/README.md) - Frontend setup & components

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Socket.IO Guide](https://socket.io/docs/)
- [D3.js Documentation](https://d3js.org)

---

## 📄 License

ISC License - See individual package.json files

## 👥 Contributors

Created as a Money Laundering Detection System demonstration.

---

## 📞 Support

For issues or questions:

1. Check the README files in each directory
2. Review API documentation above
3. Check console/logs for error messages
4. Verify all prerequisites are installed

---

**Version**: 2.0.0  
**Last Updated**: January 2025  
**Status**: ✅ Production Ready  
**Build Type**: Complete from-scratch rebuild  
**Architecture**: Modern MERN Stack
