import { useTranslations } from 'next-intl';
import getArryByNumber from '../../utils/getArryByNumber';
import { Link } from '../../i18n/navigation';

interface PaginationResultsProps {
  pageNumber: number;
  totalPages: number;
  perPage: number;
  searchText: string;
}

const PaginationResults = ({
  pageNumber,
  totalPages,
  perPage,
  searchText,
}: PaginationResultsProps) => {
  const t = useTranslations('pagination');

  return (
    <div className="pagination-result">
      <div className="pagination-result__list">
        <div className="pagination-result__title">{t('page')}:</div>
        {getArryByNumber(totalPages).map((el: number) => {
          return (
            <Link
              key={el}
              className={`pagination-result__item${pageNumber - 1 === el ? ' current' : ''}`}
              href={`?searchTerm=${searchText}&page=${el + 1}&per_page=${perPage}`}
            >
              {el + 1}
            </Link>
          );
        })}
      </div>

      <div className="pagination-result__list">
        <div className="pagination-result__title">{t('perPage')}:</div>
        {getArryByNumber(3).map((el: number) => {
          const perPageEl = (el + 1) * 10;

          return (
            <Link
              key={el}
              data-testid={`pagination-per-page-${perPageEl}`}
              className={`pagination-result__item${perPage === perPageEl ? ' current' : ''}`}
              href={`?searchTerm=${searchText}&page=${pageNumber}&per_page=${perPageEl}`}
            >
              {perPageEl}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PaginationResults;
