import { useState } from 'react';
import { useSecretsManagerStore } from '../../store';
import type { Secret } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import { v4 as uuidv4 } from 'uuid';

export default function SecretsManagerDashboard() {
  const secrets = useSecretsManagerStore((s) => s.secrets);
  const addSecret = useSecretsManagerStore((s) => s.addSecret);
  const removeSecret = useSecretsManagerStore((s) => s.removeSecret);
  const [showCreate, setShowCreate] = useState(false);
  const [secretName, setSecretName] = useState('');
  const [description, setDescription] = useState('');
  const [secretValue, setSecretValue] = useState('');
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());

  function handleCreate() {
    if (!secretName || !secretValue) return;
    const id = uuidv4();
    const secret: Secret = {
      SecretId: id,
      Name: secretName,
      Description: description,
      SecretArn: generateARN('secretsmanager', `secret:${secretName}`),
      CreatedDate: new Date().toISOString(),
      LastChangedDate: new Date().toISOString(),
      RotationEnabled: false,
      SecretValue: secretValue,
      Tags: [],
    };
    addSecret(secret);
    setSecretName('');
    setDescription('');
    setSecretValue('');
    setShowCreate(false);
  }

  function toggleReveal(id: string) {
    setRevealedSecrets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>Secrets Manager Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Secrets</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{secrets.length}</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Secrets</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Store a new secret</button>
        </div>
        <div className="aws-panel-body">
          {secrets.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No secrets</h3>
              <p>Store a secret to manage database credentials, API keys, and other sensitive data.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Secret name</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Secret value</th>
                  <th style={thStyle}>Rotation</th>
                  <th style={thStyle}>Last changed</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {secrets.map((s) => (
                  <tr key={s.SecretId} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{s.Name}</span></td>
                    <td style={tdStyle}>{s.Description || '-'}</td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {revealedSecrets.has(s.SecretId) ? s.SecretValue : '••••••••'}
                      </span>
                      <button
                        className="aws-btn aws-btn-link aws-btn-sm"
                        onClick={() => toggleReveal(s.SecretId)}
                        style={{ marginLeft: '8px' }}
                      >
                        {revealedSecrets.has(s.SecretId) ? 'Hide' : 'Reveal'}
                      </button>
                    </td>
                    <td style={tdStyle}>{s.RotationEnabled ? 'Enabled' : 'Disabled'}</td>
                    <td style={tdStyle}>{new Date(s.LastChangedDate).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeSecret(s.SecretId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Store a new secret</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Secret name</label>
                <input className="aws-form-input" value={secretName} onChange={(e) => setSecretName(e.target.value)} placeholder="prod/database/password" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Description</label>
                <input className="aws-form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Secret value</label>
                <textarea
                  className="aws-form-input"
                  rows={4}
                  value={secretValue}
                  onChange={(e) => setSecretValue(e.target.value)}
                  placeholder='{"username": "admin", "password": "..."}'
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                />
                <div className="aws-form-hint">You can store JSON key-value pairs or plain text.</div>
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Store</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
