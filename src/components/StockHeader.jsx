import './StockHeader.css'

function StockHeader({ stock, data }) {
  const price = Number(data?.price || 0)
  const change = Number(data?.change || 0)
  const changePercent = Number(data?.changePercent || 0)

  return (
    <div className="stock-header">
      <div className="stock-info">
        <h2>{stock.symbol}</h2>
        <p>{stock.name}</p>
      </div>
      <div className="price-info">
        <span className="price">${price.toFixed(2)}</span>
        <span className={`change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  )
}

export default StockHeader

