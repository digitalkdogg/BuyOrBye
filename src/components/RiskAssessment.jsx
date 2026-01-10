import './RiskAssessment.css'

function RiskAssessment({ risk = {} }) {
  const volatility = typeof risk.volatility === 'string' ? risk.volatility : 'Unknown'
  const liquidity = typeof risk.liquidity === 'string' ? risk.liquidity : 'Unknown'
  const correlation = typeof risk.correlation === 'number' ? risk.correlation : null

  const volatilityClass = typeof volatility === 'string' ? volatility.toLowerCase() : 'unknown'
  const liquidityClass = typeof liquidity === 'string' ? liquidity.toLowerCase() : 'unknown'

  return (
    <div className="risk-assessment">
      <h3>Risk Assessment</h3>
      <div className="risk-meters">
        <div className="risk-meter">
          <span className="label">Volatility</span>
          <div className="meter">
            <div className={`fill ${volatilityClass}`}></div>
          </div>
          <span className="value">{volatility}</span>
        </div>
        <div className="risk-meter">
          <span className="label">Liquidity</span>
          <div className="meter">
            <div className={`fill ${liquidityClass}`}></div>
          </div>
          <span className="value">{liquidity}</span>
        </div>
        <div className="risk-meter">
          <span className="label">Market Correlation</span>
          <div className="correlation">
            {correlation != null ? correlation.toFixed(2) : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskAssessment

