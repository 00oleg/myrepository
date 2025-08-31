import type { SearchBarProps } from '../../types/country';

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
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
