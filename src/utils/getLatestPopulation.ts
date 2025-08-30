import type { YearlyData } from '../types/country';

function getLatestPopulation(data: YearlyData[] | undefined): number | string {
  if (!Array.isArray(data)) return 'N/A';
  for (let i = data.length - 1; i >= 0; i--) {
    const pop = data[i].population;
    if (typeof pop === 'number') return pop;
    if (typeof pop === 'string') return pop;
  }
  return 'N/A';
}

export default getLatestPopulation;
