import React from 'react';

interface SearchResult {
  name: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <strong>{result.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
