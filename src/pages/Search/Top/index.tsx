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
    this.state = { searchText: '' };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchText: event.target.value.trim() });
  };

  handleSearch = () => {
    this.props.onSearch(this.state.searchText);
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.searchText}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}

export default SearchTop;
