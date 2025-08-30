import type { CO2Data } from '../types/country';

function getAllAvailableYears(data: CO2Data): number[] {
  const years = new Set<number>();
  for (const country of Object.values(data)) {
    if (Array.isArray(country.data)) {
      for (const row of country.data) {
        if (typeof row.year === 'number') {
          years.add(row.year);
        }
      }
    }
  }
  return Array.from(years).sort((a, b) => b - a);
}

export default getAllAvailableYears;
