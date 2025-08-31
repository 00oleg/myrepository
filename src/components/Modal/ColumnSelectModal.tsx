import { useState, useEffect } from 'react';
import formatFieldName from '../../utils/formatFieldName';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableFields: string[];
  selectedFields: string[];
  onChange: (fields: string[]) => void;
}

export default function ColumnSelectModal({
  isOpen,
  onClose,
  availableFields,
  selectedFields,
  onChange,
}: ModalProps) {
  const [localSelectedFields, setLocalSelectedFields] =
    useState<string[]>(selectedFields);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedFields(selectedFields);
    }
  }, [isOpen, selectedFields]);

  if (!isOpen) return null;

  function handleToggle(field: string) {
    if (localSelectedFields.includes(field)) {
      setLocalSelectedFields(localSelectedFields.filter((f) => f !== field));
    } else {
      setLocalSelectedFields([...localSelectedFields, field]);
    }
  }

  function handleApply() {
    onChange(localSelectedFields);
    onClose();
  }

  function handleCancel() {
    setLocalSelectedFields(selectedFields);
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select Additional Columns</h3>
        <div className="modal-fields-container">
          {availableFields.map((field) => (
            <label key={field} className="modal-field-label">
              <input
                type="checkbox"
                checked={localSelectedFields.includes(field)}
                onChange={() => handleToggle(field)}
              />
              {formatFieldName(field)}
            </label>
          ))}
        </div>
        <div className="modal-buttons">
          <button onClick={handleCancel} className="modal-cancel-button">
            Cancel
          </button>
          <button onClick={handleApply} className="modal-apply-button">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
