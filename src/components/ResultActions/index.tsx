import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import type { SelectedItem } from '../../store/selectedItemsStore';

const convertToCSV = (items: SelectedItem[]) => {
  const rows = items.map((item) => {
    return [item.uid, item.name, item.earthAnimal];
  });

  return [['UUID', 'Name', 'Earth Animal'], ...rows]
    .map((e) => e.join(';'))
    .join('\r\n');
};

const handleDownload = (
  checkedItems: SelectedItem[],
  checkedItemsTotal: number
) => {
  const csvContent = convertToCSV(checkedItems);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', checkedItemsTotal + '_animals.csv');
  link.setAttribute('target', '_blank');
  link.style.visibility = 'hidden';
  link.click();
};

const ResultActions = () => {
  const { clearAll, getSelectedItems, getSelectedItemsCount } =
    useSelectedItemsStore();
  const checkedItems = getSelectedItems();
  const checkedItemsTotal = getSelectedItemsCount();

  const handleUnselect = () => {
    clearAll();
  };

  if (!checkedItemsTotal) {
    return '';
  }

  return (
    <div className="search-result-actions">
      <span>{checkedItemsTotal} items are selected.</span>
      <button className="btn-success" onClick={handleUnselect}>
        Unselect all
      </button>
      <button
        className="btn-success"
        onClick={() => handleDownload(checkedItems, checkedItemsTotal)}
      >
        Download
      </button>
    </div>
  );
};

export default ResultActions;
