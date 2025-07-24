import DetailPage from './pages/Detail';
import './App.css';
import SearchPage from './pages/Search';
import { Routes, Route } from 'react-router';
import AboutPage from './pages/About';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={'/'} element={<SearchPage />}>
          <Route path={'details'} element={<DetailPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path={'*'} element={<div>Page not found 404</div>} />
      </Routes>
    </>
  );
};

export default App;
