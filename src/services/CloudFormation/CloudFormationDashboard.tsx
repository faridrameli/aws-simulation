import { useState } from 'react';
import { useCloudFormationStore } from '../../store';
import type { CFStack } from '../../types/aws';
import { v4 as uuidv4 } from 'uuid';

export default function CloudFormationDashboard() {
  const stacks = useCloudFormationStore((s) => s.stacks);
  const addStack = useCloudFormationStore((s) => s.addStack);
  const removeStack = useCloudFormationStore((s) => s.removeStack);
  const [showCreate, setShowCreate] = useState(false);
  const [stackName, setStackName] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('{\n  "AWSTemplateFormatVersion": "2010-09-09",\n  "Description": "",\n  "Resources": {}\n}');

  const complete = stacks.filter((s) => s.StackStatus.includes('COMPLETE')).length;

  function handleCreate() {
    if (!stackName) return;
    const stack: CFStack = {
      StackName: stackName,
      StackId: `arn:aws:cloudformation:us-east-1:123456789012:stack/${stackName}/${uuidv4()}`,
      StackStatus: 'CREATE_COMPLETE',
      CreationTime: new Date().toISOString(),
      Description: description,
      Template: template,
      Parameters: [],
      Outputs: [],
      Tags: [],
    };
    addStack(stack);
    setStackName('');
    setDescription('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>CloudFormation Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Stacks</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{stacks.length}</div>
          <div style={{ fontSize: '12px', color: '#545b64', marginTop: '4px' }}>
            <span style={{ color: '#1d8102' }}>{complete} complete</span>
          </div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Stacks</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create stack</button>
        </div>
        <div className="aws-panel-body">
          {stacks.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No stacks</h3>
              <p>You don't have any CloudFormation stacks. Create one to get started with Infrastructure as Code.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Stack name</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stacks.map((s) => (
                  <tr key={s.StackId} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{s.StackName}</span></td>
                    <td style={tdStyle}><StackStatus status={s.StackStatus} /></td>
                    <td style={tdStyle}>{s.Description || '-'}</td>
                    <td style={tdStyle}>{new Date(s.CreationTime).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeStack(s.StackId)}>Delete</button>
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
            <div className="aws-modal-header"><h2>Create stack</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Stack name</label>
                <input className="aws-form-input" value={stackName} onChange={(e) => setStackName(e.target.value)} placeholder="my-stack" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Description</label>
                <input className="aws-form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Template body (JSON)</label>
                <textarea
                  className="aws-form-input"
                  rows={8}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                />
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Create stack</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StackStatus({ status }: { status: string }) {
  const color = status.includes('COMPLETE') && !status.includes('FAILED') ? '#1d8102'
    : status.includes('IN_PROGRESS') ? '#ff9900'
    : '#d13212';
  return (
    <span style={{ color, fontWeight: 700, fontSize: '13px' }}>{status}</span>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
