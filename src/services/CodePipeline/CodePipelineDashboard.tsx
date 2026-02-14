import { useState } from 'react';
import { useCodePipelineStore } from '../../store';
import type { Pipeline } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';

export default function CodePipelineDashboard() {
  const pipelines = useCodePipelineStore((s) => s.pipelines);
  const addPipeline = useCodePipelineStore((s) => s.addPipeline);
  const removePipeline = useCodePipelineStore((s) => s.removePipeline);
  const [showCreate, setShowCreate] = useState(false);
  const [pipelineName, setPipelineName] = useState('');

  function handleCreate() {
    if (!pipelineName) return;
    const pipeline: Pipeline = {
      PipelineName: pipelineName,
      PipelineArn: generateARN('codepipeline', pipelineName),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      Stages: [
        {
          StageName: 'Source',
          Actions: [{ ActionName: 'SourceAction', ActionType: 'Source', Provider: 'CodeCommit', Status: 'Succeeded' }],
          Status: 'Succeeded',
        },
        {
          StageName: 'Build',
          Actions: [{ ActionName: 'BuildAction', ActionType: 'Build', Provider: 'CodeBuild', Status: 'Succeeded' }],
          Status: 'Succeeded',
        },
        {
          StageName: 'Deploy',
          Actions: [{ ActionName: 'DeployAction', ActionType: 'Deploy', Provider: 'CloudFormation', Status: 'Succeeded' }],
          Status: 'Succeeded',
        },
      ],
      Tags: [],
    };
    addPipeline(pipeline);
    setPipelineName('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>CodePipeline Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Pipelines</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{pipelines.length}</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Pipelines</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create pipeline</button>
        </div>
        <div className="aws-panel-body">
          {pipelines.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No pipelines</h3>
              <p>Create a pipeline to automate your release process.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Pipeline name</th>
                  <th style={thStyle}>Stages</th>
                  <th style={thStyle}>Last execution</th>
                  <th style={thStyle}>Updated</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pipelines.map((p) => {
                  const lastStage = p.Stages[p.Stages.length - 1];
                  return (
                    <tr key={p.PipelineName} style={{ borderBottom: '1px solid #eaeded' }}>
                      <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{p.PipelineName}</span></td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {p.Stages.map((s) => (
                            <span key={s.StageName} style={{
                              padding: '2px 8px',
                              fontSize: '11px',
                              borderRadius: '2px',
                              background: s.Status === 'Succeeded' ? '#f2f8f0' : s.Status === 'Failed' ? '#fdf3f1' : '#fef8f0',
                              color: s.Status === 'Succeeded' ? '#1d8102' : s.Status === 'Failed' ? '#d13212' : '#ff9900',
                              fontWeight: 700,
                            }}>
                              {s.StageName}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: lastStage?.Status === 'Succeeded' ? '#1d8102' : lastStage?.Status === 'Failed' ? '#d13212' : '#ff9900',
                          fontWeight: 700,
                        }}>
                          {lastStage?.Status || '-'}
                        </span>
                      </td>
                      <td style={tdStyle}>{new Date(p.UpdatedAt).toLocaleDateString()}</td>
                      <td style={tdStyle}>
                        <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removePipeline(p.PipelineName)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create pipeline</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Pipeline name</label>
                <input className="aws-form-input" value={pipelineName} onChange={(e) => setPipelineName(e.target.value)} placeholder="my-pipeline" />
              </div>
              <div className="aws-alert aws-alert-info">
                <strong>Note:</strong> This creates a pipeline with default Source → Build → Deploy stages. In a real AWS environment, you would configure each stage's provider and settings.
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Create pipeline</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
