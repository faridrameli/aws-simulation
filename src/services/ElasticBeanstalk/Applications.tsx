import { useState } from 'react';
import { useElasticBeanstalkStore } from '../../store';
import type { EBApplication } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Applications() {
  const applications = useElasticBeanstalkStore((s) => s.applications);
  const addApplication = useElasticBeanstalkStore((s) => s.addApplication);
  const removeApplication = useElasticBeanstalkStore((s) => s.removeApplication);
  const [selected, setSelected] = useState<EBApplication[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [appName, setAppName] = useState('');
  const [description, setDescription] = useState('');

  const columns: Column<EBApplication>[] = [
    { key: 'ApplicationName', header: 'Application name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.ApplicationName}</span> },
    { key: 'Description', header: 'Description', render: (item) => item.Description || '-' },
    { key: 'Environments', header: 'Environments', render: (item) => String(item.Environments.length) },
    { key: 'DateCreated', header: 'Created', render: (item) => new Date(item.DateCreated).toLocaleDateString() },
  ];

  function handleCreate() {
    if (!appName) return;
    addApplication({ ApplicationName: appName, ApplicationArn: generateARN('elasticbeanstalk', `application/${appName}`), Description: description, DateCreated: new Date().toISOString(), DateUpdated: new Date().toISOString(), Environments: [], Tags: [] });
    setAppName(''); setDescription(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((a) => removeApplication(a.ApplicationName)); setSelected([]); setShowDelete(false); }

  return (
    <div>
      <ResourceTable columns={columns} data={applications as unknown as Record<string, unknown>[]} keyField="ApplicationName" title="Applications"
        onSelectionChange={(items) => setSelected(items as unknown as EBApplication[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>Create application</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete applications" message={`Delete ${selected.length} application(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create application</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Application name</label><input className="aws-form-input" value={appName} onChange={(e) => setAppName(e.target.value)} /></div>
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
