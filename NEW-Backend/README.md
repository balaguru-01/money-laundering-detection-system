# Money Laundering Detection System - v2.0

A modern, full-stack application for detecting suspicious financial transactions and money laundering patterns using advanced rule-based detection, network analysis, and real-time monitoring.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd NEW-Backend

# Install dependencies
npm install

# Create .env file with configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/money-laundering-detection
# CORS_ORIGIN=http://localhost:5173

# Start server
npm start
# or for development with auto-reload
npm run dev
```

Backend will start on `http://localhost:5000`

### Frontend Setup

```bash
cd NEW-Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
NEW-Backend/
├── src/
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/
│   │   ├── Transaction.js     # Transaction schema
│   │   ├── Account.js         # Account schema
│   │   └── Alert.js           # Alert schema
│   ├── routes/
│   │   ├── transactions.js    # Transaction endpoints
│   │   ├── alerts.js          # Alert endpoints
│   │   └── network.js         # Network analysis endpoints
│   ├── controllers/
│   │   ├── transactionController.js
│   │   ├── alertController.js
│   │   └── networkController.js
│   ├── utils/
│   │   ├── anomalyDetector.js # Detection algorithms
│   │   └── networkAnalyzer.js # Graph analysis
│   ├── middleware/
│   │   └── errorHandler.js    # Error handling
│   └── server.js              # Express + Socket.IO setup
├── package.json
└── .env

NEW-Frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── AlertsPanel.jsx    # Alerts view
│   │   ├── TransactionList.jsx # Transactions table
│   │   ├── NetworkVisualization.jsx # D3 graph
│   │   └── ReportsSection.jsx # Reports & analytics
│   ├── services/
│   │   ├── apiService.js      # REST API client
│   │   └── socketService.js   # WebSocket client
│   ├── hooks/
│   │   └── useRealtimeData.js # Real-time data hooks
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## 🔌 API Endpoints

### Transactions

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PATCH /api/transactions/:id/status` - Update transaction status

### Alerts

- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/:id` - Get alert by ID
- `GET /api/alerts/stats` - Get alert statistics
- `PATCH /api/alerts/:id/status` - Update alert status

### Network Analysis

- `GET /api/network` - Get transaction network graph
- `GET /api/network/anomalies` - Get anomalous subgraphs
- `GET /api/network/accounts` - Get all accounts
- `GET /api/network/accounts/:accountId/stats` - Get account statistics

## 🤖 Detection Rules

The system detects suspicious patterns using multiple rules:

- **Large Amount Detection**: Transactions exceeding ₹10L
- **Rapid Succession**: Multiple transactions in short timeframes
- **Cross-Border**: International transfer detection
- **Circular Patterns**: A→B→C→A cyclic transactions
- **Unusual Time**: Transactions at odd hours (10 PM - 5 AM)
- **Round Amounts**: Suspiciously round transaction amounts
- **Multiple Destinations**: High number of destinations in 24h
- **Dormant Activation**: Accounts with no activity suddenly active

## 🔄 WebSocket Events

Real-time communication for live alerts and transactions:

```javascript
// Subscribe to alerts
socket.emit("subscribe-alerts");
socket.on("new-alert", (alert) => {
  /* handle */
});

// Subscribe to transactions
socket.emit("subscribe-transactions");
socket.on("new-transaction", (transaction) => {
  /* handle */
});
```

## 📊 Sample Transaction Payload

```json
{
  "transactionId": "TXN001",
  "fromAccount": "ACC001",
  "toAccount": "ACC002",
  "amount": 2500000,
  "currency": "INR",
  "type": "transfer",
  "metadata": {
    "country": "IN",
    "paymentMethod": "wire",
    "reference": "REF123"
  }
}
```

## 🎨 Features

✅ **Real-time Monitoring** - Live transaction and alert streaming via WebSocket
✅ **Advanced Detection** - Rule-based anomaly detection with 8+ detection rules
✅ **Network Analysis** - D3.js visualization of transaction networks
✅ **Interactive Dashboard** - KPI cards, charts, and real-time metrics
✅ **Alert Management** - Categorized alerts (critical/high/medium/low) with status tracking
✅ **Transaction Tracking** - Full transaction history with filtering and search
✅ **Reports & Analytics** - Comprehensive reports with account analysis
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices

## 📈 Dashboard Components

- **KPI Cards**: Total alerts, critical alerts, high-priority alerts
- **Pie Chart**: Alert distribution by severity level
- **Bar Chart**: Alert status breakdown
- **Line Chart**: Transaction amounts over time

## 🛡️ Security Features

- Input validation on all endpoints
- Error handling middleware
- CORS configuration
- MongoDB indexing for performance
- Transaction status tracking

## 🚦 Alert Levels

- **Critical** (🔴): Immediate investigation required
- **High** (🟠): Urgent review needed
- **Medium** (🟡): Monitor closely
- **Low** (🟢): Information level

## 📦 Build & Deploy

### Build Frontend

```bash
cd NEW-Frontend
npm run build
# Output in dist/ folder
```

### Production Environment Variables

**Backend (.env)**

```
PORT=5000
MONGODB_URI=mongodb://prod-db:27017/mld
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (.env)**

```
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
```

## 🧪 Testing Sample Data

You can test the system by creating transactions via the API:

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN123",
    "fromAccount": "ACC001",
    "toAccount": "ACC002",
    "amount": 2500000,
    "type": "transfer",
    "metadata": { "country": "IN" }
  }'
```

## 📋 License

ISC

## 👥 Support

For issues or questions, please refer to the documentation or create an issue in the repository.

---

**Version**: 2.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready
