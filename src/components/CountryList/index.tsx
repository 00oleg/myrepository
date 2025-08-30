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

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type SortField = 'name' | 'population';
type SortOrder = 'asc' | 'desc';

interface SortSelectorProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="country-search">Search Countries:</label>
      <input
        id="country-search"
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Enter country name..."
        className="search-input"
      />
    </div>
  );
}

function SortSelector({
  sortField,
  sortOrder,
  onSortChange,
}: SortSelectorProps) {
  const handleFieldChange = (field: SortField) => {
    onSortChange(field, sortOrder);
  };

  const handleOrderChange = (order: SortOrder) => {
    onSortChange(sortField, order);
  };

  return (
    <div className="sort-selector">
      <label>Sort by:</label>
      <div className="sort-controls">
        <select
          value={sortField}
          onChange={(e) => handleFieldChange(e.target.value as SortField)}
          className="sort-field-select"
        >
          <option value="name">Country Name</option>
          <option value="population">Population</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => handleOrderChange(e.target.value as SortOrder)}
          className="sort-order-select"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
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
    <div className="country-table-wrapper">
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
    </div>
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const data = useCO2Data() as CO2Data;
  const countries = useMemo(() => Object.entries(data), [data]);
  const availableFields = useMemo(() => getAllYearlyFields(data), [data]);
  const availableYears = useMemo(() => getAllAvailableYears(data), [data]);

  const filteredAndSortedCountries = useMemo(() => {
    let filtered = countries;
    if (searchQuery.trim()) {
      filtered = countries.filter(([iso, country]) => {
        const countryName = country.country?.toLowerCase() || iso.toLowerCase();
        const isoCode = iso.toLowerCase();
        const query = searchQuery.toLowerCase().trim();
        return countryName.includes(query) || isoCode.includes(query);
      });
    }

    return filtered.sort(([isoA, countryA], [isoB, countryB]) => {
      let valueA: string | number;
      let valueB: string | number;

      if (sortField === 'name') {
        valueA = countryA.country || isoA;
        valueB = countryB.country || isoB;
      } else {
        if (selectedYear) {
          valueA = getPopulationForYear(countryA.data, selectedYear);
          valueB = getPopulationForYear(countryB.data, selectedYear);
        } else {
          valueA = getLatestPopulation(countryA.data);
          valueB = getLatestPopulation(countryB.data);
        }

        valueA = typeof valueA === 'number' ? valueA : 0;
        valueB = typeof valueB === 'number' ? valueB : 0;
      }

      let comparison = 0;
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else {
        comparison = (valueA as number) - (valueB as number);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [countries, searchQuery, sortField, sortOrder, selectedYear]);

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

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
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <SortSelector
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      <YearSelector
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />

      <button onClick={() => setModalOpen(true)} className="select-columns-btn">
        Select Columns
      </button>

      {searchQuery.trim() && (
        <div className="search-results-info">
          Found {filteredAndSortedCountries.length} countries matching &quot;
          {searchQuery}&quot;
        </div>
      )}

      {filteredAndSortedCountries.length === 0 && searchQuery.trim() ? (
        <div className="no-results">
          No countries found matching &quot;{searchQuery}&quot;. Try a different
          search term.
        </div>
      ) : (
        filteredAndSortedCountries.map(([iso, country]) => (
          <div key={iso} className="country-container">
            <div className="country-header">
              <h2>{country.country || iso}</h2>
              <button
                onClick={() => toggleCountryExpansion(iso)}
                className="country-expand-btn"
              >
                {expandedCountries.has(iso) ? '- Collapse' : '+ Expand'}
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
        ))
      )}

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
