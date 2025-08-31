import type { YearSelectorProps } from '../../types/country';

export function YearSelector({
  availableYears,
  selectedYear,
  onYearChange,
}: YearSelectorProps) {
  if (availableYears.length === 0) {
    return null;
  }

  return (
    <div className="year-selector">
      <label htmlFor="year-select">Select Year:</label>
      <select
        id="year-select"
        value={selectedYear || ''}
        onChange={(e) => {
          const year = parseInt(e.target.value);
          if (!isNaN(year)) {
            onYearChange(year);
          }
        }}
        className="year-select"
      >
        {selectedYear === 0 && <option value="">Select a year...</option>}
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
