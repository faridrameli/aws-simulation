import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRDSStore } from '../../store';
import DetailPanel from '../../components/shared/DetailPanel';
import { KeyValueDisplay } from '../../components/shared/FormFields';
import StatusBadge from '../../components/shared/StatusBadge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import type { RDSSnapshot } from '../../types/aws';

export default function DatabaseDetail() {
  const { dbId } = useParams<{ dbId: string }>();
  const instance = useRDSStore((s) => s.instances.find((i) => i.DBInstanceIdentifier === dbId));
  const updateInstance = useRDSStore((s) => s.updateInstance);
  const removeInstance = useRDSStore((s) => s.removeInstance);
  const snapshots = useRDSStore((s) => s.snapshots.filter((sn) => sn.DBInstanceIdentifier === dbId));
  const addSnapshot = useRDSStore((s) => s.addSnapshot);
  const removeSnapshot = useRDSStore((s) => s.removeSnapshot);
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);

  if (!instance) {
    return (
      <div className="aws-empty-state">
        <h3>Database not found</h3>
        <p>The DB instance {dbId} does not exist.</p>
      </div>
    );
  }

  function handleToggleStatus() {
    if (!instance) return;
    if (instance.Status === 'available') {
      updateInstance(instance.DBInstanceIdentifier, { Status: 'stopped' });
    } else if (instance.Status === 'stopped') {
      updateInstance(instance.DBInstanceIdentifier, { Status: 'available' });
    }
  }

  function handleDelete() {
    if (!instance) return;
    removeInstance(instance.DBInstanceIdentifier);
    navigate('/rds/databases');
  }

  function handleCreateSnapshot() {
    if (!instance) return;
    const snapshotId = `rds:${instance.DBInstanceIdentifier}-${Date.now()}`;
    const snapshot: RDSSnapshot = {
      DBSnapshotIdentifier: snapshotId,
      DBInstanceIdentifier: instance.DBInstanceIdentifier,
      SnapshotCreateTime: new Date().toISOString(),
      Engine: instance.Engine,
      Status: 'available',
      AllocatedStorage: instance.AllocatedStorage,
      SnapshotType: 'manual',
      Tags: [],
    };
    addSnapshot(snapshot);
  }

  return (
    <>
      <DetailPanel
        title={instance.DBInstanceIdentifier}
        subtitle={`${instance.Engine} ${instance.EngineVersion}`}
        actions={
          <>
            {instance.Status === 'available' && (
              <button className="aws-btn aws-btn-secondary" onClick={handleToggleStatus}>
                Stop
              </button>
            )}
            {instance.Status === 'stopped' && (
              <button className="aws-btn aws-btn-secondary" onClick={handleToggleStatus}>
                Start
              </button>
            )}
            <button className="aws-btn aws-btn-danger" onClick={() => setShowDelete(true)}>
              Delete
            </button>
          </>
        }
        tabs={[
          {
            key: 'summary',
            label: 'Summary',
            content: (
              <KeyValueDisplay
                data={{
                  'DB identifier': instance.DBInstanceIdentifier,
                  'DB instance class': instance.DBInstanceClass,
                  'Engine': instance.Engine,
                  'Engine version': instance.EngineVersion,
                  'Status': <StatusBadge status={instance.Status} />,
                  'Endpoint': instance.Endpoint,
                  'Port': instance.Port,
                  'Allocated storage': `${instance.AllocatedStorage} GB`,
                  'Multi-AZ': instance.MultiAZ ? 'Yes' : 'No',
                  'Master username': instance.MasterUsername,
                  'Publicly accessible': instance.PubliclyAccessible ? 'Yes' : 'No',
                  'Storage encrypted': instance.StorageEncrypted ? 'Yes' : 'No',
                  'Availability zone': instance.AvailabilityZone,
                  'Created time': instance.CreatedTime,
                  'Backup retention period': `${instance.BackupRetentionPeriod} days`,
                }}
              />
            ),
          },
          {
            key: 'snapshots',
            label: 'Snapshots',
            content: (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3>Snapshots ({snapshots.length})</h3>
                  <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={handleCreateSnapshot}>
                    Create snapshot
                  </button>
                </div>
                {snapshots.length === 0 ? (
                  <p style={{ color: 'var(--aws-text-secondary)' }}>No snapshots for this DB instance.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <th style={thStyle}>Snapshot ID</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>Storage</th>
                        <th style={thStyle}>Created</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshots.map((sn) => (
                        <tr key={sn.DBSnapshotIdentifier} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                          <td style={tdStyle}>{sn.DBSnapshotIdentifier}</td>
                          <td style={tdStyle}><StatusBadge status={sn.Status} /></td>
                          <td style={tdStyle}>{sn.SnapshotType}</td>
                          <td style={tdStyle}>{sn.AllocatedStorage} GB</td>
                          <td style={tdStyle}>{sn.SnapshotCreateTime}</td>
                          <td style={tdStyle}>
                            <button
                              className="aws-btn aws-btn-danger aws-btn-sm"
                              onClick={() => removeSnapshot(sn.DBSnapshotIdentifier)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ),
          },
          {
            key: 'tags',
            label: 'Tags',
            content: (
              <div>
                {instance.Tags.length === 0 ? (
                  <p style={{ color: 'var(--aws-text-secondary)' }}>No tags</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <th style={thStyle}>Key</th>
                        <th style={thStyle}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instance.Tags.map((tag, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                          <td style={tdStyle}>{tag.Key}</td>
                          <td style={tdStyle}>{tag.Value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete database"
        message={`Are you sure you want to delete the database "${instance.DBInstanceIdentifier}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </>
  );
}

const thStyle: React.CSSProperties = {
  padding: '8px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 700,
  color: '#545b64',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tdStyle: React.CSSProperties = {
  padding: '8px',
  fontSize: '13px',
};
