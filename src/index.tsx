// Main Application Entry Point
// Integrates all StreamWeave components

import React from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './components/Dashboard-simple'
import './styles/Dashboard.css'

const App: React.FC = () => {
  return (
    <div className="app">
      <Dashboard />
    </div>
  )
}

// Initialize the application
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Enable hot module replacement in development
declare let module: {
  hot?: {
    accept(): void
  }
}

if (module.hot) {
  module.hot.accept()
}

export default App