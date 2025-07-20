import { Component } from 'react';
import type { SearchResultItem } from '../Results';

class SearchResultsCard extends Component<SearchResultItem> {
  constructor(props: SearchResultItem) {
    super(props);
    this.state = { hasError: false };
  }

  render() {
    const { name, earthAnimal } = this.props;

    return (
      <li data-testid={'card-item'}>
        <strong>{name || 'Undefined name'}</strong> -
        <span>Earth Animal: {earthAnimal || false ? 'Yes' : 'No'}</span>
      </li>
    );
  }
}

export default SearchResultsCard;
