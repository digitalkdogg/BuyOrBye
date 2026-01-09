import { useState } from 'react'
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

  // Mock data for the stock
  const mockData = {
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
      <StockHeader stock={stock} data={mockData} />
      <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
      <PriceChart data={mockData.history} />
      <PerformanceCards performance={mockData.performance} />
      <div className="dashboard-grid">
        <AIRecommendations recommendation={mockData.aiRecommendation} />
        <MarketInsights insights={mockData.insights} />
        <RiskAssessment risk={mockData.risk} />
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

