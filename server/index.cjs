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
  const { default: fetch } = await import('node-fetch')
  return fetch(url)
}

// Simple in-memory cache with TTL
const cache = new Map()
function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiry) {
    cache.delete(key)
    return null
  }
  return entry.value
}
function setCached(key, value, ttl = 60000) {
  cache.set(key, { value, expiry: Date.now() + ttl })
}
async function fetchWithCache(url, ttl = 60000) {
  const key = url
  const cached = getCached(key)
  if (cached) {
    console.log('cache hit:', key)
    return cached
  }
  console.log('cache miss:', key)
  const r = await safeFetch(url)
  const data = await r.json()
  setCached(key, data, ttl)
  return data
}

async function proxy(url, res, ttl = 60000) {
  try {
    const data = await fetchWithCache(url, ttl)
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
  // short TTL for quotes (15 seconds)
  proxy(url, res, 15 * 1000)
})

app.get('/api/time_series', (req, res) => {
  const symbol = req.query.symbol
  const interval = req.query.interval || '1day'
  const outputsize = req.query.outputsize || '30'
  if (!symbol) return res.status(400).json({ error: 'symbol query parameter is required' })
  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&outputsize=${encodeURIComponent(outputsize)}&apikey=${API_KEY}`
  // longer TTL for historical series (5 minutes)
  proxy(url, res, 5 * 60 * 1000)
})

// Search symbols (used by the frontend for autocompletion)
app.get('/api/search', (req, res) => {
  const q = req.query.q
  const limit = req.query.limit || 10
  if (!q) return res.status(400).json({ error: 'q query parameter is required' })
  const url = `https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(q)}&limit=${encodeURIComponent(limit)}&apikey=${API_KEY}`
  // modest TTL for search results (1 minute)
  proxy(url, res, 60 * 1000)
})

app.listen(PORT, () => {
  console.log(`Twelve Data proxy listening on http://localhost:${PORT}`)
})
