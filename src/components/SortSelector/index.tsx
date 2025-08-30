import type {
  SortSelectorProps,
  SortField,
  SortOrder,
} from '../../types/country';

export function SortSelector({
  sortField,
  sortOrder,
  onSortChange,
}: SortSelectorProps) {
  const handleFieldChange = (field: SortField) => {
    onSortChange(field, sortOrder);
  };

  const handleOrderChange = (order: SortOrder) => {
    onSortChange(sortField, order);
  };

  return (
    <div className="sort-selector">
      <label>Sort by:</label>
      <div className="sort-controls">
        <select
          value={sortField}
          onChange={(e) => handleFieldChange(e.target.value as SortField)}
          className="sort-field-select"
        >
          <option value="name">Country Name</option>
          <option value="population">Population</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => handleOrderChange(e.target.value as SortOrder)}
          className="sort-order-select"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
