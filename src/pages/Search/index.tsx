import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import useSearchQuery from "../../hooks/useSearchQuery";
import Search from "../../components/Search";

export interface SearchResult {
  uid: string;
  name: string;
  earthAnimal: string;
}

interface SearchResults {
  animals: SearchResult[];
  page: {
    totalPages: number;
  };
}

async function fetchItemsOnServer(
  searchText: string,
  pageNumber: number,
  perPage: number
): Promise<SearchResults> {
  try {
    const response = await fetch(`https://stapi.co/api/v1/rest/animal/search?name=${encodeURIComponent(searchText)}&pageNumber=${pageNumber - 1}&pageSize=${perPage}`, {
      method: 'POST',
    });

    if (!response.ok) {
      return {
        animals: [],
        page: { totalPages: 0 }
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server fetch error:', error);
    return {
      animals: [],
      page: { totalPages: 0 }
    };
  }
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { page, per_page, details, searchTerm } = query;

  const currentSearchTerm = searchTerm ? String(searchTerm) : '';
  const currentPage = Number(page) || 1;
  const currentPerPage = Number(per_page) || 10;

  const initialData: SearchResults = await fetchItemsOnServer(
    currentSearchTerm,
    currentPage,
    currentPerPage
  );

  return {
    props: {
      searchTerm: currentSearchTerm,
      perPage: currentPerPage,
      page: currentPage,
      initialData,
    },
  };
};

export default function Page({
  page,
  perPage,
  searchTerm,
  initialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const currentSearchTerm = searchTerm ? String(searchTerm) : '';
  const router = useRouter();
  const [searchText, setSearchText] = useSearchQuery(
    'searchText',
    currentSearchTerm,
  );

  const handleSearchText = (param: string) => {
    console.log('handleSearchText called with:', param);
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

  const refresh = async () => {
    router.push({
      pathname: '/search',
      query: {
        searchTerm: searchText,
        page: page,
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
        error={null}
        refresh={refresh}
      />
    </>
  );
}
