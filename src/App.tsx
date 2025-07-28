import DetailPage from './pages/Detail';
import './App.css';
import SearchPage from './pages/Search';
import { Routes, Route } from 'react-router';
import AboutPage from './pages/About';
import Navbar from './components/Navbar';
import Page404 from './pages/404';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={'/'} element={<SearchPage />}>
          <Route path={'details'} element={<DetailPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path={'*'} element={<Page404 />} />
      </Routes>
    </>
  );
};

export default App;
