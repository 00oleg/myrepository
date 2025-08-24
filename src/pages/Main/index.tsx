import { useState } from 'react';
import Modal from '../../components/Modal';
import UncontrolledForm from '../../components/UncontrolledForm';
import ControlledForm from '../../components/ControlledForm';
import { useFormDataStore } from '../../store/usersStore';

const MainPage = () => {
  const [isUncontrolledModalOpen, setIsUncontrolledModalOpen] = useState(false);
  const [isControlledModalOpen, setIsControlledModalOpen] = useState(false);
  const { users, clearLast } = useFormDataStore();

  const toggleUncontrolledModal = (value: boolean) => {
    setIsUncontrolledModalOpen(value);
  };

  const toggleControlledModal = (value: boolean) => {
    setIsControlledModalOpen(value);
  };

  const handleClearLast = () => {
    setTimeout(() => {
      clearLast();
    }, 2000);
  };

  return (
    <div className="main-page">
      <h1 className="main-title">Form Modal</h1>

      <div className="button-group">
        <button
          onClick={() => toggleUncontrolledModal(true)}
          className="btn-primary btn-large"
        >
          Open Uncontrolled Form
        </button>

        <button
          onClick={() => toggleControlledModal(true)}
          className="btn-success btn-large"
        >
          Open Controlled Form
        </button>
      </div>

      <div className="cards">
        {users.length ? (
          users.map((user, index) => {
            if (user.isLast) {
              handleClearLast();
            }

            return (
              <div key={index} className={`card ${user.isLast ? 'last' : ''}`}>
                <div>
                  <img src={user.picture} />
                </div>
                <div>
                  Name: <strong>{user.name}</strong>
                </div>
                <div>
                  Age: <strong>{user.age}</strong>
                </div>
                <div>
                  Email: <strong>{user.email}</strong>
                </div>
                <div>
                  Password: <strong>{user.password}</strong>
                </div>
                <div>
                  Gender: <strong>{user.gender}</strong>
                </div>
                <div>
                  Terms:{' '}
                  <strong>{user.terms ? 'Accepted' : 'Not accepted'}</strong>
                </div>
                <div>
                  Country: <strong>{user.country}</strong>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card-empty">Users list is empty</div>
        )}
      </div>

      <Modal
        isOpen={isUncontrolledModalOpen}
        onClose={() => toggleUncontrolledModal(false)}
      >
        <UncontrolledForm onClose={() => toggleUncontrolledModal(false)} />
      </Modal>

      <Modal
        isOpen={isControlledModalOpen}
        onClose={() => toggleControlledModal(false)}
      >
        <ControlledForm onClose={() => toggleControlledModal(false)} />
      </Modal>
    </div>
  );
};

export default MainPage;
