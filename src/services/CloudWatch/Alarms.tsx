import { useState } from 'react';
import { useCloudWatchStore } from '../../store';
import type { CloudWatchAlarm } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';

export default function Alarms() {
  const alarms = useCloudWatchStore((s) => s.alarms);
  const addAlarm = useCloudWatchStore((s) => s.addAlarm);
  const removeAlarm = useCloudWatchStore((s) => s.removeAlarm);
  const [selected, setSelected] = useState<CloudWatchAlarm[]>([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [alarmName, setAlarmName] = useState('');
  const [metricName, setMetricName] = useState('CPUUtilization');
  const [threshold, setThreshold] = useState('80');

  const columns: Column<CloudWatchAlarm>[] = [
    { key: 'AlarmName', header: 'Alarm name', render: (item) => <span style={{ color: '#0073bb', fontWeight: 700 }}>{item.AlarmName}</span> },
    { key: 'State', header: 'State', render: (item) => <span style={{ color: item.State === 'OK' ? '#1d8102' : item.State === 'ALARM' ? '#d13212' : '#ff9900', fontWeight: 700 }}>{item.State}</span> },
    { key: 'MetricName', header: 'Metric' },
    { key: 'Namespace', header: 'Namespace' },
    { key: 'Threshold', header: 'Threshold', render: (item) => `${item.ComparisonOperator} ${item.Threshold}` },
  ];

  function handleCreate() {
    if (!alarmName) return;
    const alarm: CloudWatchAlarm = {
      AlarmName: alarmName, AlarmArn: generateARN('cloudwatch', `alarm:${alarmName}`),
      AlarmDescription: '', MetricName: metricName, Namespace: 'AWS/EC2', Statistic: 'Average',
      Period: 300, EvaluationPeriods: 1, Threshold: Number(threshold),
      ComparisonOperator: 'GreaterThanThreshold', State: 'OK', ActionsEnabled: true, Tags: [],
    };
    addAlarm(alarm);
    setAlarmName('');
    setShowCreate(false);
  }

  function handleDelete() { selected.forEach((a) => removeAlarm(a.AlarmName)); setSelected([]); setShowDelete(false); }

  return (
    <div data-mission="cloudwatch-alarms-list">
      <ResourceTable columns={columns} data={alarms as unknown as Record<string, unknown>[]} keyField="AlarmName" title="Alarms"
        onSelectionChange={(items) => setSelected(items as unknown as CloudWatchAlarm[])}
        actions={<div style={{ display: 'flex', gap: '8px' }}>
          <button className="aws-btn aws-btn-danger aws-btn-sm" disabled={selected.length === 0} onClick={() => setShowDelete(true)}>Delete</button>
          <button className="aws-btn aws-btn-primary aws-btn-sm" data-mission="cloudwatch-create-alarm-btn" onClick={() => setShowCreate(true)}>Create alarm</button>
        </div>}
      />
      <ConfirmDialog isOpen={showDelete} title="Delete alarms" message={`Delete ${selected.length} alarm(s)?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} danger />
      {showCreate && (
        <div className="aws-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create alarm</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group"><label className="aws-form-label">Alarm name</label><input className="aws-form-input" value={alarmName} onChange={(e) => setAlarmName(e.target.value)} /></div>
              <div className="aws-form-group"><label className="aws-form-label">Metric</label>
                <select className="aws-form-select" value={metricName} onChange={(e) => setMetricName(e.target.value)}>
                  <option>CPUUtilization</option><option>NetworkIn</option><option>NetworkOut</option><option>DiskReadOps</option><option>DiskWriteOps</option>
                </select>
              </div>
              <div className="aws-form-group"><label className="aws-form-label">Threshold</label><input className="aws-form-input" type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} /></div>
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
