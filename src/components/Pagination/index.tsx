import { NavLink } from 'react-router';
import getArryByNumber from '../../utils/getArryByNumber';

interface PaginationResultsProps {
  pageNumber: number;
  totalPages: number;
  perPage: number;
  handlePerPage: (page: number) => void;
}

const PaginationResults = ({
  pageNumber,
  totalPages,
  perPage,
  handlePerPage,
}: PaginationResultsProps) => {
  return (
    <div className="pagination-result">
      <div className="pagination-result__list">
        <div className="pagination-result__title">Page:</div>
        {getArryByNumber(totalPages).map((el: number) => {
          return (
            <NavLink
              key={el}
              className={`pagination-result__item${pageNumber - 1 === el ? ' current' : ''}`}
              to={`?page=${el + 1}`}
            >
              {el + 1}
            </NavLink>
          );
        })}
      </div>

      <div className="pagination-result__list">
        <div className="pagination-result__title">Per Page:</div>
        {getArryByNumber(3).map((el: number) => {
          const page = (el + 1) * 10;

          return (
            <div
              key={el}
              data-testid={`pagination-per-page-${page}`}
              className={`pagination-result__item${page === perPage ? ' current' : ''}`}
              onClick={() => handlePerPage(page)}
            >
              {page}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaginationResults;
