import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './PriceChart.css'

function PriceChart({ data = [] }) {
  const safeData = Array.isArray(data) ? data : []
  return (
    <div className="price-chart">
      <h3>Price History</h3>
      {safeData.length === 0 ? (
        <div style={{ padding: 12, color: '#666' }}>No price history available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#0f9e5b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default PriceChart

