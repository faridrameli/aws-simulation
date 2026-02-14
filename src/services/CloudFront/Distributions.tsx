import { useState } from 'react';
import { useCloudFrontStore } from '../../store';
import type { CFDistribution } from '../../types/aws';
import { generateId } from '../../utils/idGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Distributions() {
  const distributions = useCloudFrontStore((s) => s.distributions);
  const addDistribution = useCloudFrontStore((s) => s.addDistribution);
  const removeDistribution = useCloudFrontStore((s) => s.removeDistribution);
  const [selected, setSelected] = useState<CFDistribution[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [originDomain, setOriginDomain] = useState('');
  const [comment, setComment] = useState('');
  const [priceClass, setPriceClass] = useState<'PriceClass_All' | 'PriceClass_200' | 'PriceClass_100'>('PriceClass_All');

  const columns: Column<CFDistribution>[] = [
    { key: 'DistributionId', header: 'ID', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.DistributionId}</span> },
    { key: 'DomainName', header: 'Domain name' },
    { key: 'Origin', header: 'Origin', render: (item) => item.Origins[0]?.DomainName || '-' },
    { key: 'Status', header: 'Status', render: (item) => <span style={{ color: item.Status === 'Deployed' ? '#1d8102' : '#ff9900', fontWeight: 700 }}>{item.Status}</span> },
    { key: 'PriceClass', header: 'Price class', render: (item) => item.PriceClass.replace('PriceClass_', 'Class ') },
  ];

  function handleCreate() {
    if (!originDomain) return;
    const distId = generateId('cloudfront');
    addDistribution({ DistributionId: distId, DomainName: `${distId.toLowerCase()}.cloudfront.net`, Status: 'Deployed', Enabled: true, Origins: [{ DomainName: originDomain, Id: `S3-${originDomain}`, OriginPath: '' }], DefaultCacheBehavior: 'CachingOptimized', PriceClass: priceClass, Comment: comment, LastModifiedTime: new Date().toISOString(), Tags: [] });
    setOriginDomain(''); setComment(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((d) => removeDistribution(d.DistributionId)); setSelected([]); setShowDelete(false); }

  return (
    <div data-mission="cloudfront-distributions-list">
      <ResourceTable columns={columns} data={distributions as unknown as Record<string, unknown>[]} keyField="DistributionId" title="Distributions"
        onSelectionChange={(items) => setSelected(items as unknown as CFDistribution[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" data-mission="cloudfront-create-btn" onClick={() => setShowCreate(true)}>Create distribution</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete distributions" message={`Delete ${selected.length} distribution(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create distribution</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Origin domain</label><input className="aws-form-input" value={originDomain} onChange={(e) => setOriginDomain(e.target.value)} placeholder="my-bucket.s3.amazonaws.com" /></div>
              <div className="aws-form-group"><label className="aws-form-label">Comment</label><input className="aws-form-input" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
              <div className="aws-form-group"><label className="aws-form-label">Price class</label>
                <select className="aws-form-select" value={priceClass} onChange={(e) => setPriceClass(e.target.value as typeof priceClass)}>
                  <option value="PriceClass_All">All edge locations</option><option value="PriceClass_200">NA, Europe, Asia, ME, Africa</option><option value="PriceClass_100">NA and Europe only</option>
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
