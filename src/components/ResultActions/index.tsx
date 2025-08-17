import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import type { SelectedItem } from '../../store/selectedItemsStore';
import convertToCSV from '../../utils/convertToCSV';

const ResultActions = () => {
  const t = useTranslations('actions');
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const { clearAll, getSelectedItems, getSelectedItemsCount } =
    useSelectedItemsStore();
  const checkedItems = getSelectedItems();
  const checkedItemsTotal = getSelectedItemsCount();

  const handleUnselect = () => {
    clearAll();
  };

  const handleDownload = (checkedItems: SelectedItem[]) => {
    const csvContent = convertToCSV(checkedItems);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (linkRef.current) {
      linkRef.current.href = URL.createObjectURL(blob);
      linkRef.current.click();
    }
  };

  if (!checkedItemsTotal) {
    return '';
  }

  return (
    <div className="search-result-actions">
      <span>{t('selected', { count: checkedItemsTotal })}</span>
      <button className="btn-success" onClick={handleUnselect}>
        {t('unselectAll')}
      </button>
      <button
        className="btn-success"
        onClick={() => handleDownload(checkedItems)}
      >
        {t('download')}
      </button>
      <a
        ref={linkRef}
        href={linkRef.current?.href}
        download={`${checkedItemsTotal}_animals.csv`}
        target="_blank"
        style={{ display: 'none' }}
        rel="noreferrer"
      ></a>
    </div>
  );
};

export default ResultActions;
