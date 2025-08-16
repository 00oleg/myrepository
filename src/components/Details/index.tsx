import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { DetailResult } from '../../api/animals';
import { queryParams } from '../Card';

const names = {
  uid: 'UID',
  name: 'Name',
  earthAnimal: 'Earth Animal',
  earthInsect: 'Earth Insect',
  avian: 'Avian',
  canine: 'Canine',
  feline: 'Feline',
};

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
      setError('Animal not found');
    } else {
      setError('');
    }
  }, [detailData, propError]);

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
          Close
        </button>
        <h2>Animal detail:</h2>
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
                  val = val ? 'Yes' : 'No';
                }

                return (
                  <tr key={el}>
                    <td>
                      <strong>{names[el as keyof DetailResult]}:</strong>
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
