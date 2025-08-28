import { Suspense } from 'react';
import CountryList from '../../components/CountryList';

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</div>
  );
}
const MainPage = () => {
  return (
    <div className="main-page">
      <h1 className="main-title">CO2 Emissions by Country</h1>
      <Suspense fallback={<Spinner />}>
        <CountryList />
      </Suspense>
    </div>
  );
};

export default MainPage;
