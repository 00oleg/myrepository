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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#0008',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#000',
          margin: '5% auto',
          padding: 24,
          maxWidth: 400,
          borderRadius: 8,
        }}
      >
        <h3>Select Additional Columns</h3>
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {availableFields.map((field) => (
            <label key={field} style={{ display: 'block', marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={() => handleToggle(field)}
              />
              {field}
            </label>
          ))}
        </div>
        <button onClick={onClose} style={{ marginTop: 16 }}>
          Close
        </button>
      </div>
    </div>
  );
}
