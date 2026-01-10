import { useState, useEffect } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import StockDashboard from './components/StockDashboard'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [selectedStock, setSelectedStock] = useState(null)

  useEffect(() => {
    console.log('selectedStock changed:', selectedStock)
  }, [selectedStock])

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>Buy or Bye</h1>
          <SearchBar onSelectStock={setSelectedStock} />
        </header>
        {selectedStock && (
          // Wrap dashboard in an error boundary so runtime errors don't crash the whole app
          <ErrorBoundary>
            <StockDashboard stock={selectedStock} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  )}

export default App