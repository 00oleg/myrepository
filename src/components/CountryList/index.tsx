import { useMemo, useState } from 'react';
import { useCO2Data } from '../../utils/co2Resource';
import ColumnSelectModal from '../../components/Modal/ColumnSelectModal';

type YearlyData = {
  year?: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  [key: string]: number | string | undefined;
};

type CountryData = {
  country: string;
  iso_code?: string;
  data: YearlyData[];
};
type CO2Data = {
  [iso: string]: CountryData;
};
interface CountryTableProps {
  yearly: YearlyData[];
  extraColumns: string[];
  selectedYear?: number | null;
  isHighlighted?: boolean;
}

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

function getLatestPopulation(data: YearlyData[] | undefined): number | string {
  if (!Array.isArray(data)) return 'N/A';
  for (let i = data.length - 1; i >= 0; i--) {
    const pop = data[i].population;
    if (typeof pop === 'number') return pop;
    if (typeof pop === 'string') return pop;
  }
  return 'N/A';
}

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

const baseColumns = [
  { key: 'year', label: 'Year' },
  { key: 'population', label: 'Population' },
  { key: 'co2', label: 'CO2' },
  { key: 'co2_per_capita', label: 'CO2 per Capita' },
];

interface YearSelectorProps {
  availableYears: number[];
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
}

function YearSelector({
  availableYears,
  selectedYear,
  onYearChange,
}: YearSelectorProps) {
  return (
    <div className="year-selector">
      <label htmlFor="year-select">Select Year:</label>
      <select
        id="year-select"
        value={selectedYear || ''}
        onChange={(e) =>
          onYearChange(e.target.value ? parseInt(e.target.value) : null)
        }
        className="year-select"
      >
        <option value="">All Years</option>
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

function CountryTable({
  yearly,
  extraColumns,
  selectedYear,
  isHighlighted,
}: CountryTableProps) {
  const allColumns = [
    ...baseColumns,
    ...extraColumns.map((key: string) => ({ key, label: key })),
  ];

  const displayData = selectedYear
    ? yearly.filter((item) => item.year === selectedYear)
    : yearly;

  return (
    <table className={`country-table ${isHighlighted ? 'highlighted' : ''}`}>
      <thead>
        <tr>
          {allColumns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {displayData.map((row, idx) => (
          <tr key={row.year ?? idx}>
            {allColumns.map((col) => (
              <td key={col.key}>{row[col.key] ?? 'N/A'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const defaultExtraColumns: string[] = [];

function CountryList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [extraColumns, setExtraColumns] =
    useState<string[]>(defaultExtraColumns);
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(
    new Set()
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [highlightedCountries, setHighlightedCountries] = useState<Set<string>>(
    new Set()
  );

  const data = useCO2Data() as CO2Data;
  const countries = useMemo(() => Object.entries(data), [data]);
  const availableFields = useMemo(() => getAllYearlyFields(data), [data]);
  const availableYears = useMemo(() => getAllAvailableYears(data), [data]);

  const handleYearChange = (year: number | null) => {
    setSelectedYear(year);

    const allCountryIsos = new Set(countries.map(([iso]) => iso));
    setHighlightedCountries(allCountryIsos);
    setTimeout(() => {
      setHighlightedCountries(new Set());
    }, 1000);
  };

  const toggleCountryExpansion = (iso: string) => {
    setExpandedCountries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(iso)) {
        newSet.delete(iso);
      } else {
        newSet.add(iso);
      }
      return newSet;
    });
  };

  return (
    <div>
      <YearSelector
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />

      <button onClick={() => setModalOpen(true)} className="select-columns-btn">
        Select Columns
      </button>

      {countries.map(([iso, country]) => (
        <div key={iso} className="country-container">
          <div className="country-header">
            <h2>{country.country || iso}</h2>
            <button
              onClick={() => toggleCountryExpansion(iso)}
              className="country-expand-btn"
            >
              {expandedCountries.has(iso) ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <div
            className={`population-info ${highlightedCountries.has(iso) ? 'highlighted' : ''}`}
          >
            Population {selectedYear ? `(${selectedYear})` : '(latest)'}:{' '}
            {selectedYear
              ? getPopulationForYear(country.data, selectedYear)
              : getLatestPopulation(country.data)}
          </div>
          <div className="iso-code-info">
            ISO code: {country.iso_code ?? 'N/A'}
          </div>

          {expandedCountries.has(iso) && (
            <CountryTable
              yearly={country.data ?? []}
              extraColumns={extraColumns}
              selectedYear={selectedYear}
              isHighlighted={highlightedCountries.has(iso)}
            />
          )}
        </div>
      ))}

      <ColumnSelectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        availableFields={availableFields}
        selectedFields={extraColumns}
        onChange={setExtraColumns}
      />
    </div>
  );
}

export default CountryList;
