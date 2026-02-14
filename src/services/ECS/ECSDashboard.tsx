import { useState } from 'react';
import { useECSStore } from '../../store';
import type { ECSCluster } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';

export default function ECSDashboard() {
  const clusters = useECSStore((s) => s.clusters);
  const services = useECSStore((s) => s.services);
  const taskDefinitions = useECSStore((s) => s.taskDefinitions);
  const addCluster = useECSStore((s) => s.addCluster);
  const removeCluster = useECSStore((s) => s.removeCluster);
  const [showCreate, setShowCreate] = useState(false);
  const [clusterName, setClusterName] = useState('');

  const activeClusters = clusters.filter((c) => c.Status === 'ACTIVE').length;

  function handleCreate() {
    if (!clusterName) return;
    const cluster: ECSCluster = {
      ClusterName: clusterName,
      ClusterArn: generateARN('ecs', `cluster/${clusterName}`),
      Status: 'ACTIVE',
      RegisteredContainerInstances: 0,
      RunningTasksCount: 0,
      PendingTasksCount: 0,
      ActiveServicesCount: 0,
      Tags: [],
    };
    addCluster(cluster);
    setClusterName('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>ECS Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Clusters</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{clusters.length}</div>
          <div style={{ fontSize: '12px', color: '#1d8102', marginTop: '4px' }}>{activeClusters} active</div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Services</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{services.length}</div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Task definitions</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{taskDefinitions.length}</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Clusters</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create cluster</button>
        </div>
        <div className="aws-panel-body">
          {clusters.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No clusters</h3>
              <p>Create an ECS cluster to start running containers.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Cluster name</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Running tasks</th>
                  <th style={thStyle}>Active services</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clusters.map((c) => (
                  <tr key={c.ClusterName} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{c.ClusterName}</span></td>
                    <td style={tdStyle}>
                      <span style={{ color: c.Status === 'ACTIVE' ? '#1d8102' : '#ff9900', fontWeight: 700 }}>{c.Status}</span>
                    </td>
                    <td style={tdStyle}>{c.RunningTasksCount}</td>
                    <td style={tdStyle}>{c.ActiveServicesCount}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeCluster(c.ClusterName)}>Delete</button>
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
            <div className="aws-modal-header"><h2>Create cluster</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Cluster name</label>
                <input className="aws-form-input" value={clusterName} onChange={(e) => setClusterName(e.target.value)} placeholder="my-cluster" />
              </div>
              <div className="aws-alert aws-alert-info">
                <strong>Note:</strong> In a real AWS environment, you would configure infrastructure providers (Fargate, EC2), networking, and monitoring here.
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

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
