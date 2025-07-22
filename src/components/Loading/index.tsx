interface LoadingProps {
  loading?: boolean;
}

const Loading = (props: LoadingProps) => {
  const { loading } = props;

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
};

export default Loading;
