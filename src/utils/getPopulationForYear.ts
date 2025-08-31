import type { YearlyData } from '../types/country';

function getPopulationForYear(
  data: YearlyData[] | undefined,
  year: number | null
): number | string {
  if (!Array.isArray(data) || year === null) return 'N/A';
  const yearData = data.find((item) => item.year === year);
  if (yearData && typeof yearData.population === 'number') {
    return yearData.population;
  }
  if (yearData && typeof yearData.population === 'string') {
    return yearData.population;
  }
  return 'N/A';
}

export default getPopulationForYear;
