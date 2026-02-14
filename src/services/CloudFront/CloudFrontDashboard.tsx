import { useState } from 'react';
import { useCloudFrontStore } from '../../store';
import type { CFDistribution } from '../../types/aws';
import { generateId } from '../../utils/idGenerator';

export default function CloudFrontDashboard() {
  const distributions = useCloudFrontStore((s) => s.distributions);
  const addDistribution = useCloudFrontStore((s) => s.addDistribution);
  const removeDistribution = useCloudFrontStore((s) => s.removeDistribution);
  const [showCreate, setShowCreate] = useState(false);
  const [originDomain, setOriginDomain] = useState('');
  const [comment, setComment] = useState('');
  const [priceClass, setPriceClass] = useState<'PriceClass_All' | 'PriceClass_200' | 'PriceClass_100'>('PriceClass_All');

  const deployed = distributions.filter((d) => d.Status === 'Deployed').length;

  function handleCreate() {
    if (!originDomain) return;
    const distId = generateId('cloudfront');
    const dist: CFDistribution = {
      DistributionId: distId,
      DomainName: `${distId.toLowerCase()}.cloudfront.net`,
      Status: 'Deployed',
      Enabled: true,
      Origins: [{ DomainName: originDomain, Id: `S3-${originDomain}`, OriginPath: '' }],
      DefaultCacheBehavior: 'CachingOptimized',
      PriceClass: priceClass,
      Comment: comment,
      LastModifiedTime: new Date().toISOString(),
      Tags: [],
    };
    addDistribution(dist);
    setOriginDomain('');
    setComment('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>CloudFront Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Distributions</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{distributions.length}</div>
          <div style={{ fontSize: '12px', color: '#1d8102', marginTop: '4px' }}>{deployed} deployed</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Distributions</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create distribution</button>
        </div>
        <div className="aws-panel-body">
          {distributions.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No distributions</h3>
              <p>Create a CloudFront distribution to deliver content with low latency and high transfer speeds.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Distribution ID</th>
                  <th style={thStyle}>Domain name</th>
                  <th style={thStyle}>Origin</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Price class</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {distributions.map((d) => (
                  <tr key={d.DistributionId} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{d.DistributionId}</span></td>
                    <td style={tdStyle}><span style={{ fontSize: '12px' }}>{d.DomainName}</span></td>
                    <td style={tdStyle}><span style={{ fontSize: '12px' }}>{d.Origins[0]?.DomainName}</span></td>
                    <td style={tdStyle}>
                      <span style={{ color: d.Status === 'Deployed' ? '#1d8102' : '#ff9900', fontWeight: 700 }}>{d.Status}</span>
                    </td>
                    <td style={tdStyle}>{d.PriceClass.replace('PriceClass_', 'Class ')}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeDistribution(d.DistributionId)}>Delete</button>
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
            <div className="aws-modal-header"><h2>Create distribution</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Origin domain</label>
                <input className="aws-form-input" value={originDomain} onChange={(e) => setOriginDomain(e.target.value)} placeholder="my-bucket.s3.amazonaws.com" />
                <div className="aws-form-hint">The DNS domain name of the S3 bucket or custom origin.</div>
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Comment</label>
                <input className="aws-form-input" value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Price class</label>
                <select className="aws-form-select" value={priceClass} onChange={(e) => setPriceClass(e.target.value as typeof priceClass)}>
                  <option value="PriceClass_All">Use all edge locations (best performance)</option>
                  <option value="PriceClass_200">Use North America, Europe, Asia, Middle East, Africa</option>
                  <option value="PriceClass_100">Use only North America and Europe</option>
                </select>
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Create distribution</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
