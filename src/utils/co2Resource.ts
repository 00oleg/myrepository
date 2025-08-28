const DATA_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

// Simple resource for Suspense
function createResource<T>(fetcher: () => Promise<T>) {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T | Error;
  const suspender = fetcher().then(
    (r: T) => {
      status = 'success';
      result = r;
    },
    (e: Error) => {
      status = 'error';
      result = e;
    }
  );
  return {
    read(): T {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      return result as T;
    },
  };
}

const co2Resource = createResource(async () => {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Failed to fetch CO2 data');
  return res.json();
});

export function useCO2Data() {
  return co2Resource.read();
}
