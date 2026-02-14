import { useState } from 'react';
import { useSNSStore } from '../../store';
import type { SNSTopic } from '../../types/aws';
import { generateARN } from '../../utils/arnGenerator';

export default function SNSDashboard() {
  const topics = useSNSStore((s) => s.topics);
  const addTopic = useSNSStore((s) => s.addTopic);
  const removeTopic = useSNSStore((s) => s.removeTopic);
  const [showCreate, setShowCreate] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [displayName, setDisplayName] = useState('');

  const totalSubs = topics.reduce((s, t) => s + t.SubscriptionCount, 0);

  function handleCreate() {
    if (!topicName) return;
    const arn = generateARN('sns', topicName);
    const topic: SNSTopic = {
      TopicArn: arn,
      TopicName: topicName,
      DisplayName: displayName || topicName,
      SubscriptionCount: 0,
      Subscriptions: [],
      Tags: [],
      CreatedTime: new Date().toISOString(),
    };
    addTopic(topic);
    setTopicName('');
    setDisplayName('');
    setShowCreate(false);
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>SNS Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Topics</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{topics.length}</div>
        </div>
        <div className="aws-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '13px', color: '#545b64', marginBottom: '4px' }}>Subscriptions</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#16191f' }}>{totalSubs}</div>
        </div>
      </div>

      <div className="aws-panel">
        <div className="aws-panel-header">
          <h2>Topics</h2>
          <button className="aws-btn aws-btn-primary" onClick={() => setShowCreate(true)}>Create topic</button>
        </div>
        <div className="aws-panel-body">
          {topics.length === 0 ? (
            <div className="aws-empty-state">
              <h3>No topics</h3>
              <p>Create an SNS topic to start publishing messages to subscribers.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ borderBottom: '2px solid #d5dbdb' }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Display name</th>
                  <th style={thStyle}>Subscriptions</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((t) => (
                  <tr key={t.TopicArn} style={{ borderBottom: '1px solid #eaeded' }}>
                    <td style={tdStyle}><span style={{ color: '#0073bb', fontWeight: 700 }}>{t.TopicName}</span></td>
                    <td style={tdStyle}>{t.DisplayName}</td>
                    <td style={tdStyle}>{t.SubscriptionCount}</td>
                    <td style={tdStyle}>{new Date(t.CreatedTime).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <button className="aws-btn aws-btn-sm aws-btn-danger" onClick={() => removeTopic(t.TopicArn)}>Delete</button>
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
            <div className="aws-modal-header"><h2>Create topic</h2></div>
            <div className="aws-modal-body">
              <div className="aws-form-group">
                <label className="aws-form-label">Topic name</label>
                <input className="aws-form-input" value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="my-topic" />
              </div>
              <div className="aws-form-group">
                <label className="aws-form-label">Display name</label>
                <input className="aws-form-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Optional display name" />
                <div className="aws-form-hint">Used as the 'from' field for notifications sent to email endpoints.</div>
              </div>
            </div>
            <div className="aws-modal-footer">
              <button className="aws-btn aws-btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="aws-btn aws-btn-primary" onClick={handleCreate}>Create topic</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '13px', color: '#545b64', fontWeight: 700 };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '13px' };
