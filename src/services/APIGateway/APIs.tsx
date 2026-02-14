import { useState } from 'react';
import { useAPIGatewayStore } from '../../store';
import type { APIGatewayAPI } from '../../types/aws';
import { generateId } from '../../utils/idGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function APIs() {
  const apis = useAPIGatewayStore((s) => s.apis);
  const addAPI = useAPIGatewayStore((s) => s.addAPI);
  const removeAPI = useAPIGatewayStore((s) => s.removeAPI);
  const [selected, setSelected] = useState<APIGatewayAPI[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [apiName, setApiName] = useState('');
  const [description, setDescription] = useState('');
  const [protocol, setProtocol] = useState<'REST' | 'HTTP' | 'WEBSOCKET'>('REST');

  const columns: Column<APIGatewayAPI>[] = [
    { key: 'Name', header: 'Name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.Name}</span> },
    { key: 'Protocol', header: 'Protocol' },
    { key: 'Description', header: 'Description', render: (item) => item.Description || '-' },
    { key: 'Endpoint', header: 'Endpoint', render: (item) => <span style={{ fontSize: '12px', color: '#545b64' }}>{item.Endpoint}</span> },
    { key: 'CreatedDate', header: 'Created', render: (item) => new Date(item.CreatedDate).toLocaleDateString() },
  ];

  function handleCreate() {
    if (!apiName) return;
    const apiId = generateId('apigateway');
    addAPI({ ApiId: apiId, Name: apiName, Description: description, Protocol: protocol, CreatedDate: new Date().toISOString(), Endpoint: `https://${apiId}.execute-api.us-east-1.amazonaws.com`, Stages: [], Routes: [], Tags: [] });
    setApiName(''); setDescription(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((a) => removeAPI(a.ApiId)); setSelected([]); setShowDelete(false); }

  return (
    <div data-mission="apigateway-apis-list">
      <ResourceTable columns={columns} data={apis as unknown as Record<string, unknown>[]} keyField="ApiId" title="APIs"
        onSelectionChange={(items) => setSelected(items as unknown as APIGatewayAPI[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" data-mission="apigateway-create-btn" onClick={() => setShowCreate(true)}>Create API</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete APIs" message={`Delete ${selected.length} API(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create API</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">API name</label><input className="aws-form-input" value={apiName} onChange={(e) => setApiName(e.target.value)} /></div>
              <div className="aws-form-group"><label className="aws-form-label">Description</label><input className="aws-form-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
              <div className="aws-form-group"><label className="aws-form-label">Protocol</label>
                <select className="aws-form-select" value={protocol} onChange={(e) => setProtocol(e.target.value as 'REST' | 'HTTP' | 'WEBSOCKET')}>
                  <option value="REST">REST</option><option value="HTTP">HTTP</option><option value="WEBSOCKET">WebSocket</option>
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
