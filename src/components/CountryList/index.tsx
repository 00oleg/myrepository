import { useMemo, useState } from 'react';
import { useCO2Data } from '../../utils/co2Resource';
import ColumnSelectModal from '../../components/Modal/ColumnSelectModal';
import type { CO2Data, SortField, SortOrder } from '../../types/country';
import getAllYearlyFields from '../../utils/getAllYearlyFields';
import getAllAvailableYears from '../../utils/getAllAvailableYears';
import getPopulationForYear from '../../utils/getPopulationForYear';
import getLatestPopulation from '../../utils/getLatestPopulation';
import { SearchBar } from '../SearchBar';
import { SortSelector } from '../SortSelector';
import { YearSelector } from '../YearSelector';
import { CountryItem } from '../CountryItem';

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
      <div className="header-actions">
        <div className="header-actions__col">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <button
            onClick={() => setModalOpen(true)}
            className="select-columns-btn"
          >
            Select Columns
          </button>
        </div>
        <div className="header-actions__col">
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
        </div>
      </div>

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
          <CountryItem
            key={iso}
            iso={iso}
            country={country}
            extraColumns={extraColumns}
            selectedYear={selectedYear}
            isExpanded={expandedCountries.has(iso)}
            isHighlighted={highlightedCountries.has(iso)}
            onToggleExpansion={toggleCountryExpansion}
          />
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
