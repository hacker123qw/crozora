import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.css';
import App from '@/App.jsx';

class StartupErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, componentStack: '' };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React startup render failed:', error, errorInfo);
    this.setState({ componentStack: errorInfo?.componentStack || '' });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#050b18',
          color: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{
            maxWidth: '760px',
            width: '100%',
            background: 'rgba(13,21,38,0.9)',
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <h1 style={{ margin: '0 0 8px', color: '#fecaca', fontSize: '20px' }}>Crozora failed to load</h1>
            <p style={{ margin: '0 0 12px', color: '#94a3b8' }}>
              Open browser DevTools Console for full details. Error:
            </p>
            <pre style={{
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '13px',
              color: '#fecaca',
            }}>
              {String(this.state.error?.stack || this.state.error?.message || this.state.error || 'Unknown startup error')}
            </pre>
            {this.state.componentStack ? (
              <pre style={{
                marginTop: '10px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '12px',
                color: '#94a3b8',
              }}>
                {this.state.componentStack}
              </pre>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root was not found in index.html.');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <StartupErrorBoundary>
    <App />
  </StartupErrorBoundary>
);
