import { useState } from 'react';

interface SearchInputProps {
  searchText: string;
  onSearch: (searchText: string) => void;
  refresh: () => void;
}

const SearchTop = ({ searchText, onSearch, refresh }: SearchInputProps) => {
  const [searchInput, setSearchInput] = useState<string>(searchText || '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value.trim());
  };

  const handleSearch = () => {
    onSearch(searchInput);
  };

  return (
    <div className="search-form">
      <input
        data-testid={'search-input'}
        type="text"
        value={searchInput}
        onChange={handleChange}
      />
      <button data-testid={'search-button'} onClick={handleSearch}>
        Search
      </button>
      <button data-testid={'refresh-button'} onClick={refresh}>
        Refresh
      </button>
    </div>
  );
};

export default SearchTop;
