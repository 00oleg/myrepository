'use client';

import { usePathname, useRouter } from 'next/navigation';
import useSearchQuery from '../../hooks/useSearchQuery';
import Search from '.';
import { DetailResult, SearchResults } from '../../api/animals';

interface SearchPageClientProps {
  initialData: SearchResults;
  detailData: DetailResult | null;
  searchError: string | null;
  detailError: string | null;
  details: string;
  keywords: string;
  page: number;
  perPage: number;
}

const SearchClientPage = ({
  page,
  initialData,
  detailData,
  searchError,
  detailError,
  perPage,
  keywords,
  details,
}: SearchPageClientProps) => {
  const currentSearchTerm = keywords ? String(keywords) : '';
  const { replace } = useRouter();
  const pathname = usePathname();
  const [searchText, setSearchText] = useSearchQuery(
    'searchText',
    currentSearchTerm
  );

  const handleSearchText = (param: string) => {
    setSearchText(param);
    replace(`${pathname}/?searchTerm=${param}&page=1&per_page=${perPage}`);
  };

  const queryParams = JSON.parse(
    JSON.stringify({
      page: page,
      perPage: perPage,
      keywords: keywords,
      details: details,
    })
  );

  return (
    <>
      <Search
        searchText={searchText}
        handleSearchText={handleSearchText}
        loading={false}
        results={JSON.parse(JSON.stringify(initialData.animals))}
        totalPages={initialData.page.totalPages}
        error={searchError}
        detailData={detailData ? JSON.parse(JSON.stringify(detailData)) : null}
        detailError={detailError}
        queryParams={queryParams}
      />
    </>
  );
};

export default SearchClientPage;
