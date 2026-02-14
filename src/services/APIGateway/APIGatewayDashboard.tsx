import { useState } from 'react';
import { useAPIGatewayStore } from '../../store';
import type { APIGatewayAPI } from '../../types/aws';
import { generateId } from '../../utils/idGenerator';

export default function APIGatewayDashboard() {
  const apis = useAPIGatewayStore((s) => s.apis);
  const addAPI = useAPIGatewayStore((s) => s.addAPI);
  const removeAPI = useAPIGatewayStore((s) => s.removeAPI);
  const [showCreate, setShowCreate] = useState(false);
  const [apiName, setApiName] = useState('');
  const [description, setDescription] = useState('');
  const [protocol, setProtocol] = useState<'REST' | 'HTTP' | 'WEBSOCKET'>('REST');

  function handleCreate() {
    if (!apiName) return;
    const apiId = generateId('apigateway');
    const api: APIGatewayAPI = {
      ApiId: apiId,
      Name: apiName,
      Description: description,
      Protocol: protocol,
      CreatedDate: new Date().toISOString(),
      Endpoint: `https://${apiId}.execute-api.us-east-1.amazonaws.com`,
      Stages: [],
      Routes: [],
      Tags: [],
    };
    addAPI(api);
    setApiName('');
    setDescription('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>API Gateway Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>APIs</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{apis.length}</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>APIs</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create API</button>
        </div>
        <div className="aws-panel-body">
          {apis.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No APIs</h3>
              <p>Create an API to build, deploy, and manage RESTful or WebSocket APIs.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Protocol</th>
                  <th style={thStyle}>Endpoint</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apis.map((a) => (
                  <tr key={a.ApiId} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{a.Name}</span></td>
                    <td style={tdStyle}>{a.Protocol}</td>
                    <td style={tdStyle}><span style={{ fontSize: '12px', color: '#545b64' }}>{a.Endpoint}</span></td>
                    <td style={tdStyle}>{new Date(a.CreatedDate).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeAPI(a.ApiId)}>Delete</button>
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
            <div className="aws-modal-header"><h2>Create API</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">API name</label>
                <input className="aws-form-input" value={apiName} onChange={(e) => setApiName(e.target.value)} placeholder="my-api" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Description</label>
                <input className="aws-form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Protocol type</label>
                <select className="aws-form-select" value={protocol} onChange={(e) => setProtocol(e.target.value as 'REST' | 'HTTP' | 'WEBSOCKET')}>
                  <option value="REST">REST API</option>
                  <option value="HTTP">HTTP API</option>
                  <option value="WEBSOCKET">WebSocket API</option>
                </select>
                <div className="aws-form-hint">
                  {protocol === 'REST' && 'Full-featured API with request validation, API keys, and caching.'}
                  {protocol === 'HTTP' && 'Lower latency and cost, ideal for simple HTTP proxy and Lambda integrations.'}
                  {protocol === 'WEBSOCKET' && 'Two-way communication for real-time applications like chat.'}
                </div>
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Create API</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
