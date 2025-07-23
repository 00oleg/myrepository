import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchTop from '../../components/Search';
import SearchResults from '../../components/Results';
import useSearchQuery from '../../hooks/useSearchQuery';
import PaginationResults from '../../components/Pagination';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(
    Number(searchParams.get('page') || 1)
  );
  const [totalPages, setTotalPages] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);

  const handleSearchParams = (param: URLSearchParams) => {
    setSearchParams(param);
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

  const handlePageNumber = (param: number) => {
    setPageNumber(param);
    const updatedSearchParams = new URLSearchParams();
    updatedSearchParams.set('page', param.toString());
    handleSearchParams(updatedSearchParams);
  };

  const handleSearchText = (param: string) => {
    handlePageNumber(1);
    setSearchText(param);
  };

  const handleTotalPages = (param: number) => {
    setTotalPages(param);
  };

  const handlePerPage = (param: number) => {
    setPerPage(param);
    handlePageNumber(1);
  };

  const handleSearch = () => {
    handleLoading(true);
    handleError('');

    fetch(
      `https://stapi.co/api/v1/rest/animal/search?name=${searchText}&pageNumber=${pageNumber - 1}&pageSize=${perPage}`,
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
      .then(({ animals, page }) => {
        handleTotalPages(page.totalPages);
        handleResults(animals);
        handleLoading(false);
      })
      .catch((error) => {
        handleLoading(false);
        handleError(error?.message || 'Something went wrong');
      });
  };

  useEffect(() => {
    handleSearch();
  }, [searchText, perPage, pageNumber]);

  useEffect(() => {
    handlePageNumber(Number(searchParams.get('page') || 1));
  }, [searchParams]);

  return (
    <div className="container-center">
      <SearchTop searchText={searchText} onSearch={handleSearchText} />
      <SearchResults loading={loading} results={results} error={error} />
      {loading || !results.length ? null : (
        <PaginationResults
          pageNumber={pageNumber}
          totalPages={totalPages}
          perPage={perPage}
          handlePerPage={handlePerPage}
        />
      )}
    </div>
  );
};

export default SearchPage;
