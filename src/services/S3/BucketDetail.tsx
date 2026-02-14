import { useParams, useNavigate } from 'react-router-dom';
import { useS3Store } from '../../store';
import DetailPanel from '../../components/shared/DetailPanel';
import { KeyValueDisplay } from '../../components/shared/FormFields';
import StatusBadge from '../../components/shared/StatusBadge';
import type { S3Object } from '../../types/aws';

export default function BucketDetail() {
  const { bucketName } = useParams<{ bucketName: string }>();
  const bucket = useS3Store((s) => s.buckets.find((b) => b.Name === bucketName));
  const removeBucket = useS3Store((s) => s.removeBucket);
  const addObject = useS3Store((s) => s.addObject);
  const removeObject = useS3Store((s) => s.removeObject);
  const navigate = useNavigate();

  if (!bucket) {
    return (
      <div className="aws-empty-state">
        <h3>Bucket not found</h3>
        <p>The bucket {bucketName} does not exist.</p>
      </div>
    );
  }

  function handleUploadObject() {
    const timestamp = Date.now();
    const mockObject: S3Object = {
      Key: `object-${timestamp}.txt`,
      Size: Math.floor(Math.random() * 100000) + 1024,
      LastModified: new Date().toISOString(),
      StorageClass: 'STANDARD',
      ContentType: 'text/plain',
    };
    addObject(bucket!.Name, mockObject);
  }

  function handleDeleteBucket() {
    removeBucket(bucket!.Name);
    navigate('/s3/buckets');
  }

  return (
    <DetailPanel
      title={bucket.Name}
      subtitle={`Region: ${bucket.Region}`}
      actions={
        <>
          <button
            className="aws-btn aws-btn-secondary"
            onClick={handleUploadObject}
          >
            Upload object
          </button>
          <button
            className="aws-btn aws-btn-danger"
            onClick={handleDeleteBucket}
          >
            Delete bucket
          </button>
        </>
      }
      tabs={[
        {
          key: 'overview',
          label: 'Overview',
          content: (
            <KeyValueDisplay
              data={{
                'Bucket name': bucket.Name,
                'Region': bucket.Region,
                'Versioning': <StatusBadge status={bucket.Versioning} />,
                'Encryption': bucket.Encryption,
                'Created': new Date(bucket.CreationDate).toLocaleString(),
              }}
            />
          ),
        },
        {
          key: 'objects',
          label: 'Objects',
          content: (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3>Objects ({bucket.Objects.length})</h3>
                <button
                  className="aws-btn aws-btn-secondary aws-btn-sm"
                  onClick={handleUploadObject}
                >
                  Upload
                </button>
              </div>
              {bucket.Objects.length === 0 ? (
                <p style={{ color: 'var(--aws-text-secondary)' }}>No objects in this bucket.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--aws-border)' }}>
                        <th style={thStyle}>Key</th>
                        <th style={thStyle}>Size</th>
                        <th style={thStyle}>Last modified</th>
                        <th style={thStyle}>Storage class</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bucket.Objects.map((obj) => (
                        <tr key={obj.Key} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                          <td style={tdStyle}>{obj.Key}</td>
                          <td style={tdStyle}>{formatSize(obj.Size)}</td>
                          <td style={tdStyle}>{new Date(obj.LastModified).toLocaleString()}</td>
                          <td style={tdStyle}>{obj.StorageClass}</td>
                          <td style={tdStyle}>
                            <button
                              className="aws-btn aws-btn-danger aws-btn-sm"
                              onClick={() => removeObject(bucket.Name, obj.Key)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ),
        },
        {
          key: 'properties',
          label: 'Properties',
          content: (
            <div>
              <KeyValueDisplay
                data={{
                  'Bucket versioning': bucket.Versioning,
                  'Server-side encryption': bucket.Encryption,
                  'Block public access': bucket.PublicAccess ? 'Off' : 'On (all public access blocked)',
                }}
              />
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ marginBottom: '12px' }}>Tags</h3>
                {bucket.Tags.length === 0 ? (
                  <p style={{ color: 'var(--aws-text-secondary)' }}>No tags</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <th style={{ textAlign: 'left', padding: '8px', fontSize: '12px', color: '#545b64' }}>Key</th>
                        <th style={{ textAlign: 'left', padding: '8px', fontSize: '12px', color: '#545b64' }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bucket.Tags.map((tag, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                          <td style={{ padding: '8px', fontSize: '13px' }}>{tag.Key}</td>
                          <td style={{ padding: '8px', fontSize: '13px' }}>{tag.Value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 700,
  color: '#545b64',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '13px',
  color: '#16191f',
};
