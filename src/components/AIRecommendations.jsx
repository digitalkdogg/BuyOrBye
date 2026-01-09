import './AIRecommendations.css'

function AIRecommendations({ recommendation }) {
  return (
    <div className="ai-recommendations">
      <h3>AI Recommendation</h3>
      <div className={`recommendation ${recommendation.action.toLowerCase()}`}>
        <span className="action">{recommendation.action}</span>
        <span className="confidence">{recommendation.confidence}% confidence</span>
      </div>
      <p className="reasoning">{recommendation.reasoning}</p>
    </div>
  )
}

export default AIRecommendations

