import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ui/ErrorBoundary.tsx';

// Catch unhandled promise rejections & window errors from injected browser extensions (e.g. MetaMask in sandboxed iframe)
window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = String(event.reason?.message || event.reason || '').toLowerCase();
  if (
    reasonStr.includes('metamask') ||
    reasonStr.includes('ethereum') ||
    reasonStr.includes('user rejected') ||
    reasonStr.includes('provider') ||
    reasonStr.includes('wallet') ||
    reasonStr.includes('connect')
  ) {
    event.preventDefault();
    console.warn('Suppressed extension rejection:', event.reason);
  }
});

window.addEventListener('error', (event) => {
  const errStr = String(event.message || '').toLowerCase();
  if (
    errStr.includes('metamask') ||
    errStr.includes('ethereum') ||
    errStr.includes('wallet')
  ) {
    event.preventDefault();
    console.warn('Suppressed extension error event:', event.message);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

