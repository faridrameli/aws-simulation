interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="aws-modal-overlay" onClick={onCancel}>
      <div className="aws-modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="aws-modal-header">
          <h2>{title}</h2>
        </div>
        <div className="aws-modal-body">
          <p>{message}</p>
        </div>
        <div className="aws-modal-footer">
          <button className="aws-btn aws-btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`aws-btn ${danger ? 'aws-btn-danger' : 'aws-btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
