import React from 'react';

interface SearchResult {
  name: string;
  earthAnimal: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="search-result">
      <h2>Search Star Trek Animals</h2>
      {results.length ? (
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              <strong>{result.name}</strong> -
              <span>Earth Animal: {result.earthAnimal ? 'Yes' : 'No'}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-results">No results</div>
      )}
    </div>
  );
};

export default SearchResults;
