import { useState, useRef } from 'react'
import './SearchBar.css'

function SearchBar({ onSelectStock }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)
  const controllerRef = useRef(null)

  const fetchSuggestions = async (q) => {
    if (!q || q.length < 2) {
      setSuggestions([])
      return
    }

    // Abort previous request
    if (controllerRef.current) controllerRef.current.abort()
    controllerRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=10`, {
        signal: controllerRef.current.signal
      })
      const json = await res.json()

      // Twelve Data's symbol_search may return an object with a `data` array
      const raw = json.data || json || []
      const items = Array.isArray(raw)
        ? raw.map(item => ({
            symbol: item.symbol,
            name: item.instrument_name || item.name || item.description || ''
          }))
        : []

      setSuggestions(items.slice(0, 10))
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Search failed', err)
        setError('Search failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(value.trim()), 300)
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
        placeholder="Search for a stock (e.g. AAPL or WMT)..."
        value={query}
        onChange={handleInputChange}
      />
      {loading && <div className="search-loading">Searching…</div>}
      {error && <div className="search-error">{error}</div>}
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
