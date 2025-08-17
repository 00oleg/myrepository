import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SearchInputProps {
  searchText: string;
  onSearch: (text: string) => void;
}

const SearchTop = ({ searchText, onSearch }: SearchInputProps) => {
  const t = useTranslations('search');
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
        placeholder={t('placeholder')}
      />
      <button data-testid={'search-button'} onClick={handleSearch}>
        {t('searchButton')}
      </button>
    </div>
  );
};

export default SearchTop;
