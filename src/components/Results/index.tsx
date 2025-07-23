import { useState } from 'react';
import Loading from '../Loading';
import Card from '../Card';

interface SearchResultItem {
  name: string;
  earthAnimal: string;
  uid: string;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  loading: boolean;
  error: string;
  pageNumber: number;
}

const SearchResults = ({
  loading,
  results,
  error,
  pageNumber,
}: SearchResultsProps) => {
  const [hasError, setHasError] = useState(false);

  const handleHasError = () => {
    setHasError(true);
  };

  if (hasError) {
    throw new Error('Error in event handler');
  }

  if (error) {
    return (
      <div className="search-result">
        <div className="no-results no-results--error">
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading loading={true} />;
  }

  return (
    <div className="search-result">
      <h2>
        Search Star Trek Animals
        <button className="btn-error" onClick={handleHasError}>
          Get Error
        </button>
      </h2>
      {results.length ? (
        <div>
          {results.map((result, index) => (
            <Card
              key={index}
              uid={result?.uid}
              name={result?.name}
              earthAnimal={result?.earthAnimal}
              pageNumber={pageNumber}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">No results</div>
      )}
    </div>
  );
};

export default SearchResults;
