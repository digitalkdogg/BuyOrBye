import './PerformanceCards.css'

function PerformanceCards({ performance }) {
  const periods = [
    { key: 'day', label: 'Day' },
    { key: 'month', label: 'Month' },
    { key: 'sixMonth', label: '6 Month' },
    { key: 'year', label: 'Year' }
  ]

  return (
    <div className="performance-cards">
      {periods.map(period => (
        <div key={period.key} className="performance-card">
          <h4>{period.label}</h4>
          <div className="change">
            ${performance[period.key].change.toFixed(2)}
          </div>
          <div className="percent">
            {performance[period.key].percent.toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  )
}

export default PerformanceCards

