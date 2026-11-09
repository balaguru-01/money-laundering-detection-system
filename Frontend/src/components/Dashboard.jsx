import React from 'react'
import TransactionList from './TransactionList'
import AlertsPanel from './AlertsPanel'
import NetworkVisualization from './NetworkVisualization'
import ReportsSection from './ReportsSection'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-section full-width">
          <AlertsPanel />
        </div>
        <div className="dashboard-section">
          <NetworkVisualization />
        </div>
        <div className="dashboard-section">
          <TransactionList />
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-section full-width">
          <ReportsSection />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
