import './App.css';
import SearchPage from './pages/Search';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <ErrorBoundary fallback={<p>ErrorBoundary: Something went wrong.</p>}>
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
