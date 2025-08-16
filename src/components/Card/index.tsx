import Link from 'next/link';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';

export interface queryParams {
  page: number;
  perPage: number;
  keywords: string;
  details?: string;
}
export interface SearchResultItem {
  uid: string;
  name: string;
  earthAnimal: string;
  pageNumber?: number;
  queryParams: queryParams;
}

const Card = ({ queryParams, uid, name, earthAnimal }: SearchResultItem) => {
  const { page, perPage, keywords } = queryParams;
  const { toggleItem, isSelected } = useSelectedItemsStore();

  const handleCheckboxChange = () => {
    toggleItem({ uid, name, earthAnimal });
  };

  return (
    <div className="card-list__item" data-testid="card-item">
      <input
        type="checkbox"
        value={uid}
        onChange={() => handleCheckboxChange()}
        checked={isSelected(uid)}
      />
      <Link
        className="card-list__item-link"
        href={`/search?searchTerm=${keywords}&page=${page}&per_page=${perPage}&details=${uid}`}
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
