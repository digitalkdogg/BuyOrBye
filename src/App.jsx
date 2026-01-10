import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import StockDashboard from './components/StockDashboard'

function App() {
  const [selectedStock, setSelectedStock] = useState(null)

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>Buy or Bye</h1>
          <SearchBar onSelectStock={setSelectedStock} />
        </header>
        {selectedStock && <StockDashboard stock={selectedStock} />}
      </div>
    </div>
  )}

export default App