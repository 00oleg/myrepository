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

function getLatestPopulation(data: YearlyData[] | undefined): number | string {
  if (!Array.isArray(data)) return 'N/A';
  for (let i = data.length - 1; i >= 0; i--) {
    const pop = data[i].population;
    if (typeof pop === 'number') return pop;
    if (typeof pop === 'string') return pop;
  }
  return 'N/A';
}

const baseColumns = [
  { key: 'year', label: 'Year' },
  { key: 'population', label: 'Population' },
  { key: 'co2', label: 'CO2' },
  { key: 'co2_per_capita', label: 'CO2 per Capita' },
];

function CountryTable({ yearly, extraColumns }: CountryTableProps) {
  const allColumns = [
    ...baseColumns,
    ...extraColumns.map((key: string) => ({ key, label: key })),
  ];
  return (
    <table
      style={{
        width: '100%',
        marginBottom: '2rem',
        borderCollapse: 'collapse',
      }}
    >
      <thead>
        <tr>
          {allColumns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {yearly.map((row, idx) => (
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

  const data = useCO2Data() as CO2Data;
  const countries = useMemo(() => Object.entries(data), [data]);
  const availableFields = useMemo(() => getAllYearlyFields(data), [data]);

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
      <button onClick={() => setModalOpen(true)} style={{ marginBottom: 16 }}>
        Select Columns
      </button>

      {countries.map(([iso, country]) => (
        <div
          key={iso}
          style={{
            border: '1px solid #eee',
            marginBottom: '2rem',
            padding: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2>{country.country || iso}</h2>
            <button
              onClick={() => toggleCountryExpansion(iso)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007ACC',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {expandedCountries.has(iso) ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <div>Population (latest): {getLatestPopulation(country.data)}</div>
          <div>ISO code: {country.iso_code ?? 'N/A'}</div>

          {expandedCountries.has(iso) && (
            <CountryTable
              yearly={country.data ?? []}
              extraColumns={extraColumns}
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
