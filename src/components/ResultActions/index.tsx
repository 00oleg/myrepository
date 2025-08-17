import { useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import type { SelectedItem } from '../../store/selectedItemsStore';
import { generateCSVAction } from '../../app/actions/csv';

const ResultActions = () => {
  const t = useTranslations('actions');
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { clearAll, getSelectedItems, getSelectedItemsCount } =
    useSelectedItemsStore();
  const checkedItems = getSelectedItems();
  const checkedItemsTotal = getSelectedItemsCount();

  const handleUnselect = () => {
    clearAll();
  };

  const handleDownload = async (checkedItems: SelectedItem[]) => {
    startTransition(async () => {
      try {
        setDownloadError(null);
        const result = await generateCSVAction(checkedItems);

        if (result.success && result.data) {
          const blob = new Blob([result.data], {
            type: 'text/csv;charset=utf-8;',
          });
          if (linkRef.current) {
            linkRef.current.href = URL.createObjectURL(blob);
            linkRef.current.download = result.filename;
            linkRef.current.click();
          }
        } else {
          setDownloadError(result.error || t('failedToGenerate'));
        }
      } catch (error) {
        setDownloadError(t('failedToDownload', error));
      }
    });
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
        disabled={isPending}
      >
        {isPending ? t('generating') : t('download')}
      </button>
      {downloadError && <div className="error-message">{downloadError}</div>}
      <a
        ref={linkRef}
        href={linkRef.current?.href}
        style={{ display: 'none' }}
        rel="noreferrer"
      ></a>
    </div>
  );
};

export default ResultActions;
