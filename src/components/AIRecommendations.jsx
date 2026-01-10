import './AIRecommendations.css'

function AIRecommendations({ recommendation = {} }) {
  const action = (recommendation.action && String(recommendation.action)) || 'N/A'
  const confidence = recommendation.confidence != null ? `${Number(recommendation.confidence)}% confidence` : '—'
  const reasoning = recommendation.reasoning || 'No reasoning available.'
  const actionClass = action ? action.toLowerCase() : 'unknown'

  return (
    <div className="ai-recommendations">
      <h3>AI Recommendation</h3>
      <div className={`recommendation ${actionClass}`}>
        <span className="action">{action}</span>
        <span className="confidence">{confidence}</span>
      </div>
      <p className="reasoning">{reasoning}</p>
    </div>
  )
}

export default AIRecommendations

