import type { CountryTableProps } from '../../types/country';
import baseColumns from '../../utils/baseColumns';
import formatFieldName from '../../utils/formatFieldName';

export function CountryTable({
  yearly,
  extraColumns,
  selectedYear,
  isHighlighted,
}: CountryTableProps) {
  const allColumns = [
    ...baseColumns,
    ...extraColumns.map((key: string) => ({
      key,
      label: formatFieldName(key),
    })),
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
