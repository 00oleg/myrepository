import './App.css';
import SearchPage from './pages/Search';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary fallback={<p>ErrorBoundary: Something went wrong.</p>}>
      <SearchPage />
    </ErrorBoundary>
  );
};

export default App;
