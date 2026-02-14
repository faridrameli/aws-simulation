import { useState } from 'react';
import { useECSStore } from '../../store';
import type { ECSCluster } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Clusters() {
  const clusters = useECSStore((s) => s.clusters);
  const addCluster = useECSStore((s) => s.addCluster);
  const removeCluster = useECSStore((s) => s.removeCluster);
  const [selected, setSelected] = useState<ECSCluster[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [clusterName, setClusterName] = useState('');

  const columns: Column<ECSCluster>[] = [
    { key: 'ClusterName', header: 'Cluster name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.ClusterName}</span> },
    { key: 'Status', header: 'Status', render: (item) => <span style={{ color: item.Status === 'ACTIVE' ? '#1d8102' : '#ff9900', fontWeight: 700 }}>{item.Status}</span> },
    { key: 'RunningTasksCount', header: 'Running tasks' },
    { key: 'PendingTasksCount', header: 'Pending tasks' },
    { key: 'ActiveServicesCount', header: 'Active services' },
    { key: 'RegisteredContainerInstances', header: 'Container instances' },
  ];

  function handleCreate() {
    if (!clusterName) return;
    addCluster({ ClusterName: clusterName, ClusterArn: generateARN('ecs', `cluster/${clusterName}`), Status: 'ACTIVE', RegisteredContainerInstances: 0, RunningTasksCount: 0, PendingTasksCount: 0, ActiveServicesCount: 0, Tags: [] });
    setClusterName(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((c) => removeCluster(c.ClusterName)); setSelected([]); setShowDelete(false); }

  return (
    <div data-mission="ecs-clusters-list">
      <ResourceTable columns={columns} data={clusters as unknown as Record<string, unknown>[]} keyField="ClusterName" title="Clusters"
        onSelectionChange={(items) => setSelected(items as unknown as ECSCluster[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" data-mission="ecs-create-btn" onClick={() => setShowCreate(true)}>Create cluster</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete clusters" message={`Delete ${selected.length} cluster(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create cluster</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Cluster name</label><input className="aws-form-input" value={clusterName} onChange={(e) => setClusterName(e.target.value)} placeholder="my-cluster" /></div>
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
