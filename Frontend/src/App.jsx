import Header from "../Header";
import Footer from "../Footer";
import Dashboard from "./components/Dashboard";
import TransactionList from "./components/TransactionList";
import NetworkVisualization from "./components/NetworkVisualization";
import AlertsPanel from "./components/AlertsPanel";
import ReportsSection from "./components/ReportsSection";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/network" element={<NetworkVisualization />} />
            <Route path="/alerts" element={<AlertsPanel />} />
            <Route path="/reports" element={<ReportsSection />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
