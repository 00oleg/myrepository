import { useMemo } from 'react';
import type { CountryTableProps } from '../../types/country';
import baseColumns from '../../utils/baseColumns';
import formatFieldName from '../../utils/formatFieldName';

export function CountryTable({
  yearly,
  extraColumns,
  selectedYear,
  isHighlighted,
}: CountryTableProps) {
  const allColumns = useMemo(
    () => [
      ...baseColumns,
      ...extraColumns.map((key: string) => ({
        key,
        label: formatFieldName(key),
      })),
    ],
    [extraColumns]
  );

  const displayData = useMemo(() => {
    const hasCountryInfo = yearly.some((item) => 'name' in item);
    if (hasCountryInfo) {
      return yearly;
    }
    return yearly.filter((item) => item.year === selectedYear);
  }, [yearly, selectedYear]);

  return (
    <div className="country-table-wrapper">
      <table className="country-table">
        <thead>
          <tr>
            {allColumns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, idx) => (
            <tr key={row.name ?? idx}>
              {allColumns.map((col) => {
                const shouldHighlight =
                  isHighlighted && col.key !== 'name' && col.key !== 'iso_code';
                return (
                  <td
                    key={col.key}
                    className={shouldHighlight ? 'cell-highlighted' : ''}
                  >
                    {row[col.key] ?? 'N/A'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
