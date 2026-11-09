# Proactive Money Laundering Detection System

A full-stack application for detecting suspicious financial transactions and money laundering patterns using rule-based detection and network analysis.

## Features

✅ **Transaction Monitoring** - Real-time tracking of all transactions  
✅ **Suspicious Pattern Detection** - Rule-based and graph-based anomaly detection  
✅ **Network Visualization** - D3.js interactive network graph of transaction flows  
✅ **Alert Management** - Categorized alerts (High/Medium/Low) with detailed metadata  
✅ **Cross-border Detection** - Identifies international transfers and high-risk patterns  
✅ **Circular Pattern Detection** - Finds suspicious cycles in transaction networks

## Architecture

```
├── Backend/               # Express.js API
│   ├── data/
│   │   └── mockData.js       # Sample transaction & account data
│   ├── utils/
│   │   ├── patternDetection.js  # Detection algorithms
│   │   └── networkAnalysis.js   # Graph analysis
│   ├── routes/
│   │   └── api.js         # API endpoints
│   └── Server.js          # Express app entry point
│
└── Frontend/              # React.js UI
    ├── src/
    │   ├── components/     # React components
    │   ├── services/
    │   │   └── apiService.js  # Backend API client
    │   └── main.jsx
    └── public/
```

## Backend API Endpoints

### GET `/api/transactions`

Fetch transaction data with optional filtering.

**Query Parameters:**

- `limit` (optional): Number of records to return (default: all)
- `status` (optional): Filter by status ('flagged', 'cleared', etc.)

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "account": "ACC001",
      "amount": 2500000,
      "status": "Flagged",
      "date": "2025-01-05",
      "fromAccount": "ACC001",
      "toAccount": "ACC002",
      "type": "transfer"
    }
  ]
}
```

### GET `/api/alerts`

Retrieve detected suspicious activity alerts.

**Query Parameters:**

- `level` (optional): Filter by alert level ('high', 'medium', 'low')

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "alert_1_large",
      "level": "high",
      "message": "Large transaction detected on ACC001 - ₹25.00 L",
      "time": "5 mins ago",
      "rule": "LARGE_AMOUNT",
      "details": {
        "fromAccount": "ACC001",
        "amount": 2500000,
        "transactionId": 1
      }
    }
  ]
}
```

### GET `/api/network`

Get network graph data for visualization.

**Response:**

```json
{
  "success": true,
  "data": {
    "graph": {
      "nodes": [
        {
          "id": "ACC001",
          "label": "Business A",
          "type": "account",
          "balance": 5000000,
          "risk": "medium",
          "size": 10
        }
      ],
      "links": [
        {
          "source": "ACC001",
          "target": "ACC002",
          "value": 2500000,
          "count": 1,
          "type": "transfer"
        }
      ]
    },
    "stats": {
      "uniqueNodes": 7,
      "totalTransactions": 10,
      "totalVolume": 14000000,
      "avgTransactionSize": 1400000
    }
  }
}
```

### GET `/api/stats`

Get dashboard statistics and summary.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalTransactions": 10,
    "totalAlerts": 8,
    "highRiskAlerts": 3,
    "totalVolume": 14000000,
    "accounts": 5,
    "recentAlerts": [...]
  }
}
```

### POST `/api/rescan`

Trigger re-scanning for suspicious patterns.

**Response:**

```json
{
  "success": true,
  "message": "Scan complete",
  "alertsFound": 8
}
```

## Detection Rules

### 1. Large Amount Transactions

- **Threshold:** ₹10,00,000 (1 million)
- **Alert Level:** HIGH
- Detects single transactions exceeding the large amount threshold

### 2. Rapid Consecutive Transfers

- **Threshold:** 5+ transfers within 1 hour
- **Alert Level:** HIGH
- Identifies suspicious patterns of multiple rapid transfers from a single account

### 3. Cross-border High Amount Transfers

- **Threshold:** Cross-border transfer > ₹15,00,000 (1.5 million)
- **Alert Level:** HIGH
- Flags international transfers with significant amounts

### 4. High-risk Account Activity

- **Threshold:** High-risk account with transfer > ₹5,00,000
- **Alert Level:** MEDIUM
- Monitors accounts marked as high-risk for significant activity

### 5. Circular Transaction Patterns

- **Detection:** 3-node cycles (A→B→C→A)
- **Alert Level:** MEDIUM
- Identifies potential money laundering through circular transfers

## Setup & Installation

### Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Start the server
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173` (or Vite's assigned port)

## Environment Variables

Create `.env` in the Backend directory (optional):

```env
PORT=5000
NODE_ENV=development
```

Create `.env` in the Frontend directory (optional):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Data Processing & Detection

### Pattern Detection Flow

1. **Data Ingestion** → Mock transactions are loaded from `data/mockData.js`
2. **Rule Evaluation** → Each rule in `patternDetection.js` evaluates all transactions
3. **Alert Generation** → Flagged transactions generate alerts with metadata
4. **API Response** → Alerts are served via `/api/alerts` endpoint
5. **Frontend Display** → React components fetch and render alerts

### Network Analysis

- **Graph Construction** → Builds nodes (accounts/banks) and links (transactions)
- **Volume Aggregation** → Combines multiple transfers between same pair
- **Risk Scoring** → Assigns risk levels based on account profiles
- **Centrality Analysis** → Identifies hub accounts (highest transaction volume)

## Technology Stack

**Backend:**

- Node.js + Express.js
- CORS for cross-origin requests
- In-memory data storage (mock data)

**Frontend:**

- React 18+
- Axios for API calls
- D3.js for network visualization
- Chart.js for analytics (expandable)
- Vite bundler

## File Structure

```
Backend/
├── data/
│   └── mockData.js           # Sample transactions (10 records)
├── utils/
│   ├── patternDetection.js   # 5 detection rules
│   └── networkAnalysis.js    # Graph algorithms
├── routes/
│   └── api.js                # 5 API endpoints
├── package.json
└── Server.js                 # Express app

Frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── AlertsPanel.jsx
│   │   ├── TransactionList.jsx
│   │   ├── NetworkVisualization.jsx
│   │   ├── ReportsSection.jsx
│   │   ├── ReportViewer.jsx
│   │   └── [CSS files]
│   ├── services/
│   │   └── apiService.js     # Axios wrapper
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

## Running the Full Application

**Terminal 1 - Backend:**

```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**

```bash
cd Frontend
npm run dev
```

Visit `http://localhost:5173` to access the dashboard.

## Example Usage

### Fetch Transactions via JavaScript

```javascript
import { fetchTransactions } from "./src/services/apiService";

const transactions = await fetchTransactions(10);
console.log(transactions);
```

### Fetch Alerts with Filter

```javascript
import { fetchAlerts } from "./src/services/apiService";

const highRiskAlerts = await fetchAlerts("high");
console.log(highRiskAlerts);
```

### Trigger Pattern Detection Rescan

```javascript
import { triggerRescan } from "./src/services/apiService";

const result = await triggerRescan();
console.log(`Alerts found: ${result.alertsFound}`);
```

## Customization

### Adding New Detection Rules

Edit `Backend/utils/patternDetection.js`:

```javascript
// Add rule to detectSuspiciousPatterns function
transactions.forEach((tx) => {
  if (YOUR_CONDITION) {
    alerts.push({
      id: `alert_${tx.id}_yourRule`,
      level: "high",
      message: "Your custom alert message",
      rule: "YOUR_RULE_NAME",
    });
  }
});
```

### Modifying Thresholds

Update `THRESHOLDS` object in `patternDetection.js`:

```javascript
const THRESHOLDS = {
  LARGE_AMOUNT: 1000000, // Change to desired amount
  RAPID_TRANSFER_COUNT: 5, // Change window size
  RAPID_TRANSFER_WINDOW: 3600000, // Change time window (ms)
  CROSS_BORDER_HIGH_AMOUNT: 1500000,
};
```

### Using Real Data

Replace mock data in `Backend/data/mockData.js` with database queries:

```javascript
// Example: Connect to MongoDB
const mockTransactions = await Transaction.find().limit(100);
```

## Performance Considerations

- **Mock Data**: Current setup uses in-memory data (10 transactions, 5 accounts)
- **Scalability**: For production, implement:
  - Database (MongoDB, PostgreSQL)
  - Pagination for large datasets
  - Caching (Redis)
  - Batch processing for alerts
  - WebSocket for real-time updates

## Troubleshooting

**CORS Error:**

- Ensure backend is running on port 5000
- Check `cors()` is enabled in `Server.js`

**API Call Failures:**

- Verify backend is running: `curl http://localhost:5000/`
- Check network requests in browser DevTools

**Network Visualization Not Loading:**

- Ensure D3.js is installed: `npm install d3`
- Check API response in browser console

## Future Enhancements

- [ ] Machine learning models for pattern detection
- [ ] Real-time WebSocket updates
- [ ] Database integration
- [ ] Advanced graph analytics (PageRank, community detection)
- [ ] PDF report generation
- [ ] Email alerts
- [ ] User authentication & roles
- [ ] Transaction timeline visualization

## License

ISC

## Support

For issues or questions, refer to the API documentation above or check the console logs for error details.
