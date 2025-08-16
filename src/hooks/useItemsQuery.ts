import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SearchResult } from '../pages/search';

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
  const response = await fetch(`https://stapi.co/api/v1/rest/animal/search?name=${encodeURIComponent(searchText)}&pageNumber=${pageNumber - 1}&pageSize=${perPage}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
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
  
  const data = await response.json();
  return data;
}

export function useItemsQuery(
  searchText: string,
  page: number,
  perPage: number,
  options?: { initialData?: SearchResults }
) {
  return useQuery({
    queryKey: ['items', searchText, page, perPage],
    queryFn: () => {
      console.log('queryFn executing for:', { searchText, page, perPage });
      return fetchItems(searchText, page, perPage);
    },
    staleTime: 5 * 60 * 1000,
    enabled: true,
    ...options
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
