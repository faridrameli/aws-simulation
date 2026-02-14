import { useState } from 'react';
import { useRoute53Store } from '../../store';
import type { HostedZone } from '../../types/aws';
import { generateId } from '../../utils/idGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function HostedZones() {
  const hostedZones = useRoute53Store((s) => s.hostedZones);
  const addHostedZone = useRoute53Store((s) => s.addHostedZone);
  const removeHostedZone = useRoute53Store((s) => s.removeHostedZone);
  const [selected, setSelected] = useState<HostedZone[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [comment, setComment] = useState('');
  const [zoneType, setZoneType] = useState<'Public' | 'Private'>('Public');

  const columns: Column<HostedZone>[] = [
    { key: 'Name', header: 'Domain name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.Name}</span> },
    { key: 'Type', header: 'Type' },
    { key: 'RecordSetCount', header: 'Record count' },
    { key: 'Comment', header: 'Comment', render: (item) => item.Comment || '-' },
    { key: 'Id', header: 'Hosted zone ID' },
  ];

  function handleCreate() {
    if (!domainName) return;
    addHostedZone({
      Id: generateId('hostedzone'), Name: domainName.endsWith('.') ? domainName : `${domainName}.`, Type: zoneType,
      RecordSetCount: 2, Comment: comment, Tags: [],
      Records: [
        { Name: domainName, Type: 'NS', TTL: 172800, Value: 'ns-001.awsdns-01.com.' },
        { Name: domainName, Type: 'SOA', TTL: 900, Value: 'ns-001.awsdns-01.com. hostmaster.example.com. 1 7200 900 1209600 86400' },
      ],
    });
    setDomainName(''); setComment(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((z) => removeHostedZone(z.Id)); setSelected([]); setShowDelete(false); }

  return (
    <div data-mission="route53-zones-list">
      <ResourceTable columns={columns} data={hostedZones as unknown as Record<string, unknown>[]} keyField="Id" title="Hosted zones"
        onSelectionChange={(items) => setSelected(items as unknown as HostedZone[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" data-mission="route53-create-btn" onClick={() => setShowCreate(true)}>Create hosted zone</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete hosted zones" message={`Delete ${selected.length} hosted zone(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create hosted zone</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Domain name</label><input className="aws-form-input" value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder="example.com" /></div>
              <div className="aws-form-group"><label className="aws-form-label">Comment</label><input className="aws-form-input" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
              <div className="aws-form-group"><label className="aws-form-label">Type</label>
                <select className="aws-form-select" value={zoneType} onChange={(e) => setZoneType(e.target.value as 'Public' | 'Private')}><option value="Public">Public</option><option value="Private">Private</option></select>
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
