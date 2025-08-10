import { useEffect, useState } from 'react';
import { useSearchParams, Outlet } from 'react-router';
import SearchTop from '../../components/Search';
import SearchResults from '../../components/Results';
import useSearchQuery from '../../hooks/useSearchQuery';
import PaginationResults from '../../components/Pagination';
import ResultActions from '../../components/ResultActions';
import { useItemsQuery, useRefreshItems } from '../../hooks/useItemsQuery';

export interface SearchResult {
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

  const handleResults = (param: SearchResult[]) => {
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

  const {
    data: itemsData,
    isLoading,
    isError,
    error: queryError,
  } = useItemsQuery(searchText, pageNumber, perPage);

  const refreshItems = useRefreshItems(searchText, pageNumber, perPage);

  const refresh = async () => {
    handleLoading(true);
    await refreshItems();
    handleLoading(false);
  };

  useEffect(() => {
    handleLoading(isLoading);

    if (isError) {
      handleLoading(false);
      handleTotalPages(1);
      handleResults([]);
      handleError(queryError?.message || 'Something went wrong');
      return;
    }

    if (itemsData && itemsData.animals.length) {
      handleResults(itemsData.animals);
      handleTotalPages(itemsData.page.totalPages);
      handleError('');
      handleLoading(false);
    }
  }, [itemsData, isLoading, isError, queryError]);

  useEffect(() => {
    if (!searchParams.get('detail')) {
      handlePageNumber(Number(searchParams.get('page') || 1));
    }
  }, [searchParams]);

  return (
    <div className="search-page">
      <div className="search-page__left">
        <SearchTop
          searchText={searchText}
          onSearch={handleSearchText}
          refresh={refresh}
        />
        <SearchResults
          loading={loading}
          results={results}
          error={error}
          pageNumber={pageNumber}
        />
        {loading || !results.length ? null : (
          <PaginationResults
            pageNumber={pageNumber}
            totalPages={totalPages}
            perPage={perPage}
            handlePerPage={handlePerPage}
          />
        )}

        <ResultActions />
      </div>
      <div className="search-page__right">
        <Outlet />
      </div>
    </div>
  );
};

export default SearchPage;
