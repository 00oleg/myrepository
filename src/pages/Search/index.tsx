import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
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
  const currentDetails = String(details) || '';

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
      searchTerm: currentSearchTerm,
      perPage: currentPerPage,
      page: currentPage,
      initialData,
      detailData,
      detailUid: currentDetails || null,
      searchError,
      detailError,
    },
  };
};

export default function Page({
  page,
  perPage,
  searchTerm,
  initialData,
  detailData,
  searchError,
  detailError,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const currentSearchTerm = searchTerm ? String(searchTerm) : '';
  const router = useRouter();
  const [searchText, setSearchText] = useSearchQuery(
    'searchText',
    currentSearchTerm
  );

  const handleSearchText = (param: string) => {
    setSearchText(param);
    router.push({
      pathname: '/search',
      query: {
        searchTerm: param.toString(),
        page: 1,
        per_page: perPage.toString(),
      },
    });
  };

  return (
    <>
      <Search
        searchText={searchText}
        handleSearchText={handleSearchText}
        loading={false}
        results={initialData?.animals || []}
        pageNumber={page || 1}
        totalPages={initialData?.page.totalPages || 0}
        perPage={perPage}
        error={searchError}
        detailData={detailData}
        detailError={detailError}
      />
    </>
  );
}
