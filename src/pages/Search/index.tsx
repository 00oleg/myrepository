import { Component } from 'react';
import SearchTop from './Top';
import SearchResults from './Result';

interface SearchPageProps {
  params: object;
}

interface SearchResult {
  name: string;
}

interface SearchPageState {
  searchText: string;
  results: SearchResult[];
  error: Error | null;
}

class SearchPage extends Component<SearchPageProps, SearchPageState> {
  constructor(props: SearchPageProps) {
    super(props);
    this.state = {
      searchText: '',
      results: [],
      error: null,
    };
  }

  handleSearch = (newSearchText: string) => {
    const clearSearchText = newSearchText.trim();

    fetch(
      `https://stapi.co/api/v1/rest/animal/search?name=${clearSearchText}`,
      {
        method: 'POST',
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(({ animals }) => {
        this.setState({
          searchText: clearSearchText,
          results: animals,
          error: null,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  render() {
    return (
      <>
        <SearchTop
          searchText={this.state.searchText}
          onSearch={this.handleSearch}
        />
        <SearchResults results={this.state.results} />
      </>
    );
  }
}

export default SearchPage;
