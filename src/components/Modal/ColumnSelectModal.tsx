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
  if (!isOpen) return null;

  function handleToggle(field: string) {
    if (selectedFields.includes(field)) {
      onChange(selectedFields.filter((f) => f !== field));
    } else {
      onChange([...selectedFields, field]);
    }
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
                checked={selectedFields.includes(field)}
                onChange={() => handleToggle(field)}
              />
              {field}
            </label>
          ))}
        </div>
        <button onClick={onClose} className="modal-close-button">
          Close
        </button>
      </div>
    </div>
  );
}
