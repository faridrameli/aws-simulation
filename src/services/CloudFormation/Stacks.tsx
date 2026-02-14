import { useState } from 'react';
import { useCloudFormationStore } from '../../store';
import type { CFStack } from '../../types/aws';
import { v4 as uuidv4 } from 'uuid';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Stacks() {
  const stacks = useCloudFormationStore((s) => s.stacks);
  const addStack = useCloudFormationStore((s) => s.addStack);
  const removeStack = useCloudFormationStore((s) => s.removeStack);
  const [selected, setSelected] = useState<CFStack[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [stackName, setStackName] = useState('');
  const [description, setDescription] = useState('');

  const columns: Column<CFStack>[] = [
    { key: 'StackName', header: 'Stack name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.StackName}</span> },
    { key: 'StackStatus', header: 'Status', render: (item) => {
      const color = item.StackStatus.includes('COMPLETE') && !item.StackStatus.includes('FAILED') ? '#1d8102' : item.StackStatus.includes('IN_PROGRESS') ? '#ff9900' : '#d13212';
      return <span style={{ color, fontWeight: 700 }}>{item.StackStatus}</span>;
    }},
    { key: 'Description', header: 'Description', render: (item) => item.Description || '-' },
    { key: 'CreationTime', header: 'Created', render: (item) => new Date(item.CreationTime).toLocaleDateString() },
  ];

  function handleCreate() {
    if (!stackName) return;
    addStack({
      StackName: stackName, StackId: `arn:aws:cloudformation:us-east-1:123456789012:stack/${stackName}/${uuidv4()}`,
      StackStatus: 'CREATE_COMPLETE', CreationTime: new Date().toISOString(), Description: description,
      Template: '{}', Parameters: [], Outputs: [], Tags: [],
    });
    setStackName(''); setDescription(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((s) => removeStack(s.StackId)); setSelected([]); setShowDelete(false); }

  return (
    <div>
      <ResourceTable columns={columns} data={stacks as unknown as Record<string, unknown>[]} keyField="StackId" title="Stacks"
        onSelectionChange={(items) => setSelected(items as unknown as CFStack[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>Create stack</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete stacks" message={`Delete ${selected.length} stack(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create stack</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Stack name</label><input className="aws-form-input" value={stackName} onChange={(e) => setStackName(e.target.value)} placeholder="my-stack" /></div>
              <div className="aws-form-group"><label className="aws-form-label">Description</label><input className="aws-form-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
