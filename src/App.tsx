import DetailPage from './pages/Detail';
import SearchPage from './pages/Search';
import { Routes, Route } from 'react-router';
import AboutPage from './pages/About';
import Navbar from './components/Navbar';
import Page404 from './pages/404';
import { useTheme } from './ThemeContext';

const App = () => {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Navbar />

      <main>
        <Routes>
          <Route path={'/'} element={<SearchPage />}>
            <Route path={'details'} element={<DetailPage />} />
          </Route>
          <Route path="/about" element={<AboutPage />} />
          <Route path={'*'} element={<Page404 />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
