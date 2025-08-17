import {
  fetchItemsOnServer,
  fetchItemDetail,
  type SearchResults,
  type DetailResult,
} from '../../api/animals';
import SearchClientPage from '../../components/Search/SearchClient';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
    per_page?: string;
    details?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { page, per_page, details, searchTerm } = await searchParams;

  const currentSearchTerm = searchTerm ? String(searchTerm) : '';
  const currentPage = Number(page) || 1;
  const currentPerPage = Number(per_page) || 10;
  const currentDetails = details ? String(details) : '';

  let initialData: SearchResults = { animals: [], page: { totalPages: 0 } };
  let searchError: string | null = null;

  try {
    initialData = await fetchItemsOnServer(
      currentSearchTerm,
      currentPage,
      currentPerPage
    );
  } catch (error) {
    searchError =
      error instanceof Error ? error.message : 'Failed to fetch search results';
  }

  let detailData: DetailResult | null = null;
  let detailError: string | null = null;
  if (details && currentDetails) {
    try {
      detailData = await fetchItemDetail(currentDetails);
      if (!detailData) {
        detailError = 'Animal not found';
      }
    } catch (error) {
      detailError =
        error instanceof Error
          ? error.message
          : 'Failed to load animal details';
    }
  }

  return (
    <SearchClientPage
      page={currentPage}
      initialData={initialData}
      detailData={detailData}
      searchError={searchError}
      detailError={detailError}
      perPage={currentPerPage}
      keywords={currentSearchTerm}
      details={currentDetails}
    />
  );
};

export default SearchPage;
