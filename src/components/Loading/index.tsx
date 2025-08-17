import { useTranslations } from 'next-intl';

interface LoadingProps {
  loading?: boolean;
}

const Loading = (props: LoadingProps) => {
  const t = useTranslations('search');
  const { loading } = props;

  if (!loading) {
    return null;
  }

  return (
    <div className="search-result">
      <div data-testid={'loading-item'} aria-label={'Loading'}>
        {t('loadingResults')}
      </div>
    </div>
  );
};

export default Loading;
