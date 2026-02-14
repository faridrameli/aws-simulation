import React, { useState } from 'react';
import type { Tag } from '../../types/aws';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  disabled?: boolean;
  type?: string;
}

export function TextField({ label, value, onChange, placeholder, required, hint, disabled, type = 'text' }: TextFieldProps) {
  return (
    <div className="aws-form-group">
      <label className="aws-form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        className="aws-form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      {hint && <div className="aws-form-hint">{hint}</div>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
  disabled?: boolean;
}

export function SelectField({ label, value, onChange, options, required, hint, disabled }: SelectFieldProps) {
  return (
    <div className="aws-form-group">
      <label className="aws-form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <select
        className="aws-form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <div className="aws-form-hint">{hint}</div>}
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  disabled?: boolean;
}

export function CheckboxField({ label, checked, onChange, hint, disabled }: CheckboxFieldProps) {
  return (
    <div className="aws-form-group">
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="aws-form-label" style={{ marginBottom: 0 }}>{label}</span>
      </label>
      {hint && <div className="aws-form-hint">{hint}</div>}
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  required?: boolean;
  hint?: string;
}

export function NumberField({ label, value, onChange, min, max, required, hint }: NumberFieldProps) {
  return (
    <div className="aws-form-group">
      <label className="aws-form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        type="number"
        className="aws-form-input"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        required={required}
        style={{ width: '120px' }}
      />
      {hint && <div className="aws-form-hint">{hint}</div>}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4, hint }: TextAreaFieldProps) {
  return (
    <div className="aws-form-group">
      <label className="aws-form-label">{label}</label>
      <textarea
        className="aws-form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{ resize: 'vertical' }}
      />
      {hint && <div className="aws-form-hint">{hint}</div>}
    </div>
  );
}

interface TagEditorProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
}

export function TagEditor({ tags, onChange }: TagEditorProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  function addTag() {
    if (newKey) {
      onChange([...tags, { Key: newKey, Value: newValue }]);
      setNewKey('');
      setNewValue('');
    }
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div className="aws-form-group">
      <label className="aws-form-label">Tags</label>
      {tags.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          {tags.map((tag, i) => (
            <span key={i} className="aws-tag" style={{ marginRight: '4px', marginBottom: '4px' }}>
              {tag.Key}: {tag.Value}
              <button className="aws-tag-remove" onClick={() => removeTag(i)}>×</button>
            </span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <div>
          <input
            type="text"
            className="aws-form-input"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key"
            style={{ width: '150px' }}
          />
        </div>
        <div>
          <input
            type="text"
            className="aws-form-input"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            style={{ width: '150px' }}
          />
        </div>
        <button type="button" className="aws-btn aws-btn-secondary aws-btn-sm" onClick={addTag}>
          Add tag
        </button>
      </div>
    </div>
  );
}

interface KeyValueDisplayProps {
  data: Record<string, React.ReactNode>;
}

export function KeyValueDisplay({ data }: KeyValueDisplayProps) {
  return (
    <div className="aws-kv-grid">
      {Object.entries(data).map(([key, value]) => (
        <React.Fragment key={key}>
          <div className="aws-kv-label">{key}</div>
          <div className="aws-kv-value">{value}</div>
        </React.Fragment>
      ))}
    </div>
  );
}
