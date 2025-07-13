import { Component } from 'react';
import SearchTop from './Top';

interface SearchPageProps {
  params: object;
}

interface SearchPageState {
  searchText: string;
  error: Error | null;
}

class SearchPage extends Component<SearchPageProps, SearchPageState> {
  constructor(props: SearchPageProps) {
    super(props);
    this.state = {
      searchText: '',
      error: null,
    };
  }

  handleSearch = (newSearchText: string) => {
    console.log(newSearchText);
  };

  render() {
    return (
      <SearchTop
        searchText={this.state.searchText}
        onSearch={this.handleSearch}
      />
    );
  }
}

export default SearchPage;
