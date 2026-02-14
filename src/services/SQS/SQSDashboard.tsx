import { useState } from 'react';
import { useSQSStore } from '../../store';
import type { SQSQueue } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';
import { ACCOUNT_ID } from '../../utils/constants';

export default function SQSDashboard() {
  const queues = useSQSStore((s) => s.queues);
  const addQueue = useSQSStore((s) => s.addQueue);
  const removeQueue = useSQSStore((s) => s.removeQueue);
  const [showCreate, setShowCreate] = useState(false);
  const [queueName, setQueueName] = useState('');
  const [queueType, setQueueType] = useState<'Standard' | 'FIFO'>('Standard');
  const [visibilityTimeout, setVisibilityTimeout] = useState('30');

  function handleCreate() {
    if (!queueName) return;
    const finalName = queueType === 'FIFO' && !queueName.endsWith('.fifo') ? `${queueName}.fifo` : queueName;
    const queue: SQSQueue = {
      QueueUrl: `https://sqs.us-east-1.amazonaws.com/${ACCOUNT_ID}/${finalName}`,
      QueueName: finalName,
      QueueArn: generateARN('sqs', finalName),
      Type: queueType,
      VisibilityTimeout: Number(visibilityTimeout),
      MessageRetentionPeriod: 345600,
      MaxMessageSize: 262144,
      DelaySeconds: 0,
      MessagesAvailable: 0,
      MessagesInFlight: 0,
      CreatedTimestamp: new Date().toISOString(),
      Tags: [],
    };
    addQueue(queue);
    setQueueName('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>SQS Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Queues</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{queues.length}</div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Messages available</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{queues.reduce((s, q) => s + q.MessagesAvailable, 0)}</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Queues</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create queue</button>
        </div>
        <div className="aws-panel-body">
          {queues.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No queues</h3>
              <p>Create an SQS queue to start sending and receiving messages.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Messages available</th>
                  <th style={thStyle}>Messages in flight</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queues.map((q) => (
                  <tr key={q.QueueUrl} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{q.QueueName}</span></td>
                    <td style={tdStyle}>{q.Type}</td>
                    <td style={tdStyle}>{q.MessagesAvailable}</td>
                    <td style={tdStyle}>{q.MessagesInFlight}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeQueue(q.QueueUrl)}>Delete</button>
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
            <div className="aws-modal-header"><h2>Create queue</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Queue name</label>
                <input className="aws-form-input" value={queueName} onChange={(e) => setQueueName(e.target.value)} placeholder="my-queue" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Type</label>
                <select className="aws-form-select" value={queueType} onChange={(e) => setQueueType(e.target.value as 'Standard' | 'FIFO')}>
                  <option value="Standard">Standard</option>
                  <option value="FIFO">FIFO</option>
                </select>
                <div className="aws-form-hint">{queueType === 'FIFO' ? 'Exactly-once processing and ordering guarantees.' : 'Best-effort ordering, at-least-once delivery.'}</div>
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Visibility timeout (seconds)</label>
                <input className="aws-form-input" type="number" value={visibilityTimeout} onChange={(e) => setVisibilityTimeout(e.target.value)} />
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Create queue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
