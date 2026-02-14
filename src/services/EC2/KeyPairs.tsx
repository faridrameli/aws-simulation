import { useState } from 'react';
import { useEC2Store } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { TextField, SelectField } from '../../components/shared/FormFields';
import { generateKeyPairId } from '../../utils/idGenerator';
import type { KeyPair } from '../../types/aws';

export default function KeyPairs() {
  const keyPairs = useEC2Store((s) => s.keyPairs);
  const addKeyPair = useEC2Store((s) => s.addKeyPair);
  const removeKeyPair = useEC2Store((s) => s.removeKeyPair);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<KeyPair[]>([]);
  const [showDelete, setShowDelete] = useState(false);

  const [name, setName] = useState('');
  const [keyType, setKeyType] = useState<'rsa' | 'ed25519'>('rsa');

  const columns: Column<KeyPair>[] = [
    { key: 'KeyName', header: 'Name' },
    { key: 'KeyPairId', header: 'Key pair ID' },
    { key: 'KeyType', header: 'Type' },
    { key: 'CreatedTime', header: 'Created' },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    addKeyPair({
      KeyPairId: generateKeyPairId(),
      KeyName: name,
      KeyType: keyType,
      CreatedTime: new Date().toISOString(),
      Tags: [],
    });
    setShowCreate(false);
    setName('');
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={keyPairs as unknown as Record<string, unknown>[]}
        keyField="KeyPairId"
        title="Key Pairs"
        onSelectionChange={(items) => setSelected(items as unknown as KeyPair[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>
              Create key pair
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create key pair"
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isValid={!!name}
      >
        <TextField label="Key pair name" value={name} onChange={setName} required placeholder="my-key-pair" />
        <SelectField
          label="Key pair type"
          value={keyType}
          onChange={(v) => setKeyType(v as 'rsa' | 'ed25519')}
          options={[
            { value: 'rsa', label: 'RSA' },
            { value: 'ed25519', label: 'ED25519' },
          ]}
        />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete key pairs"
        message={`Delete ${selected.length} key pair(s)?`}
        confirmLabel="Delete"
        onConfirm={() => {
          selected.forEach((kp) => removeKeyPair(kp.KeyPairId));
          setSelected([]);
          setShowDelete(false);
        }}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}
