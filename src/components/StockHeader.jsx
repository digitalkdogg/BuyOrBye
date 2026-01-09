import './StockHeader.css'

function StockHeader({ stock, data }) {
  return (
    <div className="stock-header">
      <div className="stock-info">
        <h2>{stock.symbol}</h2>
        <p>{stock.name}</p>
      </div>
      <div className="price-info">
        <span className="price">${data.price.toFixed(2)}</span>
        <span className={`change ${data.change >= 0 ? 'positive' : 'negative'}`}>
          {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  )
}

export default StockHeader

