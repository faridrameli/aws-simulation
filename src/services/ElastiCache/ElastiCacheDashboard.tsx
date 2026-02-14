import { useState } from 'react';
import { useElastiCacheStore } from '../../store';
import type { ElastiCacheCluster } from '../../types/aws';
import { ELASTICACHE_NODE_TYPES } from '../../utils/constants';

export default function ElastiCacheDashboard() {
  const clusters = useElastiCacheStore((s) => s.clusters);
  const addCluster = useElastiCacheStore((s) => s.addCluster);
  const removeCluster = useElastiCacheStore((s) => s.removeCluster);
  const [showCreate, setShowCreate] = useState(false);
  const [clusterId, setClusterId] = useState('');
  const [engine, setEngine] = useState<'redis' | 'memcached'>('redis');
  const [engineVersion, setEngineVersion] = useState('7.0');
  const [nodeType, setNodeType] = useState(ELASTICACHE_NODE_TYPES[0]);
  const [numNodes, setNumNodes] = useState('1');

  const available = clusters.filter((c) => c.CacheClusterStatus === 'available').length;

  function handleCreate() {
    if (!clusterId) return;
    const cluster: ElastiCacheCluster = {
      CacheClusterId: clusterId,
      CacheClusterStatus: 'available',
      Engine: engine,
      EngineVersion: engineVersion,
      CacheNodeType: nodeType,
      NumCacheNodes: Number(numNodes),
      PreferredAvailabilityZone: 'us-east-1a',
      CacheClusterCreateTime: new Date().toISOString(),
      Tags: [],
    };
    addCluster(cluster);
    setClusterId('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>ElastiCache Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Clusters</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{clusters.length}</div>
          <div style={{ fontSize: '12px', color: '#1d8102', marginTop: '4px' }}>{available} available</div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Total nodes</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{clusters.reduce((s, c) => s + c.NumCacheNodes, 0)}</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Redis & Memcached clusters</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create cluster</button>
        </div>
        <div className="aws-panel-body">
          {clusters.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No clusters</h3>
              <p>Create an ElastiCache cluster for in-memory caching with Redis or Memcached.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Cluster ID</th>
                  <th style={thStyle}>Engine</th>
                  <th style={thStyle}>Version</th>
                  <th style={thStyle}>Node type</th>
                  <th style={thStyle}>Nodes</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clusters.map((c) => (
                  <tr key={c.CacheClusterId} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{c.CacheClusterId}</span></td>
                    <td style={tdStyle}>{c.Engine}</td>
                    <td style={tdStyle}>{c.EngineVersion}</td>
                    <td style={tdStyle}>{c.CacheNodeType}</td>
                    <td style={tdStyle}>{c.NumCacheNodes}</td>
                    <td style={tdStyle}>
                      <span style={{ color: c.CacheClusterStatus === 'available' ? '#1d8102' : '#ff9900', fontWeight: 700 }}>{c.CacheClusterStatus}</span>
                    </td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeCluster(c.CacheClusterId)}>Delete</button>
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
                <label className="aws-form-label">Cluster ID</label>
                <input className="aws-form-input" value={clusterId} onChange={(e) => setClusterId(e.target.value)} placeholder="my-redis-cluster" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Engine</label>
                <select className="aws-form-select" value={engine} onChange={(e) => setEngine(e.target.value as 'redis' | 'memcached')}>
                  <option value="redis">Redis</option>
                  <option value="memcached">Memcached</option>
                </select>
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Engine version</label>
                <select className="aws-form-select" value={engineVersion} onChange={(e) => setEngineVersion(e.target.value)}>
                  {engine === 'redis' ? (
                    <>
                      <option value="7.0">7.0</option>
                      <option value="6.2">6.2</option>
                      <option value="6.0">6.0</option>
                    </>
                  ) : (
                    <>
                      <option value="1.6.22">1.6.22</option>
                      <option value="1.6.17">1.6.17</option>
                    </>
                  )}
                </select>
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Node type</label>
                <select className="aws-form-select" value={nodeType} onChange={(e) => setNodeType(e.target.value)}>
                  {ELASTICACHE_NODE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Number of nodes</label>
                <input className="aws-form-input" type="number" min="1" max="6" value={numNodes} onChange={(e) => setNumNodes(e.target.value)} />
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
