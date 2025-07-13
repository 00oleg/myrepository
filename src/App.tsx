import './App.css';
import SearchPage from './pages/Search';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<p>ErrorBoundary: Something went wrong.</p>}>
      <SearchPage params={{}} />
    </ErrorBoundary>
  );
}

export default App;
