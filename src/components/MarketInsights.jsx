import './MarketInsights.css'

function MarketInsights({ insights }) {
  return (
    <div className="market-insights">
      <h3>Market Insights</h3>
      <div className="insights-grid">
        <div className="insight">
          <span className="label">Market Cap</span>
          <span className="value">{insights.marketCap}</span>
        </div>
        <div className="insight">
          <span className="label">P/E Ratio</span>
          <span className="value">{insights.peRatio}</span>
        </div>
        <div className="insight">
          <span className="label">52W High</span>
          <span className="value">${insights.high52}</span>
        </div>
        <div className="insight">
          <span className="label">52W Low</span>
          <span className="value">${insights.low52}</span>
        </div>
        <div className="insight">
          <span className="label">Dividend</span>
          <span className="value">${insights.dividend}</span>
        </div>
        <div className="insight">
          <span className="label">EPS</span>
          <span className="value">${insights.eps}</span>
        </div>
      </div>
    </div>
  )
}

export default MarketInsights

