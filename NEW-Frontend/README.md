# Frontend - Money Laundering Detection System v2.0

Modern React + Vite frontend for the Money Laundering Detection System with real-time monitoring, analytics, and visualization.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

## 📦 Dependencies

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Recharts** - Charts and graphs
- **D3.js** - Network visualization

## 🎯 Components

### Dashboard

- KPI cards with key metrics
- Alert severity distribution (pie chart)
- Alert status breakdown (bar chart)
- Transaction amounts over time (line chart)

### AlertsPanel

- Real-time alert streaming
- Alert filtering by severity level
- Alert status management (open/reviewed/resolved/false-positive)
- Color-coded severity indicators
- Auto-scrolling for new alerts

### TransactionList

- Paginated transaction history
- Filtering by status
- Search by account
- Sortable columns
- Status badges

### NetworkVisualization

- Interactive D3.js force-directed graph
- Drag and reposition nodes
- Account clustering
- Transaction flows visualization
- Network statistics

### ReportsSection

- Custom report generation
- Date range filtering (24h, 7 days, 30 days)
- Summary statistics
- Top accounts by activity
- Export to text file

## 🔧 Configuration

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

For production, update with your deployment URLs.

## 📱 Responsive Design

All components are fully responsive:

- Desktop (1920px+)
- Tablet (768px - 1920px)
- Mobile (320px - 768px)

## 🎨 Styling

- **Dark theme** with cyberpunk aesthetics
- **CSS Variables** for easy customization
- **Gradient backgrounds** for visual appeal
- **Smooth animations** and transitions
- **Color scheme**: Primary (#00d4ff), Secondary (#ff006e), Success (#00ff88)

## 🔄 Real-Time Features

Uses Socket.IO for live data updates:

```javascript
import {
  subscribeToAlerts,
  subscribeToTransactions,
} from "./services/socketService";

// Subscribe to new alerts
subscribeToAlerts((alert) => {
  console.log("New alert:", alert);
  // Update UI
});

// Subscribe to new transactions
subscribeToTransactions((transaction) => {
  console.log("New transaction:", transaction);
  // Update UI
});
```

## 📊 API Integration

All API calls through `apiService.js`:

```javascript
import { alertAPI, transactionAPI, networkAPI } from "./services/apiService";

// Fetch alerts
const alerts = await alertAPI.getAll(limit, level, status);

// Create transaction
const result = await transactionAPI.create(transactionData);

// Get network
const network = await networkAPI.getNetwork();
```

## 🎯 Hooks

Custom hooks for common functionality:

```javascript
import { useAlerts, useTransactions } from "./hooks/useRealtimeData";

// Subscribe to real-time alerts
const alerts = useAlerts(initialAlerts);

// Subscribe to real-time transactions
const transactions = useTransactions(initialTransactions);
```

## 📦 Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
└── favicon.ico
```

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy the dist/ folder
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔗 API Endpoints Used

- `GET /api/alerts` - Fetch alerts
- `GET /api/alerts/stats` - Alert statistics
- `PATCH /api/alerts/:id/status` - Update alert
- `GET /api/transactions` - Fetch transactions
- `POST /api/transactions` - Create transaction
- `GET /api/network` - Network graph data

## 📋 Environment Variables

| Variable        | Description          | Example                   |
| --------------- | -------------------- | ------------------------- |
| VITE_API_URL    | Backend API base URL | http://localhost:5000/api |
| VITE_SOCKET_URL | WebSocket server URL | http://localhost:5000     |

## 🐛 Troubleshooting

**WebSocket connection failing?**

- Check if backend server is running on correct port
- Verify VITE_SOCKET_URL is correct
- Check browser console for errors

**Charts not rendering?**

- Ensure Recharts is properly installed
- Check API response data format

**Network visualization not loading?**

- Verify D3.js is loaded
- Check browser console for D3 errors
- Ensure SVG element is accessible

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Recharts Documentation](https://recharts.org)
- [D3.js Guide](https://d3js.org)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)

## 📄 License

ISC

---

**Version**: 2.0.0  
**Status**: Production Ready
