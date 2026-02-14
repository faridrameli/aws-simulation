import { useState } from 'react';
import { useElasticBeanstalkStore } from '../../store';
import type { EBApplication } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';

export default function ElasticBeanstalkDashboard() {
  const applications = useElasticBeanstalkStore((s) => s.applications);
  const addApplication = useElasticBeanstalkStore((s) => s.addApplication);
  const removeApplication = useElasticBeanstalkStore((s) => s.removeApplication);
  const [showCreate, setShowCreate] = useState(false);
  const [appName, setAppName] = useState('');
  const [description, setDescription] = useState('');

  const totalEnvs = applications.reduce((s, a) => s + a.Environments.length, 0);

  function handleCreate() {
    if (!appName) return;
    const app: EBApplication = {
      ApplicationName: appName,
      ApplicationArn: generateARN('elasticbeanstalk', `application/${appName}`),
      Description: description,
      DateCreated: new Date().toISOString(),
      DateUpdated: new Date().toISOString(),
      Environments: [],
      Tags: [],
    };
    addApplication(app);
    setAppName('');
    setDescription('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>Elastic Beanstalk Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Applications</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{applications.length}</div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Environments</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{totalEnvs}</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Applications</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create application</button>
        </div>
        <div className="aws-panel-body">
          {applications.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No applications</h3>
              <p>Create an Elastic Beanstalk application to deploy and manage web applications.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Application name</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Environments</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.ApplicationName} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{a.ApplicationName}</span></td>
                    <td style={tdStyle}>{a.Description || '-'}</td>
                    <td style={tdStyle}>{a.Environments.length}</td>
                    <td style={tdStyle}>{new Date(a.DateCreated).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeApplication(a.ApplicationName)}>Delete</button>
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
            <div className="aws-modal-header"><h2>Create application</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Application name</label>
                <input className="aws-form-input" value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="my-web-app" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Description</label>
                <input className="aws-form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="aws-alert aws-alert-info">
                <strong>Note:</strong> After creating an application, you would typically create an environment with a platform (Node.js, Python, Java, etc.) and deploy your code.
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

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
