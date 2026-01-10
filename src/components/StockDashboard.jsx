import { useState, useEffect } from 'react'
import StockHeader from './StockHeader'
import TimeRangeSelector from './TimeRangeSelector'
import PriceChart from './PriceChart'
import PerformanceCards from './PerformanceCards'
import AIRecommendations from './AIRecommendations'
import MarketInsights from './MarketInsights'
import RiskAssessment from './RiskAssessment'
import './StockDashboard.css'

function StockDashboard({ stock }) {
  const [timeRange, setTimeRange] = useState('1D')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryToggle, setRetryToggle] = useState(0)

  // Map our UI ranges to Twelve Data intervals and sizes
  const rangeToInterval = (range) => {
    switch (range) {
      case '1D': return { interval: '1min', outputsize: 24 }
      case '1M': return { interval: '1day', outputsize: 30 }
      case '6M': return { interval: '1day', outputsize: 180 }
      case '1Y': return { interval: '1day', outputsize: 365 }
      default: return { interval: '1day', outputsize: 30 }
    }
  }

  useEffect(() => {
    // Fetch real data when a stock is selected
    if (!stock || !stock.symbol) return

    const controller = new AbortController()
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const symbol = stock.symbol
      const { interval, outputsize } = rangeToInterval(timeRange)

      try {
        const [quoteRes, seriesRes] = await Promise.all([
          fetch(`/api/quote?symbol=${encodeURIComponent(symbol)}`, { signal: controller.signal }),
          fetch(`/api/time_series?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&outputsize=${encodeURIComponent(outputsize)}`, { signal: controller.signal })
        ])

        if (!quoteRes.ok) {
          const text = await quoteRes.text().catch(() => '<no body>')
          throw new Error(`Quote fetch failed: ${quoteRes.status} ${text}`)
        }
        if (!seriesRes.ok) {
          const text = await seriesRes.text().catch(() => '<no body>')
          throw new Error(`Time series fetch failed: ${seriesRes.status} ${text}`)
        }

        const quote = await quoteRes.json()
        const series = await seriesRes.json()

        // Check for API errors in response bodies
        if (quote && (quote.status === 'error' || quote.code === 'error' || quote.message || quote.error)) {
          throw new Error('Quote API error: ' + (quote.message || quote.error || JSON.stringify(quote)))
        }
        if (series && (series.status === 'error' || series.code === 'error' || series.message || series.error)) {
          throw new Error('Time series API error: ' + (series.message || series.error || JSON.stringify(series)))
        }

        // Construct usable data with fallbacks to mock data behavior
        const history = (series.values || []).slice().reverse().map(v => ({ time: v.datetime || v.timestamp, price: Number(v.close) }))
        const price = quote.price ? Number(quote.price) : (history.length ? history[history.length - 1].price : 0)
        const previous = quote.previous_close ? Number(quote.previous_close) : (history.length > 1 ? history[history.length - 2].price : null)
        const change = previous != null ? +(price - previous).toFixed(2) : 0
        const changePercent = previous != null && previous !== 0 ? +((change / previous) * 100).toFixed(2) : 0

        // Helper to compute change over a series (values expected newest-first from API)
        const computePerfFromValues = (values) => {
          if (!values || values.length < 2) return null
          const vals = values.slice().reverse() // oldest -> newest
          const first = Number(vals[0].close)
          const last = Number(vals[vals.length - 1].close)
          if (Number.isNaN(first) || Number.isNaN(last) || first === 0) return null
          const c = +(last - first).toFixed(2)
          const p = +(((c / first) * 100)).toFixed(2)
          return { change: c, percent: p }
        }

        // Try to fetch longer histories to compute month / 6M / 1Y performance
        let monthPerf = null
        let sixMonthPerf = null
        let yearPerf = null

        try {
          const monthRes = await fetch(`/api/time_series?symbol=${encodeURIComponent(symbol)}&interval=1day&outputsize=30`, { signal: controller.signal })
          const monthJson = await monthRes.json()
          monthPerf = computePerfFromValues(monthJson.values)
        } catch (err) {
          console.warn('Failed to fetch 1M series', err)
        }

        try {
          const sixRes = await fetch(`/api/time_series?symbol=${encodeURIComponent(symbol)}&interval=1day&outputsize=180`, { signal: controller.signal })
          const sixJson = await sixRes.json()
          sixMonthPerf = computePerfFromValues(sixJson.values)
        } catch (err) {
          console.warn('Failed to fetch 6M series', err)
        }

        try {
          const yearRes = await fetch(`/api/time_series?symbol=${encodeURIComponent(symbol)}&interval=1day&outputsize=365`, { signal: controller.signal })
          const yearJson = await yearRes.json()
          yearPerf = computePerfFromValues(yearJson.values)
        } catch (err) {
          console.warn('Failed to fetch 1Y series', err)
        }

        const performance = {
          day: { change, percent: changePercent },
          month: monthPerf || { change: null, percent: null },
          sixMonth: sixMonthPerf || { change: null, percent: null },
          year: yearPerf || { change: null, percent: null }
        }

        // Simple, explainable rule-based recommender (SMA crossover + short-term momentum + volatility)
        const toNumber = v => (v == null ? NaN : Number(v))
        const computeSMA = (values, period) => {
          if (!Array.isArray(values) || values.length < period) return null
          // values are from API newest-first; convert to array of closes oldest -> newest
          const closes = values.slice().reverse().map(v => toNumber(v.close)).filter(v => !Number.isNaN(v))
          if (closes.length < period) return null
          const window = closes.slice(-period)
          const sum = window.reduce((s, x) => s + x, 0)
          return sum / window.length
        }

        const stddev = (arr) => {
          if (!arr || arr.length < 2) return null
          const n = arr.length
          const mean = arr.reduce((s, x) => s + x, 0) / n
          const variance = arr.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / (n - 1)
          return Math.sqrt(variance)
        }

        const generateAIRecommendation = (price, seriesValues) => {
          if (!seriesValues || seriesValues.length < 10) {
            return { action: 'HOLD', confidence: 45, reasoning: 'Insufficient historical data for reliable recommendation.' }
          }

          const sma50 = computeSMA(seriesValues, 50)
          const sma200 = computeSMA(seriesValues, 200)

          const closes = seriesValues.slice().reverse().map(v => toNumber(v.close)).filter(v => !Number.isNaN(v))
          const returns = []
          for (let i = 1; i < closes.length; i++) returns.push((closes[i] - closes[i - 1]) / closes[i - 1])
          const vol = stddev(returns) || 0

          // Short-term momentum: pct change over last 7 days (if available)
          let mom7 = null
          if (closes.length >= 8) {
            const first = closes[closes.length - 8]
            const last = closes[closes.length - 1]
            if (!Number.isNaN(first) && first !== 0) mom7 = (last - first) / first
          }

          // Base confidence influenced by volatility (more volatile -> lower confidence)
          const volPenalty = Math.min(30, Math.round(vol * 100 * 2)) // map vol to 0-30 roughly

          if (sma50 && sma200) {
            // clear crossover cases
            if (sma50 > sma200 && price > sma50 * 1.02 && mom7 != null && mom7 > 0.01) {
              const diff = (price / sma50) - 1
              const base = 65
              const bonus = Math.min(25, Math.round(diff * 100))
              const confidence = Math.max(50, Math.min(95, base + bonus - volPenalty))
              return { action: 'BUY', confidence, reasoning: `Bullish signals: SMA50 > SMA200, price ~${(diff*100).toFixed(2)}% above SMA50, 7d momentum ${(mom7*100).toFixed(2)}%` }
            }
            if (sma50 < sma200 && price < sma50 * 0.98 && mom7 != null && mom7 < -0.01) {
              const diff = 1 - (price / sma50)
              const base = 65
              const bonus = Math.min(25, Math.round(diff * 100))
              const confidence = Math.max(50, Math.min(95, base + bonus - volPenalty))
              return { action: 'SELL', confidence, reasoning: `Bearish signals: SMA50 < SMA200, price ~${(diff*100).toFixed(2)}% below SMA50, 7d momentum ${(mom7*100).toFixed(2)}%` }
            }
          }

          // Fallback: small momentum-based signals
          if (mom7 != null) {
            if (mom7 > 0.02) return { action: 'BUY', confidence: Math.max(45, 60 - volPenalty), reasoning: `Positive short-term momentum: ${(mom7*100).toFixed(2)}% over 7 days.` }
            if (mom7 < -0.02) return { action: 'SELL', confidence: Math.max(45, 60 - volPenalty), reasoning: `Negative short-term momentum: ${(mom7*100).toFixed(2)}% over 7 days.` }
          }

          return { action: 'HOLD', confidence: Math.max(30, 55 - volPenalty), reasoning: 'No strong technical signals detected.' }
        }

        const aiRecommendation = generateAIRecommendation(price, series.values)

        // Compute closes, returns and volatility (stddev) in outer scope so `vol` is defined for risk
        const closes = (series.values || []).slice().reverse().map(v => toNumber(v.close)).filter(v => !Number.isNaN(v))
        const returns = []
        for (let i = 1; i < closes.length; i++) returns.push((closes[i] - closes[i - 1]) / closes[i - 1])
        const vol = returns.length >= 2 ? stddev(returns) : null

        const insights = {
          marketCap: quote.market_cap || 'N/A',
          peRatio: quote.pe || 'N/A',
          high52: quote.fifty_two_week ? quote.fifty_two_week.high : (quote.high_52weeks || 'N/A'),
          low52: quote.fifty_two_week ? quote.fifty_two_week.low : (quote.low_52weeks || 'N/A'),
          dividend: quote.dividend || 'N/A',
          eps: quote.eps || 'N/A'
        }
        const risk = { volatility: vol != null ? (vol > 0.05 ? 'High' : vol > 0.02 ? 'Medium' : 'Low') : 'Unknown', liquidity: 'Unknown', correlation: null }

        setData({ price, change, changePercent, history, performance, aiRecommendation, insights, risk })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch real data', err)
          setError(`Failed to fetch live data — ${err.message || String(err)} — using mock data`)
          setData({ price: 150.25, change: 2.5, changePercent: 1.69, history: generateMockHistory(timeRange) })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => controller.abort()
  }, [stock, timeRange, retryToggle])

  // Fallback to mock data until real data is available
  const displayData = data || {
    price: 150.25,
    change: 2.5,
    changePercent: 1.69,
    history: generateMockHistory(timeRange),
    performance: {
      day: { change: 2.5, percent: 1.69 },
      month: { change: 15.3, percent: 11.35 },
      sixMonth: { change: 45.2, percent: 43.02 },
      year: { change: 75.8, percent: 101.87 }
    },
    aiRecommendation: {
      action: 'BUY',
      confidence: 85,
      reasoning: 'Strong earnings growth and positive market sentiment.'
    },
    insights: {
      marketCap: '2.5T',
      peRatio: 28.5,
      high52: 198.23,
      low52: 124.17,
      dividend: 0.96,
      eps: 5.89
    },
    risk: {
      volatility: 'Medium',
      liquidity: 'High',
      correlation: 0.72
    }
  }

  return (
    <div className="stock-dashboard">
      <StockHeader stock={stock} data={displayData} />
      <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
      {loading && <p>Loading live data...</p>}
      {error && (
        <div style={{ color: 'orange' }}>
          <p>{error}</p>
          <button onClick={() => setRetryToggle(r => r + 1)}>Retry now</button>
        </div>
      )}
      <PriceChart data={displayData.history} />
      <PerformanceCards performance={displayData.performance} />
      <div className="dashboard-grid">
        <AIRecommendations recommendation={displayData.aiRecommendation} />
        <MarketInsights insights={displayData.insights} />
        <RiskAssessment risk={displayData.risk} />
      </div>
    </div>
  )
}

function generateMockHistory(range) {
  const points = range === '1D' ? 24 : range === '1M' ? 30 : range === '6M' ? 180 : 365
  const data = []
  let price = 150
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.5) * 2
    data.push({ time: i, price: Math.max(price, 100) })
  }
  return data
}

export default StockDashboard

