import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SearchResult } from '../pages/Search';

interface SearchResults {
  animals: SearchResult[];
  page: {
    totalPages: number;
  };
}

async function fetchItems(
  searchText: string,
  pageNumber: number,
  perPage: number
): Promise<SearchResults> {
  const response = await fetch(
    `https://stapi.co/api/v1/rest/animal/search?name=${searchText}&pageNumber=${pageNumber - 1}&pageSize=${perPage}`,
    {
      method: 'POST',
    }
  );

  if (!response.ok) {
    const errorBody = await response.json();
    let errorMessage = errorBody.message || errorBody.statusText;

    if (response.status >= 500) {
      errorMessage = 'Server Error';
    } else if (response.status >= 400) {
      errorMessage = 'Not Found';
    } else if (!errorMessage) {
      errorMessage = 'Response was not ok';
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export function useItemsQuery(
  searchText: string,
  page: number,
  perPage: number
) {
  return useQuery({
    queryKey: ['items', searchText, page, perPage],
    queryFn: () => fetchItems(searchText, page, perPage),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRefreshItems(
  searchText: string,
  page: number,
  perPage: number
) {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: ['items', searchText, page, perPage],
    });
}
