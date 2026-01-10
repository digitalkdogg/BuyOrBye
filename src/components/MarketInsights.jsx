import './MarketInsights.css'

function MarketInsights({ insights = {} }) {
  const formatNumber = (v) => (v != null && !Number.isNaN(Number(v)) ? Number(v) : null)

  const marketCap = insights.marketCap || '—'
  const peRatio = insights.peRatio != null ? Number(insights.peRatio) : '—'
  const high52 = formatNumber(insights.high52)
  const low52 = formatNumber(insights.low52)
  const dividend = formatNumber(insights.dividend)
  const eps = formatNumber(insights.eps)

  return (
    <div className="market-insights">
      <h3>Market Insights</h3>
      <div className="insights-grid">
        <div className="insight">
          <span className="label">Market Cap</span>
          <span className="value">{marketCap}</span>
        </div>
        <div className="insight">
          <span className="label">P/E Ratio</span>
          <span className="value">{peRatio}</span>
        </div>
        <div className="insight">
          <span className="label">52W High</span>
          <span className="value">{high52 != null ? `$${high52}` : '—'}</span>
        </div>
        <div className="insight">
          <span className="label">52W Low</span>
          <span className="value">{low52 != null ? `$${low52}` : '—'}</span>
        </div>
        <div className="insight">
          <span className="label">Dividend</span>
          <span className="value">{dividend != null ? `$${dividend}` : '—'}</span>
        </div>
        <div className="insight">
          <span className="label">EPS</span>
          <span className="value">{eps != null ? `$${eps}` : '—'}</span>
        </div>
      </div>
    </div>
  )
}

export default MarketInsights

