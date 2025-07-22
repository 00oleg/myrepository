import { Link } from 'react-router-dom';

interface SearchResultItem {
  uid: string;
  name: string;
  earthAnimal: string;
  pageNumber?: number;
}

const Card = ({ uid, name, earthAnimal, pageNumber }: SearchResultItem) => {
  return (
    <div className="card-list__item" data-testid="card-list__item">
      <Link
        className="card-list__item-link"
        to={`/details?page=${pageNumber}&detail=${uid}`}
        data-testid="card-list__item-link"
      >
        <strong>{name || 'Undefined name'}</strong> -
        <span data-testid="card-list__item-earth">
          Earth Animal: {earthAnimal || false ? 'Yes' : 'No'}
        </span>
      </Link>
    </div>
  );
};

export default Card;
