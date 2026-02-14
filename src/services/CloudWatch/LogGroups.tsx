import { useState } from 'react';
import { useCloudWatchStore } from '../../store';
import type { CloudWatchLogGroup } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function LogGroups() {
  const logGroups = useCloudWatchStore((s) => s.logGroups);
  const addLogGroup = useCloudWatchStore((s) => s.addLogGroup);
  const removeLogGroup = useCloudWatchStore((s) => s.removeLogGroup);
  const [selected, setSelected] = useState<CloudWatchLogGroup[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [logGroupName, setLogGroupName] = useState('');
  const [retention, setRetention] = useState('30');

  const columns: Column<CloudWatchLogGroup>[] = [
    { key: 'LogGroupName', header: 'Log group', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.LogGroupName}</span> },
    { key: 'RetentionInDays', header: 'Retention', render: (item) => item.RetentionInDays ? `${item.RetentionInDays} days` : 'Never expire' },
    { key: 'StoredBytes', header: 'Stored bytes' },
    { key: 'CreationTime', header: 'Created', render: (item) => new Date(item.CreationTime).toLocaleDateString() },
  ];

  function handleCreate() {
    if (!logGroupName) return;
    addLogGroup({ LogGroupName: logGroupName, Arn: generateARN('logs', `log-group:${logGroupName}`), CreationTime: new Date().toISOString(), RetentionInDays: Number(retention) || null, StoredBytes: 0, Tags: [] });
    setLogGroupName('');
    setShowCreate(false);
  }

  function handleDelete() { selected.forEach((lg) => removeLogGroup(lg.LogGroupName)); setSelected([]); setShowDelete(false); }

  return (
    <div>
      <ResourceTable columns={columns} data={logGroups as unknown as Record<string, unknown>[]} keyField="LogGroupName" title="Log groups"
        onSelectionChange={(items) => setSelected(items as unknown as CloudWatchLogGroup[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>Create log group</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete log groups" message={`Delete ${selected.length} log group(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create log group</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Log group name</label><input className="aws-form-input" value={logGroupName} onChange={(e) => setLogGroupName(e.target.value)} placeholder="/aws/lambda/my-function" /></div>
              <div className="aws-form-group"><label className="aws-form-label">Retention</label>
                <select className="aws-form-select" value={retention} onChange={(e) => setRetention(e.target.value)}>
                  <option value="1">1 day</option><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option><option value="90">90 days</option><option value="365">365 days</option><option value="">Never expire</option>
                </select>
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
