import { useState } from 'react';
import { useElastiCacheStore } from '../../store';
import type { ElastiCacheCluster } from '../../types/aws';
import { ELASTICACHE_NODE_TYPES } from '../../utils/constants';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function ElastiCacheClusters() {
  const clusters = useElastiCacheStore((s) => s.clusters);
  const addCluster = useElastiCacheStore((s) => s.addCluster);
  const removeCluster = useElastiCacheStore((s) => s.removeCluster);
  const [selected, setSelected] = useState<ElastiCacheCluster[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [clusterId, setClusterId] = useState('');
  const [engine, setEngine] = useState<'redis' | 'memcached'>('redis');
  const [nodeType, setNodeType] = useState(ELASTICACHE_NODE_TYPES[0]);

  const columns: Column<ElastiCacheCluster>[] = [
    { key: 'CacheClusterId', header: 'Cluster ID', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.CacheClusterId}</span> },
    { key: 'Engine', header: 'Engine' },
    { key: 'EngineVersion', header: 'Version' },
    { key: 'CacheNodeType', header: 'Node type' },
    { key: 'NumCacheNodes', header: 'Nodes' },
    { key: 'CacheClusterStatus', header: 'Status', render: (item) => <span style={{ color: item.CacheClusterStatus === 'available' ? '#1d8102' : '#ff9900', fontWeight: 700 }}>{item.CacheClusterStatus}</span> },
  ];

  function handleCreate() {
    if (!clusterId) return;
    addCluster({ CacheClusterId: clusterId, CacheClusterStatus: 'available', Engine: engine, EngineVersion: engine === 'redis' ? '7.0' : '1.6.22', CacheNodeType: nodeType, NumCacheNodes: 1, PreferredAvailabilityZone: 'us-east-1a', CacheClusterCreateTime: new Date().toISOString(), Tags: [] });
    setClusterId(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((c) => removeCluster(c.CacheClusterId)); setSelected([]); setShowDelete(false); }

  return (
    <div>
      <ResourceTable columns={columns} data={clusters as unknown as Record<string, unknown>[]} keyField="CacheClusterId" title="Clusters"
        onSelectionChange={(items) => setSelected(items as unknown as ElastiCacheCluster[])}
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
              <div className="aws-form-group"><label className="aws-form-label">Cluster ID</label><input className="aws-form-input" value={clusterId} onChange={(e) => setClusterId(e.target.value)} placeholder="my-redis-cluster" /></div>
              <div className="aws-form-group"><label className="aws-form-label">Engine</label>
                <select className="aws-form-select" value={engine} onChange={(e) => setEngine(e.target.value as 'redis' | 'memcached')}><option value="redis">Redis</option><option value="memcached">Memcached</option></select>
              </div>
              <div className="aws-form-group"><label className="aws-form-label">Node type</label>
                <select className="aws-form-select" value={nodeType} onChange={(e) => setNodeType(e.target.value)}>
                  {ELASTICACHE_NODE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
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
