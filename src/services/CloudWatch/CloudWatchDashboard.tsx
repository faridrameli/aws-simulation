import { useState } from 'react';
import { useCloudWatchStore } from '../../store';
import type { CloudWatchAlarm, CloudWatchLogGroup } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';

export default function CloudWatchDashboard() {
  const alarms = useCloudWatchStore((s) => s.alarms);
  const logGroups = useCloudWatchStore((s) => s.logGroups);
  const dashboards = useCloudWatchStore((s) => s.dashboards);
  const addAlarm = useCloudWatchStore((s) => s.addAlarm);
  const removeAlarm = useCloudWatchStore((s) => s.removeAlarm);
  const addLogGroup = useCloudWatchStore((s) => s.addLogGroup);
  const removeLogGroup = useCloudWatchStore((s) => s.removeLogGroup);
  const [tab, setTab] = useState<'alarms' | 'logs' | 'dashboards'>('alarms');
  const [showCreateAlarm, setShowCreateAlarm] = useState(false);
  const [showCreateLog, setShowCreateLog] = useState(false);

  // Alarm form
  const [alarmName, setAlarmName] = useState('');
  const [metricName, setMetricName] = useState('CPUUtilization');
  const [threshold, setThreshold] = useState('80');

  // Log group form
  const [logGroupName, setLogGroupName] = useState('');
  const [retention, setRetention] = useState('30');

  const okAlarms = alarms.filter((a) => a.State === 'OK').length;
  const inAlarm = alarms.filter((a) => a.State === 'ALARM').length;

  function handleCreateAlarm() {
    if (!alarmName) return;
    const alarm: CloudWatchAlarm = {
      AlarmName: alarmName,
      AlarmArn: generateARN('cloudwatch', `alarm:${alarmName}`),
      AlarmDescription: '',
      MetricName: metricName,
      Namespace: 'AWS/EC2',
      Statistic: 'Average',
      Period: 300,
      EvaluationPeriods: 1,
      Threshold: Number(threshold),
      ComparisonOperator: 'GreaterThanThreshold',
      State: 'OK',
      ActionsEnabled: true,
      Tags: [],
    };
    addAlarm(alarm);
    setAlarmName('');
    setShowCreateAlarm(false);
  }

  function handleCreateLogGroup() {
    if (!logGroupName) return;
    const lg: CloudWatchLogGroup = {
      LogGroupName: logGroupName,
      Arn: generateARN('logs', `log-group:${logGroupName}`),
      CreationTime: new Date().toISOString(),
      RetentionInDays: Number(retention) || null,
      StoredBytes: 0,
      Tags: [],
    };
    addLogGroup(lg);
    setLogGroupName('');
    setShowCreateLog(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>CloudWatch Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Alarms</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{alarms.length}</div>
          <div style={{ fontSize: '12px', color: '#545b64', marginTop: '4px' }}>
            <span style={{ color: '#1d8102' }}>{okAlarms} OK</span>{' | '}
            <span style={{ color: '#d13212' }}>{inAlarm} In alarm</span>
          </div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Log groups</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{logGroups.length}</div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Dashboards</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{dashboards.length}</div>
        </div>
      </div>

      <div className="aws-tabs">
        <button className={`aws-tab ${tab === 'alarms' ? 'aws-tab-active' : ''}`} onClick={() => setTab('alarms')}>Alarms</button>
        <button className={`aws-tab ${tab === 'logs' ? 'aws-tab-active' : ''}`} onClick={() => setTab('logs')}>Log groups</button>
        <button className={`aws-tab ${tab === 'dashboards' ? 'aws-tab-active' : ''}`} onClick={() => setTab('dashboards')}>Dashboards</button>
      </div>

      {tab === 'alarms' && (
        <div className="aws-panel">
          <div className="aws-panel-header">
            <h2>Alarms</h2>
            <button className="aws-btn aws-btn-primary" onClick={() => setShowCreateAlarm(true)}>Create alarm</button>
          </div>
          <div className="aws-panel-body">
            {alarms.length === 0 ? (
              <div className="aws-empty-state">
                <h3>No alarms</h3>
                <p>Create an alarm to monitor your AWS resources.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>State</th>
                    <th style={thStyle}>Metric</th>
                    <th style={thStyle}>Threshold</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alarms.map((a) => (
                    <tr key={a.AlarmName} style={{ borderBottom: '1px solid #eaeded' }}>
                      <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{a.AlarmName}</span></td>
                      <td style={tdStyle}>
                        <span style={{ color: a.State === 'OK' ? '#1d8102' : a.State === 'ALARM' ? '#d13212' : '#ff9900', fontWeight: 700 }}>
                          {a.State}
                        </span>
                      </td>
                      <td style={tdStyle}>{a.MetricName}</td>
                      <td style={tdStyle}>{a.ComparisonOperator} {a.Threshold}</td>
                      <td style={tdStyle}>
                        <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeAlarm(a.AlarmName)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'logs' && (
        <div className="aws-panel">
          <div className="aws-panel-header">
            <h2>Log groups</h2>
            <button className="aws-btn aws-btn-primary" onClick={() => setShowCreateLog(true)}>Create log group</button>
          </div>
          <div className="aws-panel-body">
            {logGroups.length === 0 ? (
              <div className="aws-empty-state">
                <h3>No log groups</h3>
                <p>Log groups will appear here when created.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                    <th style={thStyle}>Log group name</th>
                    <th style={thStyle}>Retention</th>
                    <th style={thStyle}>Stored bytes</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logGroups.map((lg) => (
                    <tr key={lg.LogGroupName} style={{ borderBottom: '1px solid #eaeded' }}>
                      <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{lg.LogGroupName}</span></td>
                      <td style={tdStyle}>{lg.RetentionInDays ? `${lg.RetentionInDays} days` : 'Never expire'}</td>
                      <td style={tdStyle}>{lg.StoredBytes} bytes</td>
                      <td style={tdStyle}>
                        <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeLogGroup(lg.LogGroupName)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'dashboards' && (
        <div className="aws-panel">
          <div className="aws-panel-header">
            <h2>Dashboards</h2>
          </div>
          <div className="aws-panel-body">
            {dashboards.length === 0 ? (
              <div className="aws-empty-state">
                <h3>No dashboards</h3>
                <p>CloudWatch dashboards will appear here.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Last modified</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboards.map((d) => (
                    <tr key={d.DashboardName} style={{ borderBottom: '1px solid #eaeded' }}>
                      <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{d.DashboardName}</span></td>
                      <td style={tdStyle}>{new Date(d.LastModified).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {showCreateAlarm && (
        <div className="aws-modal-overlay" onClick={() => setShowCreateAlarm(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create alarm</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Alarm name</label>
                <input className="aws-form-input" value={alarmName} onChange={(e) => setAlarmName(e.target.value)} />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Metric name</label>
                <select className="aws-form-select" value={metricName} onChange={(e) => setMetricName(e.target.value)}>
                  <option>CPUUtilization</option>
                  <option>NetworkIn</option>
                  <option>NetworkOut</option>
                  <option>DiskReadOps</option>
                  <option>DiskWriteOps</option>
                  <option>StatusCheckFailed</option>
                </select>
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Threshold</label>
                <input className="aws-form-input" type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreateAlarm(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreateAlarm}>Create alarm</button>
            </div>
          </div>
        </div>
      )}

      {showCreateLog && (
        <div className="aws-modal-overlay" onClick={() => setShowCreateLog(false)}>
          <div className="aws-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aws-modal-header"><h2>Create log group</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Log group name</label>
                <input className="aws-form-input" value={logGroupName} onChange={(e) => setLogGroupName(e.target.value)} placeholder="/aws/lambda/my-function" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Retention (days)</label>
                <select className="aws-form-select" value={retention} onChange={(e) => setRetention(e.target.value)}>
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">365 days</option>
                  <option value="">Never expire</option>
                </select>
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreateLog(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreateLogGroup}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
