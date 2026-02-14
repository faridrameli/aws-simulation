import { useState } from 'react';
import { useEKSStore } from '../../store';
import type { EKSCluster } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';

export default function EKSDashboard() {
  const clusters = useEKSStore((s) => s.clusters);
  const nodeGroups = useEKSStore((s) => s.nodeGroups);
  const addCluster = useEKSStore((s) => s.addCluster);
  const removeCluster = useEKSStore((s) => s.removeCluster);
  const [showCreate, setShowCreate] = useState(false);
  const [clusterName, setClusterName] = useState('');
  const [version, setVersion] = useState('1.28');

  const activeClusters = clusters.filter((c) => c.Status === 'ACTIVE').length;

  function handleCreate() {
    if (!clusterName) return;
    const cluster: EKSCluster = {
      ClusterName: clusterName,
      ClusterArn: generateARN('eks', `cluster/${clusterName}`),
      Version: version,
      Status: 'ACTIVE',
      Endpoint: `https://${clusterName}.eks.us-east-1.amazonaws.com`,
      RoleArn: generateARN('iam', 'role/eks-cluster-role'),
      VpcId: 'vpc-0000000',
      SubnetIds: [],
      CreatedAt: new Date().toISOString(),
      Tags: [],
    };
    addCluster(cluster);
    setClusterName('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>EKS Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Clusters</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{clusters.length}</div>
          <div style={{ fontSize: '12px', color: '#1d8102', marginTop: '4px' }}>{activeClusters} active</div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Node groups</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{nodeGroups.length}</div>
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
              <p>Create an EKS cluster to run Kubernetes workloads on AWS.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Cluster name</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Kubernetes version</th>
                  <th style={thStyle}>Created</th>
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
                    <td style={tdStyle}>{c.Version}</td>
                    <td style={tdStyle}>{new Date(c.CreatedAt).toLocaleDateString()}</td>
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
                <input className="aws-form-input" value={clusterName} onChange={(e) => setClusterName(e.target.value)} placeholder="my-eks-cluster" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Kubernetes version</label>
                <select className="aws-form-select" value={version} onChange={(e) => setVersion(e.target.value)}>
                  <option value="1.29">1.29</option>
                  <option value="1.28">1.28</option>
                  <option value="1.27">1.27</option>
                  <option value="1.26">1.26</option>
                </select>
              </div>
              <div className="aws-alert aws-alert-info">
                <strong>Note:</strong> In a real AWS environment, you would configure cluster service role, networking (VPC, subnets), security groups, and cluster endpoint access here.
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
