import { useState } from 'react';
import { useEKSStore } from '../../store';
import type { EKSCluster } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function EKSClusters() {
  const clusters = useEKSStore((s) => s.clusters);
  const addCluster = useEKSStore((s) => s.addCluster);
  const removeCluster = useEKSStore((s) => s.removeCluster);
  const [selected, setSelected] = useState<EKSCluster[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [clusterName, setClusterName] = useState('');
  const [version, setVersion] = useState('1.28');

  const columns: Column<EKSCluster>[] = [
    { key: 'ClusterName', header: 'Name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.ClusterName}</span> },
    { key: 'Status', header: 'Status', render: (item) => <span style={{ color: item.Status === 'ACTIVE' ? '#1d8102' : '#ff9900', fontWeight: 700 }}>{item.Status}</span> },
    { key: 'Version', header: 'Kubernetes version' },
    { key: 'CreatedAt', header: 'Created', render: (item) => new Date(item.CreatedAt).toLocaleDateString() },
  ];

  function handleCreate() {
    if (!clusterName) return;
    addCluster({ ClusterName: clusterName, ClusterArn: generateARN('eks', `cluster/${clusterName}`), Version: version, Status: 'ACTIVE', Endpoint: `https://${clusterName}.eks.us-east-1.amazonaws.com`, RoleArn: generateARN('iam', 'role/eks-cluster-role'), VpcId: 'vpc-0000000', SubnetIds: [], CreatedAt: new Date().toISOString(), Tags: [] });
    setClusterName(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((c) => removeCluster(c.ClusterName)); setSelected([]); setShowDelete(false); }

  return (
    <div>
      <ResourceTable columns={columns} data={clusters as unknown as Record<string, unknown>[]} keyField="ClusterName" title="Clusters"
        onSelectionChange={(items) => setSelected(items as unknown as EKSCluster[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>Create cluster</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete clusters" message={`Delete ${selected.length} cluster(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create cluster</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Cluster name</label><input className="aws-form-input" value={clusterName} onChange={(e) => setClusterName(e.target.value)} /></div>
              <div className="aws-form-group"><label className="aws-form-label">Kubernetes version</label>
                <select className="aws-form-select" value={version} onChange={(e) => setVersion(e.target.value)}>
                  <option value="1.29">1.29</option><option value="1.28">1.28</option><option value="1.27">1.27</option><option value="1.26">1.26</option>
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
