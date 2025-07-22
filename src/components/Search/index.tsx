import { useState } from 'react';

interface SearchInputProps {
  searchText: string;
  onSearch: (searchText: string) => void;
}

const SearchTop = ({ searchText, onSearch }: SearchInputProps) => {
  const [searchInput, setSearchInput] = useState<string>(
    searchText || localStorage.getItem('searchText') || ''
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value.trim());
  };

  const handleSearch = () => {
    localStorage.setItem('searchText', searchInput);
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
    </div>
  );
};

export default SearchTop;
