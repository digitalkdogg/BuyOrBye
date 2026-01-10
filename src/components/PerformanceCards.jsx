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
      {periods.map(period => {
        const perf = performance?.[period.key] || {}
        const change = perf.change
        const percent = perf.percent
        return (
          <div key={period.key} className="performance-card">
            <h4>{period.label}</h4>
            <div className="change">
              {change != null ? `$${Number(change).toFixed(2)}` : '—'}
            </div>
            <div className="percent">
              {percent != null ? `${Number(percent).toFixed(2)}%` : '—'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PerformanceCards

