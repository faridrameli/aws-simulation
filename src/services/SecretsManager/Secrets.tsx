import { useState } from 'react';
import { useSecretsManagerStore } from '../../store';
import type { Secret } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import { v4 as uuidv4 } from 'uuid';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Secrets() {
  const secrets = useSecretsManagerStore((s) => s.secrets);
  const addSecret = useSecretsManagerStore((s) => s.addSecret);
  const removeSecret = useSecretsManagerStore((s) => s.removeSecret);
  const [selected, setSelected] = useState<Secret[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [secretName, setSecretName] = useState('');
  const [description, setDescription] = useState('');
  const [secretValue, setSecretValue] = useState('');

  const columns: Column<Secret>[] = [
    { key: 'Name', header: 'Secret name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.Name}</span> },
    { key: 'Description', header: 'Description', render: (item) => item.Description || '-' },
    { key: 'RotationEnabled', header: 'Rotation', render: (item) => item.RotationEnabled ? 'Enabled' : 'Disabled' },
    { key: 'LastChangedDate', header: 'Last changed', render: (item) => new Date(item.LastChangedDate).toLocaleDateString() },
  ];

  function handleCreate() {
    if (!secretName || !secretValue) return;
    const id = uuidv4();
    addSecret({ SecretId: id, Name: secretName, Description: description, SecretArn: generateARN('secretsmanager', `secret:${secretName}`), CreatedDate: new Date().toISOString(), LastChangedDate: new Date().toISOString(), RotationEnabled: false, SecretValue: secretValue, Tags: [] });
    setSecretName(''); setDescription(''); setSecretValue(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((s) => removeSecret(s.SecretId)); setSelected([]); setShowDelete(false); }

  return (
    <div>
      <ResourceTable columns={columns} data={secrets as unknown as Record<string, unknown>[]} keyField="SecretId" title="Secrets"
        onSelectionChange={(items) => setSelected(items as unknown as Secret[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>Store a new secret</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete secrets" message={`Delete ${selected.length} secret(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Store a new secret</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Secret name</label><input className="aws-form-input" value={secretName} onChange={(e) => setSecretName(e.target.value)} placeholder="prod/database/password" /></div>
              <div className="aws-form-group"><label className="aws-form-label">Description</label><input className="aws-form-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
              <div className="aws-form-group"><label className="aws-form-label">Secret value</label>
                <textarea className="aws-form-input" rows={4} value={secretValue} onChange={(e) => setSecretValue(e.target.value)} placeholder='{"username": "admin", "password": "..."}' style={{ fontFamily: 'monospace', fontSize: '12px' }} />
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
