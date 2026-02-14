import { useState } from 'react';
import { useRoute53Store } from '../../store';
import type { HostedZone } from '../../types/aws';
import { generateId } from '../../utils/idGenerator';

export default function Route53Dashboard() {
  const hostedZones = useRoute53Store((s) => s.hostedZones);
  const addHostedZone = useRoute53Store((s) => s.addHostedZone);
  const removeHostedZone = useRoute53Store((s) => s.removeHostedZone);
  const [showCreate, setShowCreate] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [comment, setComment] = useState('');
  const [zoneType, setZoneType] = useState<'Public' | 'Private'>('Public');

  function handleCreate() {
    if (!domainName) return;
    const zone: HostedZone = {
      Id: generateId('hostedzone'),
      Name: domainName.endsWith('.') ? domainName : `${domainName}.`,
      Type: zoneType,
      RecordSetCount: 2,
      Comment: comment,
      Records: [
        { Name: domainName, Type: 'NS', TTL: 172800, Value: 'ns-001.awsdns-01.com.' },
        { Name: domainName, Type: 'SOA', TTL: 900, Value: 'ns-001.awsdns-01.com. hostmaster.example.com. 1 7200 900 1209600 86400' },
      ],
      Tags: [],
    };
    addHostedZone(zone);
    setDomainName('');
    setComment('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>Route 53 Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Hosted zones</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{hostedZones.length}</div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Total records</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{hostedZones.reduce((s, z) => s + z.Records.length, 0)}</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Hosted zones</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create hosted zone</button>
        </div>
        <div className="aws-panel-body">
          {hostedZones.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No hosted zones</h3>
              <p>Create a hosted zone to start managing DNS records.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Domain name</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Record count</th>
                  <th style={thStyle}>Comment</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hostedZones.map((z) => (
                  <tr key={z.Id} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{z.Name}</span></td>
                    <td style={tdStyle}>{z.Type}</td>
                    <td style={tdStyle}>{z.RecordSetCount}</td>
                    <td style={tdStyle}>{z.Comment || '-'}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeHostedZone(z.Id)}>Delete</button>
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
            <div className="aws-modal-header"><h2>Create hosted zone</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Domain name</label>
                <input className="aws-form-input" value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder="example.com" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Comment</label>
                <input className="aws-form-input" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional description" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Type</label>
                <select className="aws-form-select" value={zoneType} onChange={(e) => setZoneType(e.target.value as 'Public' | 'Private')}>
                  <option value="Public">Public hosted zone</option>
                  <option value="Private">Private hosted zone</option>
                </select>
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Create hosted zone</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
