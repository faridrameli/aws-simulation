import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useS3Store, useGlobalStore } from '../../store';
import { TextField, SelectField, CheckboxField, TagEditor } from '../../components/shared/FormFields';
import { AWS_REGIONS } from '../../utils/constants';
import type { Tag } from '../../types/aws';

export default function CreateBucket() {
  const addBucket = useS3Store((s) => s.addBucket);
  const region = useGlobalStore((s) => s.region);
  const navigate = useNavigate();

  const [bucketName, setBucketName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(region);
  const [versioning, setVersioning] = useState(false);
  const [encryption, setEncryption] = useState<'AES256' | 'aws:kms' | 'None'>('AES256');
  const [blockPublicAccess, setBlockPublicAccess] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    addBucket({
      Name: bucketName,
      CreationDate: new Date().toISOString(),
      Region: selectedRegion,
      Versioning: versioning ? 'Enabled' : 'Disabled',
      PublicAccess: !blockPublicAccess,
      Encryption: encryption,
      Tags: tags,
      Objects: [],
    });

    navigate('/s3/buckets');
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>Create bucket</h1>

      <form onSubmit={handleSubmit} data-mission="s3-create-form">
        <div className="aws-panel">
          <div className="aws-panel-header"><h2>General configuration</h2></div>
          <div className="aws-panel-body">
            <TextField
              label="Bucket name"
              value={bucketName}
              onChange={setBucketName}
              placeholder="Enter a unique bucket name"
              required
              hint="Bucket name must be globally unique and follow S3 naming rules"
            />
            <SelectField
              label="AWS Region"
              value={selectedRegion}
              onChange={setSelectedRegion}
              required
              options={AWS_REGIONS.map((r) => ({
                value: r.code,
                label: `${r.name} (${r.code})`,
              }))}
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Bucket Versioning</h2></div>
          <div className="aws-panel-body">
            <CheckboxField
              label="Enable versioning"
              checked={versioning}
              onChange={setVersioning}
              hint="Versioning keeps multiple variants of an object in the same bucket"
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Default encryption</h2></div>
          <div className="aws-panel-body">
            <SelectField
              label="Encryption type"
              value={encryption}
              onChange={(val) => setEncryption(val as 'AES256' | 'aws:kms' | 'None')}
              options={[
                { value: 'AES256', label: 'Amazon S3-managed keys (SSE-S3) - AES256' },
                { value: 'aws:kms', label: 'AWS Key Management Service key (SSE-KMS)' },
                { value: 'None', label: 'None' },
              ]}
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Block Public Access settings</h2></div>
          <div className="aws-panel-body">
            <CheckboxField
              label="Block all public access"
              checked={blockPublicAccess}
              onChange={setBlockPublicAccess}
              hint="Turning this on blocks all public access to this bucket and its objects"
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Tags</h2></div>
          <div className="aws-panel-body">
            <TagEditor tags={tags} onChange={setTags} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button type="button" className="aws-btn aws-btn-secondary" onClick={() => navigate('/s3/buckets')}>
            Cancel
          </button>
          <button type="submit" className="aws-btn aws-btn-primary" disabled={!bucketName}>
            Create bucket
          </button>
        </div>
      </form>
    </div>
  );
}
