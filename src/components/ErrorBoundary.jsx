import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: 'rgba(255,235,205,0.8)', borderRadius: 6 }}>
          <strong>Something went wrong.</strong>
          <div style={{ marginTop: 8 }}>{String(this.state.error)}</div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
