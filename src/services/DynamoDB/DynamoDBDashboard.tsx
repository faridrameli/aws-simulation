import { useState } from 'react';
import { useDynamoStore } from '../../store';
import type { DynamoDBTable } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';

export default function DynamoDBDashboard() {
  const tables = useDynamoStore((s) => s.tables);
  const addTable = useDynamoStore((s) => s.addTable);
  const removeTable = useDynamoStore((s) => s.removeTable);
  const [showCreate, setShowCreate] = useState(false);
  const [tableName, setTableName] = useState('');
  const [partitionKey, setPartitionKey] = useState('');
  const [partitionKeyType, setPartitionKeyType] = useState<'S' | 'N' | 'B'>('S');
  const [billingMode, setBillingMode] = useState<'PAY_PER_REQUEST' | 'PROVISIONED'>('PAY_PER_REQUEST');

  const activeCount = tables.filter((t) => t.TableStatus === 'ACTIVE').length;

  function handleCreate() {
    if (!tableName || !partitionKey) return;
    const table: DynamoDBTable = {
      TableName: tableName,
      TableStatus: 'ACTIVE',
      TableArn: generateARN('dynamodb', `table/${tableName}`),
      CreationDateTime: new Date().toISOString(),
      KeySchema: [{ AttributeName: partitionKey, KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: partitionKey, AttributeType: partitionKeyType }],
      BillingMode: billingMode,
      ItemCount: 0,
      TableSizeBytes: 0,
      Tags: [],
      Items: [],
    };
    addTable(table);
    setTableName('');
    setPartitionKey('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>DynamoDB Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Tables</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{tables.length}</div>
          <div style={{ fontSize: '12px', color: '#545b64', marginTop: '4px' }}>
            <span style={{ color: '#1d8102' }}>{activeCount} active</span>
          </div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Tables</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create table</button>
        </div>
        <div className="aws-panel-body">
          {tables.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No tables</h3>
              <p>You don't have any DynamoDB tables in this region.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Table name</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Partition key</th>
                  <th style={thStyle}>Billing mode</th>
                  <th style={thStyle}>Items</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((t) => (
                  <tr key={t.TableName} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{t.TableName}</span></td>
                    <td style={tdStyle}><StatusDot status={t.TableStatus} /></td>
                    <td style={tdStyle}>{t.KeySchema[0]?.AttributeName} ({t.AttributeDefinitions[0]?.AttributeType})</td>
                    <td style={tdStyle}>{t.BillingMode === 'PAY_PER_REQUEST' ? 'On-demand' : 'Provisioned'}</td>
                    <td style={tdStyle}>{t.ItemCount}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeTable(t.TableName)}>Delete</button>
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
            <div className="aws-modal-header"><h2>Create table</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Table name</label>
                <input className="aws-form-input" value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="MyTable" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Partition key</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="aws-form-input" style={{ flex: 1 }} value={partitionKey} onChange={(e) => setPartitionKey(e.target.value)} placeholder="id" />
                  <select className="aws-form-select" style={{ width: '120px' }} value={partitionKeyType} onChange={(e) => setPartitionKeyType(e.target.value as 'S' | 'N' | 'B')}>
                    <option value="S">String</option>
                    <option value="N">Number</option>
                    <option value="B">Binary</option>
                  </select>
                </div>
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Billing mode</label>
                <select className="aws-form-select" value={billingMode} onChange={(e) => setBillingMode(e.target.value as 'PAY_PER_REQUEST' | 'PROVISIONED')}>
                  <option value="PAY_PER_REQUEST">On-demand</option>
                  <option value="PROVISIONED">Provisioned</option>
                </select>
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Create table</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'ACTIVE' ? '#1d8102' : status === 'CREATING' ? '#ff9900' : '#d13212';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
      {status}
    </span>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
