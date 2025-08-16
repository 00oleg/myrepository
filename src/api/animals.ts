export interface SearchResult {
  uid: string;
  name: string;
  earthAnimal: string;
}

export interface SearchResults {
  animals: SearchResult[];
  page: {
    totalPages: number;
  };
}

export interface DetailResult {
  uid: string;
  name: string;
  earthAnimal: boolean;
  earthInsect: boolean;
  avian: boolean;
  canine: boolean;
  feline: boolean;
}

export async function fetchItemsOnServer(
  searchText: string,
  pageNumber: number,
  perPage: number
): Promise<SearchResults> {
  const response = await fetch(
    `https://stapi.co/api/v1/rest/animal/search?name=${encodeURIComponent(searchText)}&pageNumber=${pageNumber - 1}&pageSize=${perPage}`,
    {
      method: 'POST',
    }
  );

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

export async function fetchItemDetail(
  uid: string
): Promise<DetailResult | null> {
  const response = await fetch(
    `https://stapi.co/api/v1/rest/animal?uid=${uid}`
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    let errorMessage = errorBody.message || errorBody.statusText;

    if (response.status >= 500) {
      errorMessage = 'Server Error';
    } else if (response.status >= 400) {
      errorMessage = 'Animal not found';
    } else if (!errorMessage) {
      errorMessage = 'Response was not ok';
    }
    throw new Error(errorMessage);
  }

  const { animal } = await response.json();
  return animal || null;
}
