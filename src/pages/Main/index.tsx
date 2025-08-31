import { Suspense } from 'react';
import CountryList from '../../components/CountryList';
import Loading from '../../components/Loading';

const MainPage = () => {
  return (
    <div className="main-page">
      <h1 className="main-title">CO2 Emissions by Country</h1>
      <Suspense fallback={<Loading loading={true} />}>
        <CountryList />
      </Suspense>
    </div>
  );
};

export default MainPage;
