import { useState } from 'react';
import { useCodePipelineStore } from '../../store';
import type { Pipeline } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Pipelines() {
  const pipelines = useCodePipelineStore((s) => s.pipelines);
  const addPipeline = useCodePipelineStore((s) => s.addPipeline);
  const removePipeline = useCodePipelineStore((s) => s.removePipeline);
  const [selected, setSelected] = useState<Pipeline[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [pipelineName, setPipelineName] = useState('');

  const columns: Column<Pipeline>[] = [
    { key: 'PipelineName', header: 'Pipeline name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.PipelineName}</span> },
    { key: 'Stages', header: 'Stages', render: (item) => (
      <div style={{ display: 'flex', gap: '4px' }}>
        {item.Stages.map((s) => (
          <span key={s.StageName} style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '2px', background: s.Status === 'Succeeded' ? '#f2f8f0' : s.Status === 'Failed' ? '#fdf3f1' : '#fef8f0', color: s.Status === 'Succeeded' ? '#1d8102' : s.Status === 'Failed' ? '#d13212' : '#ff9900', fontWeight: 700 }}>{s.StageName}</span>
        ))}
      </div>
    )},
    { key: 'LastExecution', header: 'Last execution', render: (item) => { const last = item.Stages[item.Stages.length - 1]; return <span style={{ color: last?.Status === 'Succeeded' ? '#1d8102' : '#d13212', fontWeight: 700 }}>{last?.Status || '-'}</span>; }},
    { key: 'UpdatedAt', header: 'Updated', render: (item) => new Date(item.UpdatedAt).toLocaleDateString() },
  ];

  function handleCreate() {
    if (!pipelineName) return;
    addPipeline({
      PipelineName: pipelineName, PipelineArn: generateARN('codepipeline', pipelineName),
      CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString(), Tags: [],
      Stages: [
        { StageName: 'Source', Actions: [{ ActionName: 'SourceAction', ActionType: 'Source', Provider: 'CodeCommit', Status: 'Succeeded' }], Status: 'Succeeded' },
        { StageName: 'Build', Actions: [{ ActionName: 'BuildAction', ActionType: 'Build', Provider: 'CodeBuild', Status: 'Succeeded' }], Status: 'Succeeded' },
        { StageName: 'Deploy', Actions: [{ ActionName: 'DeployAction', ActionType: 'Deploy', Provider: 'CloudFormation', Status: 'Succeeded' }], Status: 'Succeeded' },
      ],
    });
    setPipelineName(''); setShowCreate(false);
  }

  function handleDelete() { selected.forEach((p) => removePipeline(p.PipelineName)); setSelected([]); setShowDelete(false); }

  return (
    <div data-mission="codepipeline-pipelines-list">
      <ResourceTable columns={columns} data={pipelines as unknown as Record<string, unknown>[]} keyField="PipelineName" title="Pipelines"
        onSelectionChange={(items) => setSelected(items as unknown as Pipeline[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" data-mission="codepipeline-create-btn" onClick={() => setShowCreate(true)}>Create pipeline</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete pipelines" message={`Delete ${selected.length} pipeline(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create pipeline</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Pipeline name</label><input className="aws-form-input" value={pipelineName} onChange={(e) => setPipelineName(e.target.value)} placeholder="my-pipeline" /></div>
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
