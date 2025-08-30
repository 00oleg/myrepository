import type { CO2Data } from '../types/country';

function getAllYearlyFields(data: CO2Data): string[] {
  const fields = new Set<string>();
  for (const country of Object.values(data)) {
    if (Array.isArray(country.data)) {
      for (const row of country.data) {
        Object.keys(row).forEach((k) => fields.add(k));
      }
    }
  }
  ['year', 'population', 'co2', 'co2_per_capita'].forEach((k) =>
    fields.delete(k)
  );
  return Array.from(fields).sort();
}

export default getAllYearlyFields;
