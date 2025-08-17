import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { DetailResult } from '../../api/animals';
import { queryParams } from '../Card';
import { usePathname, useRouter } from '../../i18n/navigation';

interface StaticDetailPageProps {
  detailData: DetailResult | null;
  error?: string | null;
  queryParams: queryParams;
}

const Details = ({
  detailData,
  error: propError,
  queryParams,
}: StaticDetailPageProps) => {
  const t = useTranslations('details');
  const tErrors = useTranslations('errors');
  const { replace } = useRouter();
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState<string>('');
  const { page, perPage, keywords } = queryParams;

  const onDismiss = () => {
    replace(
      `${pathname}/?searchTerm=${keywords}&page=${page}&per_page=${perPage}`
    );
  };

  useEffect(() => {
    if (propError) {
      setError(propError);
    } else if (!detailData) {
      setError(tErrors('animalNotFound'));
    } else {
      setError('');
    }
  }, [detailData, propError, tErrors]);

  const displayDetail = detailData || {
    uid: '',
    name: '',
    earthAnimal: false,
    earthInsect: false,
    avian: false,
    canine: false,
    feline: false,
  };

  return (
    <>
      <div className="detail-page">
        <button
          className="close-button"
          data-testid={'close-button'}
          ref={buttonRef}
          onClick={onDismiss}
        >
          {t('close')}
        </button>
        <h2>{t('title')}</h2>
        {error ? (
          <div className="no-results no-results--error">
            <div>{error}</div>
          </div>
        ) : (
          <table>
            <tbody>
              {Object.keys(displayDetail).map((el: string) => {
                let val = displayDetail[el as keyof DetailResult];

                if (typeof val === 'boolean') {
                  val = val ? t('yes') : t('no');
                }

                return (
                  <tr key={el}>
                    <td>
                      <strong>
                        {t(`fields.${el as keyof DetailResult}`)}:
                      </strong>
                    </td>
                    <td>{val}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className="detail-overlay" onClick={onDismiss}></div>
    </>
  );
};

export default Details;
