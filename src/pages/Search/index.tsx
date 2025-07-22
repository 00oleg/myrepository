import { useEffect, useState } from 'react';
import SearchTop from '../../components/Search';
import SearchResults from '../../components/Results';
import useSearchQuery from '../../hooks/useSearchQuery';

interface SearchResult {
  uid: string;
  name: string;
  earthAnimal: string;
}

const SearchPage = () => {
  const [searchText, setSearchText] = useSearchQuery(
    'searchText',
    localStorage.getItem('searchText') || ''
  );
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearchText = (param: string) => {
    setSearchText(param);
  };

  const handleLoading = (param: boolean) => {
    setLoading(param);
  };

  const handleResults = (param: []) => {
    setResults(param);
  };
  const handleError = (param: string) => {
    setError(param);
  };

  useEffect(() => {
    const handleSearch = (newSearchText: string) => {
      const clearSearchText = newSearchText.trim();
      localStorage.setItem('searchText', clearSearchText);
      handleLoading(true);
      handleError('');

      fetch(
        `https://stapi.co/api/v1/rest/animal/search?name=${clearSearchText}`,
        {
          method: 'POST',
        }
      )
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              let errorMessage = errorData.message;

              if (response.status >= 500) {
                errorMessage = 'Server Error';
              } else if (response.status >= 400) {
                errorMessage = 'Not Found';
              } else if (!errorMessage) {
                errorMessage = 'Response was not ok';
              }
              handleLoading(false);
              handleError(errorMessage);
              throw new Error(errorMessage);
            });
          }
          return response.json();
        })
        .then(({ animals }) => {
          handleResults(animals);
          handleLoading(false);
        })
        .catch((error) => {
          handleLoading(false);
          handleError(error?.message || 'Something went wrong');
        });
    };

    handleSearch(searchText);
  }, [searchText]);

  return (
    <>
      <SearchTop searchText={searchText} onSearch={handleSearchText} />
      <SearchResults loading={loading} results={results} error={error} />
    </>
  );
};

export default SearchPage;
