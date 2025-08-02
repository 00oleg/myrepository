import { NavLink } from 'react-router';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';

export interface SearchResultItem {
  uid: string;
  name: string;
  earthAnimal: string;
  pageNumber?: number;
}

const Card = ({ uid, name, earthAnimal, pageNumber }: SearchResultItem) => {
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
      <NavLink
        className="card-list__item-link"
        to={`/details?page=${pageNumber}&detail=${uid}`}
        data-testid="card-list__item-link"
      >
        <strong>{name || 'Undefined name'}</strong> -
        <span data-testid="card-list__item-earth">
          Earth Animal: {earthAnimal || false ? 'Yes' : 'No'}
        </span>
      </NavLink>
    </div>
  );
};

export default Card;
