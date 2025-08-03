import type { SelectedItem } from 'store/selectedItemsStore';

const convertToCSV = (items: SelectedItem[]) => {
  const rows = items.map((item) => {
    return [item.uid, item.name, item.earthAnimal];
  });

  return [['UUID', 'Name', 'Earth Animal'], ...rows]
    .map((e) => e.join(';'))
    .join('\r\n');
};

export default convertToCSV;
