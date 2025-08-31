import { Routes, Route } from 'react-router';
import Page404 from './pages/404';
import MainPage from './pages/Main';

const App = () => {
  return (
    <div className={`app`}>
      <main>
        <Routes>
          <Route path={'/'} element={<MainPage />} />
          <Route path={'*'} element={<Page404 />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
