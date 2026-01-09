import './RiskAssessment.css'

function RiskAssessment({ risk }) {
  return (
    <div className="risk-assessment">
      <h3>Risk Assessment</h3>
      <div className="risk-meters">
        <div className="risk-meter">
          <span className="label">Volatility</span>
          <div className="meter">
            <div className={`fill ${risk.volatility.toLowerCase()}`}></div>
          </div>
          <span className="value">{risk.volatility}</span>
        </div>
        <div className="risk-meter">
          <span className="label">Liquidity</span>
          <div className="meter">
            <div className={`fill ${risk.liquidity.toLowerCase()}`}></div>
          </div>
          <span className="value">{risk.liquidity}</span>
        </div>
        <div className="risk-meter">
          <span className="label">Market Correlation</span>
          <div className="correlation">
            {risk.correlation.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskAssessment

