import SearchTop from '../../components/SearchTop';
import SearchResults from '../../components/Results';
import PaginationResults from '../../components/Pagination';
import ResultActions from '../../components/ResultActions';
import Details from '../Details';
import { queryParams, SearchResultItem } from '../Card';
import type { DetailResult } from '../../api/animals';

interface SearchProps {
  searchText: string;
  handleSearchText: (text: string) => void;
  loading: boolean;
  results: SearchResultItem[];
  totalPages: number;
  error: string | null;
  detailData?: DetailResult | null;
  detailError?: string | null;
  queryParams: queryParams;
}

const Search = ({
  handleSearchText,
  loading,
  results,
  totalPages,
  error,
  detailData,
  detailError,
  queryParams,
}: SearchProps) => {
  const { page, perPage, keywords, details } = queryParams;

  return (
    <div className="search-page">
      <div className="search-page__left">
        <SearchTop searchText={keywords} onSearch={handleSearchText} />
        <SearchResults
          loading={loading}
          results={results}
          error={error}
          queryParams={queryParams}
        />
        {loading || !results.length ? null : (
          <PaginationResults
            pageNumber={page}
            totalPages={totalPages}
            perPage={perPage}
            searchText={keywords}
          />
        )}

        <ResultActions />
      </div>
      <div className="search-page__right">
        {details ? (
          <Details
            detailData={detailData || null}
            error={detailError}
            queryParams={queryParams}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Search;
