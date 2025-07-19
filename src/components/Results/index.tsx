import { Component } from 'react';

export interface SearchResultItem {
  name: string;
  earthAnimal: string;
}

interface SearchResultState {
  hasError: boolean;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  loading: boolean;
  error: string | null;
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

    const { loading, results, error } = this.props;

    if (error) {
      return (
        <div className="search-result">
          <div className="no-results no-results--error">
            <div>{error}</div>
          </div>
        </div>
      );
    }

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
              <li key={index} data-testid={'card-item'}>
                <strong>{result?.name || 'Undefined name'}</strong> -
                <span>
                  Earth Animal: {result?.earthAnimal || false ? 'Yes' : 'No'}
                </span>
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
