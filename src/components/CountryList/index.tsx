import { useMemo, useState, useCallback, useEffect } from 'react';
import { useCO2Data } from '../../utils/co2Resource';
import ColumnSelectModal from '../../components/Modal/ColumnSelectModal';
import type {
  CO2Data,
  SortField,
  SortOrder,
  YearlyData,
} from '../../types/country';
import getAllYearlyFields from '../../utils/getAllYearlyFields';
import getAllAvailableYears from '../../utils/getAllAvailableYears';
import { SearchBar } from '../SearchBar';
import { SortSelector } from '../SortSelector';
import { YearSelector } from '../YearSelector';
import { CountryTable } from '../CountryTable';

const defaultExtraColumns: string[] = [];

function CountryList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [extraColumns, setExtraColumns] =
    useState<string[]>(defaultExtraColumns);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const data = useCO2Data() as CO2Data;
  const countries = useMemo(() => Object.entries(data), [data]);
  const availableFields = useMemo(() => getAllYearlyFields(data), [data]);
  const availableYears = useMemo(() => getAllAvailableYears(data), [data]);

  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [isDataHighlighted, setIsDataHighlighted] = useState<boolean>(false);

  useEffect(() => {
    if (availableYears.length > 0 && selectedYear === 0) {
      const latestYear = Math.max(...availableYears);
      setSelectedYear(latestYear);
    }
  }, [availableYears, selectedYear]);

  const tableData = useMemo(() => {
    if (selectedYear === 0) return [];

    const flatData: (YearlyData & { name: string; iso_code?: string })[] = [];

    countries.forEach(([iso, countryData]) => {
      const yearData = countryData.data.find((d) => d.year === selectedYear);

      if (yearData) {
        flatData.push({
          ...yearData,
          name: countryData.country || iso,
          iso_code: countryData?.iso_code,
        });
      }
    });

    return flatData;
  }, [countries, selectedYear]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = tableData;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = tableData.filter((row) => {
        const countryName = row.name?.toLowerCase() || '';
        return countryName.includes(query);
      });
    }

    return filtered.sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      if (sortField === 'name') {
        valueA = a.name || '';
        valueB = b.name || '';
      } else {
        valueA = typeof a.population === 'number' ? a.population : 0;
        valueB = typeof b.population === 'number' ? b.population : 0;
      }

      let comparison = 0;
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else {
        comparison = (valueA as number) - (valueB as number);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tableData, searchQuery, sortField, sortOrder]);

  const handleSortChange = useCallback((field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    setIsDataHighlighted(true);

    setTimeout(() => {
      setIsDataHighlighted(false);
    }, 1500);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleColumnsChange = useCallback((fields: string[]) => {
    setExtraColumns(fields);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  return (
    <>
      <div className="header-actions">
        <div className="header-actions__col">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />

          <button onClick={handleModalOpen} className="select-columns-btn">
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

      {selectedYear === 0 ? (
        <div className="loading">Loading data...</div>
      ) : filteredAndSortedData.length === 0 && searchQuery.trim() ? (
        <div className="no-results">
          No countries found matching &quot;{searchQuery}&quot;. Try a different
          search term.
        </div>
      ) : (
        <CountryTable
          yearly={filteredAndSortedData}
          extraColumns={extraColumns}
          selectedYear={selectedYear}
          isHighlighted={isDataHighlighted}
        />
      )}

      <ColumnSelectModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        availableFields={availableFields}
        selectedFields={extraColumns}
        onChange={handleColumnsChange}
      />
    </>
  );
}

export default CountryList;
