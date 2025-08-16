import Link from 'next/link';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import { useSearchParams } from 'next/navigation';

export interface SearchResultItem {
  uid: string;
  name: string;
  earthAnimal: string;
  pageNumber?: number;
}

const Card = ({ uid, name, earthAnimal, pageNumber }: SearchResultItem) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams?.get('page')) || 1;
  const currentPerPage = Number(searchParams?.get('per_page')) || 10;
  const currentSearchTerm = String(searchParams?.get('searchTerm')) || '';
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
        // href={`/details?page=${pageNumber}&detail=${uid}`}
        href={`/search?searchTerm=${currentSearchTerm}&page=${currentPage}&per_page=${currentPerPage}&details=${uid}`}
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
