import { Component } from 'react';

interface LoadingState {
  loading: boolean;
}

interface LoadingProps {
  loading?: boolean;
}

class Loading extends Component<LoadingProps, LoadingState> {
  constructor(props: LoadingProps) {
    super(props);
    this.state = { loading: true };
  }

  render() {
    const { loading } = this.props;

    if (!loading) {
      return null;
    }

    return (
      <div className="search-result">
        <div data-testid={'loading-item'} aria-label={'Loading'}>
          Loading...
        </div>
      </div>
    );
  }
}

export default Loading;
