import { useState } from 'react';
import { useSNSStore } from '../../store';
import type { SNSTopic } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Topics() {
  const topics = useSNSStore((s) => s.topics);
  const addTopic = useSNSStore((s) => s.addTopic);
  const removeTopic = useSNSStore((s) => s.removeTopic);
  const [selected, setSelected] = useState<SNSTopic[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [displayName, setDisplayName] = useState('');

  const columns: Column<SNSTopic>[] = [
    { key: 'TopicName', header: 'Name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.TopicName}</span> },
    { key: 'DisplayName', header: 'Display name' },
    { key: 'SubscriptionCount', header: 'Subscriptions' },
    { key: 'CreatedTime', header: 'Created', render: (item) => new Date(item.CreatedTime).toLocaleDateString() },
  ];

  function handleCreate() {
    if (!topicName) return;
    addTopic({ TopicArn: generateARN('sns', topicName), TopicName: topicName, DisplayName: displayName || topicName, SubscriptionCount: 0, Subscriptions: [], Tags: [], CreatedTime: new Date().toISOString() });
    setTopicName(''); setDisplayName(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((t) => removeTopic(t.TopicArn)); setSelected([]); setShowDelete(false); }

  return (
    <div>
      <ResourceTable columns={columns} data={topics as unknown as Record<string, unknown>[]} keyField="TopicArn" title="Topics"
        onSelectionChange={(items) => setSelected(items as unknown as SNSTopic[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>Create topic</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete topics" message={`Delete ${selected.length} topic(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create topic</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Topic name</label><input className="aws-form-input" value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="my-topic" /></div>
              <div className="aws-form-group"><label className="aws-form-label">Display name</label><input className="aws-form-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
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
