import './TimeRangeSelector.css'

function TimeRangeSelector({ selected, onSelect }) {
  const ranges = ['1D', '1M', '6M', '1Y']

  return (
    <div className="time-range-selector">
      {ranges.map(range => (
        <button
          key={range}
          className={selected === range ? 'active' : ''}
          onClick={() => onSelect(range)}
        >
          {range}
        </button>
      ))}
    </div>
  )
}

export default TimeRangeSelector

