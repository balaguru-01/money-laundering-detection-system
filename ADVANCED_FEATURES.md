# Advanced Features: Real-Time, ML & Blockchain

This document covers the three new advanced features integrated into the Money Laundering Detection System.

## 1. Real-Time Monitoring with WebSockets 📡

### Overview

WebSocket connections enable live, bi-directional communication between the backend and frontend, allowing real-time alert notifications without polling.

### Architecture

**Backend (Socket.IO)**

- File: `Backend/Server.js`
- Namespace: `http://localhost:5000` (port 5000)
- Rooms: `alerts`, `transactions`

**Frontend (Socket.IO Client)**

- File: `Frontend/src/services/socketService.js`
- Auto-reconnect with exponential backoff
- Graceful degradation if WebSocket unavailable

### Usage

**Subscribe to alerts (Frontend):**

```javascript
import { subscribeToAlerts } from "../services/socketService";

useEffect(() => {
  subscribeToAlerts((newAlert) => {
    console.log("New alert:", newAlert);
    // Update UI with new alert
  });
}, []);
```

**Broadcast alert (Backend):**

```javascript
const io = req.app.get("io");
io.to("alerts").emit("new-alert", {
  id: "alert_123",
  level: "high",
  message: "Suspicious transaction detected",
  timestamp: new Date().toISOString(),
});
```

### API Endpoints (WebSocket Events)

| Event                    | Direction       | Payload            | Description                     |
| ------------------------ | --------------- | ------------------ | ------------------------------- |
| `subscribe-alerts`       | Client → Server | -                  | Subscribe to alert stream       |
| `subscribe-transactions` | Client → Server | -                  | Subscribe to transaction stream |
| `new-alert`              | Server → Client | Alert object       | Real-time alert notification    |
| `new-transaction`        | Server → Client | Transaction object | Real-time transaction update    |

### Running the WebSocket Server

Backend already includes Socket.IO integration:

```bash
cd Backend
npm start
```

The server will log:

```
🔌 WebSocket enabled for real-time updates
```

---

## 2. Machine Learning: Advanced Anomaly Detection 🤖

### Overview

Two-tier ML approach combining:

1. **JavaScript-based** (isolated Forest-like) for quick detection
2. **Python-based** (scikit-learn models) for advanced ensemble detection

### Python ML Models

**File:** `Backend/ml/anomaly_detector.py`

**Models Used:**

1. **Isolation Forest** - Detects outliers by isolating anomalies
2. **Local Outlier Factor (LOF)** - Compares local density of points
3. **Statistical Z-Score** - Identifies values beyond 2.5+ std deviations
4. **Behavioral Pattern Detection** - Flags unusual account behavior

### Setup Python ML Service

**1. Install Python dependencies:**

```bash
cd Backend/ml
pip install -r requirements.txt
```

**2. Start ML microservice:**

```bash
python ml_service.py
```

Output:

```
🤖 ML Anomaly Detection Service
🚀 Running on http://localhost:5001
```

### ML API Endpoints

**POST `/api/ml-anomalies`** (Node.js backend)
Fetch ML-detected anomalies from JavaScript models.

Request: `GET /api/ml-anomalies`

Response:

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "ml_anomaly_5",
      "transactionId": 5,
      "fromAccount": "ACC001",
      "amount": 3000000,
      "anomalyScore": "3.45",
      "confidence": 0.95,
      "model": "isolation-forest",
      "reason": "High value transaction (3.45 std deviations from mean)"
    }
  ]
}
```

**POST `/detect-anomalies`** (Python Flask service on port 5001)
Advanced ML ensemble detection.

Request:

```bash
curl -X POST http://localhost:5001/detect-anomalies \
  -H "Content-Type: application/json" \
  -d '{
    "transactions": [
      {"id": 1, "fromAccount": "ACC001", "amount": 5000000},
      {"id": 2, "fromAccount": "ACC002", "amount": 600000}
    ]
  }'
```

Response:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "ml_anomaly_1",
      "transactionId": 1,
      "anomalyScore": 0.87,
      "models_flagged": 3,
      "confidence": 0.95,
      "reason": "Flagged by 3 ML models"
    }
  ]
}
```

**POST `/detect-behaviors`** (Python Flask service on port 5001)
Behavioral pattern detection.

Response:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "ml_behavior_volume_ACC001",
      "fromAccount": "ACC001",
      "anomalyType": "sudden_volume_increase",
      "confidence": 0.75,
      "reason": "Transaction volume increased from 600000 to 2800000"
    }
  ]
}
```

### ML Feature: Anomaly Scoring

**Confidence Calculation:**

```
confidence = min(0.99, 0.5 + (models_flagged * 0.25))
```

- **1 model flagged:** 75% confidence
- **2 models flagged:** 100% confidence (capped at 99%)
- **Z-score > 3.5:** High priority

### ML Feature: Behavioral Patterns

**Detects:**

1. Sudden volume increases (recent avg > 2x historical avg)
2. High velocity transactions (5+ in time period)
3. Account frequency anomalies
4. Coordinated account activity

---

## 3. Blockchain Integration 🔗

### Overview

Monitor Ethereum and Bitcoin transactions for AML compliance. Detect mixer usage and high-risk wallet interactions.

### API Endpoint

**GET `/api/blockchain`**

Response:

```json
{
  "success": true,
  "data": {
    "ethereum": {
      "network": "Mainnet",
      "connectedAccounts": ["0x742d35Cc..."],
      "recentTransactions": [
        {
          "hash": "0x1234567890abcdef...",
          "from": "0x742d35Cc...",
          "to": "0x987654321...",
          "value": "5.5 ETH",
          "timestamp": "2025-01-06T...",
          "status": "confirmed",
          "riskLevel": "low"
        }
      ],
      "suspiciousPatterns": [
        {
          "pattern": "Rapid sequential transfers",
          "count": 2,
          "severity": "medium"
        }
      ]
    },
    "bitcoin": {
      "network": "Mainnet",
      "addresses": ["1A1z7agoat...", "3J98t1WpEZ..."],
      "recentTransactions": [
        {
          "txid": "aAbcdef0123...",
          "from": "1A1z7agoat...",
          "value": "0.35 BTC",
          "confirmations": 6,
          "riskLevel": "low"
        }
      ]
    },
    "mixerDetection": {
      "flaggedAddresses": ["3J98t1WpEZ73..."],
      "mixerServices": ["Tornado Cash", "Coin Mixer"],
      "riskLevel": "high"
    }
  }
}
```

### Blockchain Monitoring Setup

**For Production Integration:**

1. **Install Web3 libraries:**

```bash
npm install web3 ethers bitcoinjs-lib
```

2. **Connect to Ethereum Node:**

```javascript
const Web3 = require("web3");
const web3 = new Web3("https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY");
```

3. **Connect to Bitcoin Node:**

```javascript
const bitcoin = require("bitcoinjs-lib");
// Or use blockchain.com API for public data
```

4. **Update `Backend/routes/api.js`:**

```javascript
router.get("/blockchain", async (req, res) => {
  const ethTransactions = await getEthereumTransactions();
  const btcTransactions = await getBitcoinTransactions();
  const mixers = await detectMixerUsage(ethTransactions);

  res.json({
    success: true,
    data: {
      ethereum: ethTransactions,
      bitcoin: btcTransactions,
      mixerDetection: mixers,
    },
  });
});
```

### Risk Levels

| Level      | Criteria                                                          |
| ---------- | ----------------------------------------------------------------- |
| **LOW**    | Standard transactions, known addresses, long history              |
| **MEDIUM** | Frequent transfers, new addresses, moderate amounts               |
| **HIGH**   | Mixer usage, sanctioned addresses, rapid transfers, large amounts |

### Mixer Detection

**Detected Services:**

- Tornado Cash
- Coin Mixer
- ChipMixer
- Blender.io
- Privacy Wallets

**Response:**

```json
{
  "mixerDetection": {
    "flaggedAddresses": ["0x123...", "0x456..."],
    "mixerServices": ["Tornado Cash"],
    "riskLevel": "high",
    "action": "BLOCK"
  }
}
```

---

## Integration Points

### Frontend Components Using New Features

**AlertsPanel.jsx** (Real-time updates)

```jsx
import { subscribeToAlerts } from "../services/socketService";

useEffect(() => {
  subscribeToAlerts(handleNewAlert);
}, []);
```

**Dashboard.jsx** (Can add ML anomalies panel)

```jsx
const [mlAnomalies, setMlAnomalies] = useState([]);

useEffect(() => {
  fetchMLAnomalies().then(setMlAnomalies);
}, []);
```

### Backend Integration

**Server.js** - WebSocket server running on port 5000
**api.js** - REST endpoints
**ml_service.py** - ML microservice on port 5001 (separate process)

### System Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React + WS)   │
└────────┬────────┘
         │ WebSocket + HTTP
         ↓
┌─────────────────────────┐
│  Node.js Backend        │
│  (Express + Socket.IO)  │
└────────┬────────────────┘
         │
    ┌────┴────┬─────────────┐
    ↓         ↓             ↓
  REST      WS Events   Python ML
  Calls   (alerts)      (port 5001)
    │         │             │
    └────┬────┴────┬────────┘
         ↓         ↓
    Data Layer  Database
   (mock/real)  (future)
```

---

## Commands Reference

### Start All Services

**Terminal 1 - Backend:**

```bash
cd Backend
npm start
```

**Terminal 2 - ML Service (optional):**

```bash
cd Backend/ml
pip install -r requirements.txt
python ml_service.py
```

**Terminal 3 - Frontend:**

```bash
cd Frontend
npm run dev
```

### Testing Endpoints

**Real-time alerts:**

```bash
# Trigger rescan (will broadcast alerts via WebSocket)
curl -X POST http://localhost:5000/api/rescan
```

**ML Anomalies:**

```bash
curl http://localhost:5000/api/ml-anomalies
```

**Blockchain Data:**

```bash
curl http://localhost:5000/api/blockchain
```

**ML Flask Service:**

```bash
curl http://localhost:5001/health
```

---

## Performance & Scalability

### WebSocket

- **Max connections:** ~10k per server (tune OS limits)
- **Message latency:** <100ms
- **Bandwidth:** ~1KB per alert

### ML Detection

- **Processing time:** 100-500ms per batch
- **Model training:** ~5s with 1000 transactions
- **Memory usage:** ~500MB for Python models

### Blockchain

- **Ethereum queries:** 1-2s per address (API rate-limited)
- **Bitcoin queries:** 0.5-1s per address
- **Cache:** Recommended (Redis) for frequent lookups

---

## Troubleshooting

**WebSocket not connecting:**

- Check `http://localhost:5000` is accessible
- Verify CORS origin matches frontend URL
- Check browser console for connection errors

**ML service not available:**

- Ensure Python 3.8+ installed
- Run `pip install -r Backend/ml/requirements.txt`
- Verify port 5001 is not in use
- Check Flask app is running

**Blockchain endpoint errors:**

- Verify API keys for Ethereum/Bitcoin nodes
- Check rate limits (switch providers if needed)
- Ensure network connectivity

---

## Next Steps

1. **Database Integration** - Replace mock data with real DB
2. **Authentication** - Add JWT for API/WebSocket security
3. **Real Blockchain Nodes** - Connect to actual Eth/BTC endpoints
4. **ML Model Training** - Fine-tune models with real data
5. **Alerting Pipeline** - Send alerts to email/SMS/Slack
6. **Reporting** - PDF export for compliance

---

## References

- **Socket.IO Docs:** https://socket.io/docs/
- **scikit-learn:** https://scikit-learn.org/
- **Web3.js:** https://web3js.readthedocs.io/
- **ethers.js:** https://docs.ethers.org/
