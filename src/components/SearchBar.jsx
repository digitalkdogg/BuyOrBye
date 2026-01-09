import { useState } from 'react'
import './SearchBar.css'

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'CIEN', name: 'Ciena Corporation' },
  // Add more as needed
]

function SearchBar({ onSelectStock }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (value) {
      const filtered = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(value.toLowerCase()) ||
        stock.name.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const handleSelect = (stock) => {
    setQuery(stock.symbol)
    setSuggestions([])
    onSelectStock(stock)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a stock..."
        value={query}
        onChange={handleInputChange}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(stock => (
            <li key={stock.symbol} onClick={() => handleSelect(stock)}>
              {stock.symbol} - {stock.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar

