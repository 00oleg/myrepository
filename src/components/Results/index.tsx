import Loading from '../Loading';
import Card, { type SearchResultItem } from '../Card';

interface SearchResultsProps {
  results: SearchResultItem[];
  loading: boolean;
  error: string | null;
  pageNumber: number;
}

const SearchResults = ({
  loading,
  results,
  error,
  pageNumber,
}: SearchResultsProps) => {
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
      <h2>Search Star Trek Animals</h2>
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
