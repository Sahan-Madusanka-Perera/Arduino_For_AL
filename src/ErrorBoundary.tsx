import { Component, type ErrorInfo, type ReactNode } from 'react'

/* A student who hits a bug should get a way forward, not a white screen and a
   stack trace. The raw error is kept in the console for whoever is fixing it,
   and never shown on the page. */

interface State {
  failed: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('The Bench hit an unexpected error:', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div
        role="alert"
        style={{
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          background: 'var(--plastic, #eceef0)',
          color: 'var(--ink, #16202a)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: 460, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Something went wrong on this screen
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.75, marginBottom: 20 }}>
            Your progress is safe: it is stored separately and has not been touched. Reloading the
            page usually clears this.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 20px',
                borderRadius: 6,
                border: 'none',
                background: 'var(--ink, #16202a)',
                color: 'var(--plastic, #eceef0)',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Reload the page
            </button>
            <a
              href="/"
              style={{
                padding: '12px 20px',
                borderRadius: 6,
                border: '1px solid var(--plastic-edge, #cdd2d7)',
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              Back to the bench
            </a>
          </div>
        </div>
      </div>
    )
  }
}
