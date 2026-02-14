import { useState } from 'react';
import { useDynamoStore } from '../../store';
import type { DynamoDBTable } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import StatusBadge from '../../components/shared/StatusBadge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Tables() {
  const tables = useDynamoStore((s) => s.tables);
  const addTable = useDynamoStore((s) => s.addTable);
  const removeTable = useDynamoStore((s) => s.removeTable);
  const [selected, setSelected] = useState<DynamoDBTable[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [tableName, setTableName] = useState('');
  const [partitionKey, setPartitionKey] = useState('');
  const [partitionKeyType, setPartitionKeyType] = useState<'S' | 'N' | 'B'>('S');
  const [billingMode, setBillingMode] = useState<'PAY_PER_REQUEST' | 'PROVISIONED'>('PAY_PER_REQUEST');

  const columns: Column<DynamoDBTable>[] = [
    { key: 'TableName', header: 'Table name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.TableName}</span> },
    { key: 'TableStatus', header: 'Status', render: (item) => <StatusBadge status={item.TableStatus.toLowerCase()} /> },
    { key: 'PartitionKey', header: 'Partition key', render: (item) => `${item.KeySchema[0]?.AttributeName} (${item.AttributeDefinitions[0]?.AttributeType})` },
    { key: 'BillingMode', header: 'Billing mode', render: (item) => item.BillingMode === 'PAY_PER_REQUEST' ? 'On-demand' : 'Provisioned' },
    { key: 'ItemCount', header: 'Items' },
    { key: 'TableSizeBytes', header: 'Size (bytes)' },
  ];

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

  function handleDelete() {
    selected.forEach((t) => removeTable(t.TableName));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={tables as unknown as Record<string, unknown>[]}
        keyField="TableName"
        title="Tables"
        onSelectionChange={(items) => setSelected(items as unknown as DynamoDBTable[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
            <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>Create table</button>
          </div>
        }
      />
      <ConfirmDialog isOpen={showDelete} title="Delete tables" message={`Delete ${selected.length} table(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />

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
