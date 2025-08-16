import SearchTop from '../../components/SearchTop';
import SearchResults from '../../components/Results';
import PaginationResults from '../../components/Pagination';
import ResultActions from '../../components/ResultActions';
import { useSearchParams } from 'next/navigation';
import DetailPage from '../../components/Details';
import { SearchResultItem } from '../Card';

export interface SearchResult {
  uid: string;
  name: string;
  earthAnimal: string;
}

interface SearchProps {
  searchText: string;
  handleSearchText: (text: string) => void;
  loading: boolean;
  results: SearchResultItem[];
  pageNumber: number;
  totalPages: number;
  perPage: number;
  refresh: () => void;
  error: string | null;
}

const Search = ({
  searchText = '',
  handleSearchText,
  loading,
  results,
  pageNumber,
  totalPages,
  perPage,
  refresh,
  error,
}: SearchProps) => {
  const searchParams = useSearchParams();
  const currentDetails = searchParams?.get('details');
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
            searchText={searchText}
          />
        )}

        <ResultActions />
      </div>
      <div className="search-page__right">
        {currentDetails ? <DetailPage /> : null}
      </div>
    </div>
  );
};

export default Search;
