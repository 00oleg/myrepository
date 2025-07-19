import { Component } from 'react';
import SearchTop from '../../components/Search';
import SearchResults from '../../components/Result';

interface SearchPageProps {
  params: object;
}

interface SearchResult {
  name: string;
  earthAnimal: string;
}

interface SearchPageState {
  searchText: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}

class SearchPage extends Component<SearchPageProps, SearchPageState> {
  constructor(props: SearchPageProps) {
    super(props);
    this.state = {
      searchText: localStorage.getItem('searchText') || '',
      results: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.handleSearch(this.state.searchText);
  }

  handleSearch = (newSearchText: string) => {
    const clearSearchText = newSearchText.trim();
    localStorage.setItem('searchText', clearSearchText);

    this.setState({ loading: true });

    fetch(
      `https://stapi.co/api/v1/rest/animal/search?name=${clearSearchText}`,
      {
        method: 'POST',
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Response was not ok');
        }
        return response.json();
      })
      .then(({ animals }) => {
        this.setState({
          searchText: clearSearchText,
          results: animals,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          loading: false,
          error: error?.message || 'Something went wrong',
        });
        throw new Error(error);
      });
  };

  render() {
    const { searchText, results, loading, error } = this.state;

    return (
      <>
        <SearchTop searchText={searchText} onSearch={this.handleSearch} />
        <SearchResults loading={loading} results={results} error={error} />
      </>
    );
  }
}

export default SearchPage;
