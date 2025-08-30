export type YearlyData = {
  year?: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  [key: string]: number | string | undefined;
};

export type CountryData = {
  country: string;
  iso_code?: string;
  data: YearlyData[];
};

export type CO2Data = {
  [iso: string]: CountryData;
};

export type SortField = 'name' | 'population';
export type SortOrder = 'asc' | 'desc';

export interface CountryTableProps {
  yearly: YearlyData[];
  extraColumns: string[];
  selectedYear?: number | null;
  isHighlighted?: boolean;
}

export interface YearSelectorProps {
  availableYears: number[];
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface SortSelectorProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export interface PopulationInfoProps {
  data: YearlyData[];
  selectedYear: number | null;
  isHighlighted: boolean;
}

export interface CountryItemProps {
  iso: string;
  country: CountryData;
  extraColumns: string[];
  selectedYear: number | null;
  isExpanded: boolean;
  isHighlighted: boolean;
  onToggleExpansion: (iso: string) => void;
}
