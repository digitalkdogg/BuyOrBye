const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001
const API_KEY = process.env.TWELVE_API_KEY

if (!API_KEY) {
  console.warn('TWELVE_API_KEY is not set. Add it to .env to enable real data fetching.')
}

app.use(cors())

const safeFetch = async (url) => {
  if (globalThis.fetch) return globalThis.fetch(url)
  // Fall back to node-fetch dynamically if running on older Node
  const { default: fetch } = await import('node-fetch')
  return fetch(url)
}

async function proxy(url, res) {
  try {
    const r = await safeFetch(url)
    const data = await r.json()
    res.json(data)
  } catch (err) {
    console.error('Proxy fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch from Twelve Data', detail: err.message })
  }
}

app.get('/api/quote', (req, res) => {
  const symbol = req.query.symbol
  if (!symbol) return res.status(400).json({ error: 'symbol query parameter is required' })
  const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`
  proxy(url, res)
})

app.get('/api/time_series', (req, res) => {
  const symbol = req.query.symbol
  const interval = req.query.interval || '1day'
  const outputsize = req.query.outputsize || '30'
  if (!symbol) return res.status(400).json({ error: 'symbol query parameter is required' })
  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&outputsize=${encodeURIComponent(outputsize)}&apikey=${API_KEY}`
  proxy(url, res)
})

app.listen(PORT, () => {
  console.log(`Twelve Data proxy listening on http://localhost:${PORT}`)
})
