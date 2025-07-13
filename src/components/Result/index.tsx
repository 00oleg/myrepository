import { Component } from 'react';

interface SearchResultItem {
  name: string;
  earthAnimal: string;
}

interface SearchResultState {
  hasError: boolean;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  loading: boolean;
}

class SearchResults extends Component<SearchResultsProps, SearchResultState> {
  constructor(props: SearchResultsProps) {
    super(props);
    this.state = { hasError: false };
  }

  handleClick = () => {
    this.setState({
      hasError: true,
    });
  };

  render() {
    if (this.state.hasError) {
      throw new Error('Error in event handler');
    }

    const { loading, results } = this.props;

    if (loading) {
      return (
        <div className="search-result">
          <div>Loading...</div>
        </div>
      );
    }

    return (
      <div className="search-result">
        <h2>
          Search Star Trek Animals
          <button className="btn-error" onClick={this.handleClick}>
            Get Error
          </button>
        </h2>
        {results.length ? (
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <strong>{result.name}</strong> -
                <span>Earth Animal: {result.earthAnimal ? 'Yes' : 'No'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-results">No results</div>
        )}
      </div>
    );
  }
}

export default SearchResults;
