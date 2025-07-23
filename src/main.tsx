import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/index.tsx';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root not found');
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallback={<p>ErrorBoundary: Something went wrong.</p>}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
