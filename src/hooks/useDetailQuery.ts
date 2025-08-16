import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { DetailResult } from '../components/Details';

async function fetchItemDetail(uid: string): Promise<DetailResult> {
  const response = await fetch(
    `https://stapi.co/api/v1/rest/animal?uid=${uid}`
  );

  if (!response.ok) {
    throw new Error('Response was not ok');
  }

  const { animal } = await response.json();

  if (!animal) {
    throw new Error('Animal not found');
  }

  return animal;
}

export function useItemDetailQuery(uid: string) {
  return useQuery({
    queryKey: ['itemDetail', uid],
    queryFn: () => fetchItemDetail(uid),
    staleTime: 10 * 60 * 1000,
  });
}

export function useRefreshItemDetail(uid: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['itemDetail', uid] });
}
