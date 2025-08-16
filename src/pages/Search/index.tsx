import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import useSearchQuery from '../../hooks/useSearchQuery';
import Search from '../../components/Search';
import {
  fetchItemsOnServer,
  fetchItemDetail,
  type SearchResults,
  type DetailResult,
} from '../../api/animals';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { page, per_page, details, searchTerm } = query;

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

  return {
    props: {
      page: currentPage,
      initialData,
      detailData,
      searchError,
      detailError,
      perPage: currentPerPage,
      keywords: currentSearchTerm,
      details: currentDetails,
    },
  };
};

export default function Page({
  page,
  initialData,
  detailData,
  searchError,
  detailError,
  perPage,
  keywords,
  details,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

  return (
    <>
      <Search
        searchText={searchText}
        handleSearchText={handleSearchText}
        loading={false}
        results={initialData?.animals || []}
        totalPages={initialData?.page.totalPages || 0}
        error={searchError}
        detailData={detailData}
        detailError={detailError}
        queryParams={{
          page: page,
          perPage: perPage,
          keywords: keywords,
          details: details,
        }}
      />
    </>
  );
}
