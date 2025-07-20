import React, { Component } from 'react';

interface SearchInputProps {
  searchText: string;
  onSearch: (searchText: string) => void;
}

interface SearchInputState {
  searchText: string;
}

class SearchTop extends Component<SearchInputProps, SearchInputState> {
  constructor(props: SearchInputProps) {
    super(props);
    this.state = {
      searchText: props.searchText || localStorage.getItem('searchText') || '',
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchText: event.target.value.trim() });
  };

  handleSearch = () => {
    localStorage.setItem('searchText', this.state.searchText);
    this.props.onSearch(this.state.searchText);
  };

  render() {
    return (
      <div className="search-form">
        <input
          data-testid={'search-input'}
          type="text"
          value={this.state.searchText}
          onChange={this.handleChange}
        />
        <button data-testid={'search-button'} onClick={this.handleSearch}>
          Search
        </button>
      </div>
    );
  }
}

export default SearchTop;
