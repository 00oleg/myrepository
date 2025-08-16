import SearchTop from '../../components/SearchTop';
import SearchResults from '../../components/Results';
import PaginationResults from '../../components/Pagination';
import ResultActions from '../../components/ResultActions';
import { useSearchParams } from 'next/navigation';
import Details from '../Details';
import { SearchResultItem } from '../Card';
import type { DetailResult } from '../../api/animals';

interface SearchProps {
  searchText: string;
  handleSearchText: (text: string) => void;
  loading: boolean;
  results: SearchResultItem[];
  pageNumber: number;
  totalPages: number;
  perPage: number;
  error: string | null;
  detailData?: DetailResult | null;
  detailError?: string | null;
}

const Search = ({
  searchText = '',
  handleSearchText,
  loading,
  results,
  pageNumber,
  totalPages,
  perPage,
  error,
  detailData,
  detailError,
}: SearchProps) => {
  const searchParams = useSearchParams();
  const currentDetails = searchParams?.get('details');
  return (
    <div className="search-page">
      <div className="search-page__left">
        <SearchTop searchText={searchText} onSearch={handleSearchText} />
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
        {currentDetails ? (
          <Details detailData={detailData || null} error={detailError} />
        ) : null}
      </div>
    </div>
  );
};

export default Search;
