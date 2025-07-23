import DetailPage from './pages/Detail';
import './App.css';
import SearchPage from './pages/Search';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      <Route path={'/'} element={<SearchPage />}>
        <Route path={'details'} element={<DetailPage />} />
      </Route>
      <Route path={'*'} element={<div>Page not found 404</div>} />
    </Routes>
  );
};

export default App;
