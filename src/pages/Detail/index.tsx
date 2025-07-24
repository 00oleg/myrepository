import Loading from '../../components/Loading';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const names = {
  uid: 'UID',
  name: 'Name',
  earthAnimal: 'Earth Animal',
  earthInsect: 'Earth Insect',
  avian: 'Avian',
  canine: 'Canine',
  feline: 'Feline',
};

interface DetailResult {
  uid: string;
  name: string;
  earthAnimal: boolean;
  earthInsect: boolean;
  avian: boolean;
  canine: boolean;
  feline: boolean;
}

const DetailPage = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<DetailResult>({
    uid: '',
    name: '',
    earthAnimal: false,
    earthInsect: false,
    avian: false,
    canine: false,
    feline: false,
  });
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleError = (param: string) => {
    setError(param);
  };

  const onDismiss = () => {
    navigate(`/?page=${searchParams.get('page')}`);
  };

  const handleLoading = (param: boolean) => {
    setLoading(param);
  };

  const handleResult = (param: DetailResult) => {
    setDetail(param);
  };

  const handleDetail = (uid: string | null) => {
    handleLoading(true);
    handleError('');

    fetch(`https://stapi.co/api/v1/rest/animal?uid=${uid}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Response was not ok');
        }

        return response.json();
      })
      .then(({ animal }) => {
        if (!animal) {
          handleError('Animal not found');
          throw new Error('Animal not found');
        }
        handleResult(animal);
        handleLoading(false);
      })
      .catch((error) => {
        handleLoading(false);
        handleError(error?.message || 'Something went wrong');
      });
  };

  useEffect(() => {
    handleDetail(searchParams.get('detail'));
  }, []);

  return (
    <>
      <div className="detail-page">
        <button
          data-testid={'close-button'}
          ref={buttonRef}
          onClick={onDismiss}
        >
          Close
        </button>

        <h2>Animal detail:</h2>
        {loading ? (
          <Loading loading={true} />
        ) : error ? (
          <div className="no-results no-results--error">
            <div>{error}</div>
          </div>
        ) : (
          <table>
            <tbody>
              {Object.keys(detail).map((el: string) => {
                let val = detail[el as keyof DetailResult];

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

export default DetailPage;
