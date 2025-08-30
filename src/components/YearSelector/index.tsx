import type { YearSelectorProps } from '../../types/country';

export function YearSelector({
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
