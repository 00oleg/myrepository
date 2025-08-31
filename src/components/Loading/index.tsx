interface LoadingProps {
  loading?: boolean;
}

const Loading = (props: LoadingProps) => {
  const { loading } = props;

  if (!loading) {
    return null;
  }

  return (
    <div className="loading">
      <div className="spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default Loading;
