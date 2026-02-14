import React from 'react';

interface CreateResourceModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  submitLabel?: string;
  isValid?: boolean;
}

export default function CreateResourceModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  children,
  submitLabel = 'Create',
  isValid = true,
}: CreateResourceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="aws-modal-overlay" onClick={onClose}>
      <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
        <div className="aws-modal-header">
          <h2>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#545b64' }}
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="aws-modal-body">{children}</div>
          <div className="aws-modal-footer">
            <button type="button" className="aws-btn aws-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="aws-btn aws-btn-primary" disabled={!isValid}>
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
