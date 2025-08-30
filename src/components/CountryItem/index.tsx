import { PopulationInfo } from '../PopulationInfo';
import type { CountryItemProps } from '../../types/country';
import { CountryTable } from '../CountryTable';

export function CountryItem({
  iso,
  country,
  extraColumns,
  selectedYear,
  isExpanded,
  isHighlighted,
  onToggleExpansion,
}: CountryItemProps) {
  return (
    <div key={iso} className="country-container">
      <div className="country-header">
        <div className="country-header__info">
          <h2>{country.country || iso}</h2>
          <PopulationInfo
            data={country.data ?? []}
            selectedYear={selectedYear}
            isHighlighted={isHighlighted}
          />
          <div className="iso-code-info">
            <strong>ISO code:</strong> {country.iso_code ?? 'N/A'}
          </div>
        </div>

        <button
          onClick={() => onToggleExpansion(iso)}
          className="country-expand-btn"
        >
          {isExpanded ? '- Collapse' : '+ Expand'}
        </button>
      </div>

      {isExpanded && (
        <CountryTable
          yearly={country.data ?? []}
          extraColumns={extraColumns}
          selectedYear={selectedYear}
          isHighlighted={isHighlighted}
        />
      )}
    </div>
  );
}
