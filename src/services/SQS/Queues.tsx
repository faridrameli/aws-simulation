import { useState } from 'react';
import { useSQSStore } from '../../store';
import type { SQSQueue } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import { ACCOUNT_ID } from '../../utils/constants';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Queues() {
  const queues = useSQSStore((s) => s.queues);
  const addQueue = useSQSStore((s) => s.addQueue);
  const removeQueue = useSQSStore((s) => s.removeQueue);
  const [selected, setSelected] = useState<SQSQueue[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [queueName, setQueueName] = useState('');
  const [queueType, setQueueType] = useState<'Standard' | 'FIFO'>('Standard');

  const columns: Column<SQSQueue>[] = [
    { key: 'QueueName', header: 'Name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.QueueName}</span> },
    { key: 'Type', header: 'Type' },
    { key: 'MessagesAvailable', header: 'Messages available' },
    { key: 'MessagesInFlight', header: 'Messages in flight' },
    { key: 'CreatedTimestamp', header: 'Created', render: (item) => new Date(item.CreatedTimestamp).toLocaleDateString() },
  ];

  function handleCreate() {
    if (!queueName) return;
    const finalName = queueType === 'FIFO' && !queueName.endsWith('.fifo') ? `${queueName}.fifo` : queueName;
    addQueue({
      QueueUrl: `https://sqs.us-east-1.amazonaws.com/${ACCOUNT_ID}/${finalName}`, QueueName: finalName,
      QueueArn: generateARN('sqs', finalName), Type: queueType, VisibilityTimeout: 30,
      MessageRetentionPeriod: 345600, MaxMessageSize: 262144, DelaySeconds: 0,
      MessagesAvailable: 0, MessagesInFlight: 0, CreatedTimestamp: new Date().toISOString(), Tags: [],
    });
    setQueueName(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((q) => removeQueue(q.QueueUrl)); setSelected([]); setShowDelete(false); }

  return (
    <div>
      <ResourceTable columns={columns} data={queues as unknown as Record<string, unknown>[]} keyField="QueueUrl" title="Queues"
        onSelectionChange={(items) => setSelected(items as unknown as SQSQueue[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>Create queue</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete queues" message={`Delete ${selected.length} queue(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create queue</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Queue name</label><input className="aws-form-input" value={queueName} onChange={(e) => setQueueName(e.target.value)} placeholder="my-queue" /></div>
              <div className="aws-form-group"><label className="aws-form-label">Type</label>
                <select className="aws-form-select" value={queueType} onChange={(e) => setQueueType(e.target.value as 'Standard' | 'FIFO')}><option value="Standard">Standard</option><option value="FIFO">FIFO</option></select>
              </div>
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
