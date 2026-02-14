import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRDSStore, useGlobalStore } from '../../store';
import { TextField, SelectField, NumberField, CheckboxField, TagEditor } from '../../components/shared/FormFields';
import { RDS_ENGINES, RDS_INSTANCE_CLASSES } from '../../utils/constants';
import { generateDBInstanceId } from '../../utils/idGenerator';
import type { Tag } from '../../types/aws';

function getDefaultPort(engine: string): number {
  if (['mysql', 'mariadb', 'aurora-mysql'].includes(engine)) return 3306;
  if (['postgres', 'aurora-postgresql'].includes(engine)) return 5432;
  if (engine.startsWith('oracle')) return 1521;
  if (engine.startsWith('sqlserver')) return 1433;
  return 3306;
}

export default function CreateDatabase() {
  const addInstance = useRDSStore((s) => s.addInstance);
  const region = useGlobalStore((s) => s.region);
  const navigate = useNavigate();

  const [engine, setEngine] = useState('');
  const [engineVersion, setEngineVersion] = useState('');
  const [dbIdentifier, setDbIdentifier] = useState('');
  const [masterUsername, setMasterUsername] = useState('admin');
  const [masterPassword, setMasterPassword] = useState('');
  const [instanceClass, setInstanceClass] = useState('db.t3.micro');
  const [allocatedStorage, setAllocatedStorage] = useState(20);
  const [storageType, setStorageType] = useState('gp2');
  const [publiclyAccessible, setPubliclyAccessible] = useState(false);
  const [multiAZ, setMultiAZ] = useState(false);
  const [backupRetention, setBackupRetention] = useState(7);
  const [encrypted, setEncrypted] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const selectedEngine = RDS_ENGINES.find((e) => e.engine === engine);
  const versionOptions = selectedEngine
    ? selectedEngine.versions.map((v) => ({ value: v, label: v }))
    : [];

  function handleEngineChange(value: string) {
    setEngine(value);
    const eng = RDS_ENGINES.find((e) => e.engine === value);
    if (eng && eng.versions.length > 0) {
      setEngineVersion(eng.versions[0]);
    } else {
      setEngineVersion('');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const port = getDefaultPort(engine);
    const clusterSuffix = Math.random().toString(36).substring(2, 8);
    const endpoint = `${dbIdentifier}.cluster-${clusterSuffix}.${region}.rds.amazonaws.com`;
    const az = `${region}a`;

    addInstance({
      DBInstanceIdentifier: dbIdentifier,
      DBInstanceClass: instanceClass,
      Engine: engine,
      EngineVersion: engineVersion,
      Status: 'available',
      MasterUsername: masterUsername,
      Endpoint: endpoint,
      Port: port,
      AllocatedStorage: allocatedStorage,
      MultiAZ: multiAZ,
      StorageType: storageType as 'gp2' | 'gp3' | 'io1' | 'standard',
      VpcId: `vpc-sim${Math.random().toString(36).substring(2, 10)}`,
      AvailabilityZone: az,
      CreatedTime: new Date().toISOString(),
      BackupRetentionPeriod: backupRetention,
      PubliclyAccessible: publiclyAccessible,
      StorageEncrypted: encrypted,
      Tags: tags,
    });

    navigate('/rds/databases');
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>Create database</h1>

      <form onSubmit={handleSubmit} data-mission="rds-create-form">
        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Engine options</h2></div>
          <div className="aws-panel-body">
            <SelectField
              label="Engine type"
              value={engine}
              onChange={handleEngineChange}
              required
              options={RDS_ENGINES.map((e) => ({ value: e.engine, label: e.engine }))}
            />
            <SelectField
              label="Engine version"
              value={engineVersion}
              onChange={setEngineVersion}
              required
              options={versionOptions}
              disabled={!engine}
              hint="Select an engine first to see available versions"
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Settings</h2></div>
          <div className="aws-panel-body">
            <TextField
              label="DB instance identifier"
              value={dbIdentifier}
              onChange={setDbIdentifier}
              placeholder="my-database"
              required
              hint="Must be unique across all DB instances in your account for this region"
            />
            <TextField
              label="Master username"
              value={masterUsername}
              onChange={setMasterUsername}
              required
            />
            <TextField
              label="Master password"
              value={masterPassword}
              onChange={setMasterPassword}
              type="password"
              required
              hint="Must be at least 8 characters"
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Instance configuration</h2></div>
          <div className="aws-panel-body">
            <SelectField
              label="DB instance class"
              value={instanceClass}
              onChange={setInstanceClass}
              required
              options={RDS_INSTANCE_CLASSES.map((c) => ({ value: c, label: c }))}
              hint="db.t3.micro is eligible for the RDS Free Tier"
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Storage</h2></div>
          <div className="aws-panel-body">
            <NumberField
              label="Allocated storage (GB)"
              value={allocatedStorage}
              onChange={setAllocatedStorage}
              min={20}
              max={65536}
              required
              hint="Minimum 20 GB, maximum 65,536 GB"
            />
            <SelectField
              label="Storage type"
              value={storageType}
              onChange={setStorageType}
              required
              options={[
                { value: 'gp2', label: 'General Purpose SSD (gp2)' },
                { value: 'gp3', label: 'General Purpose SSD (gp3)' },
                { value: 'io1', label: 'Provisioned IOPS SSD (io1)' },
              ]}
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Connectivity</h2></div>
          <div className="aws-panel-body">
            <CheckboxField
              label="Publicly accessible"
              checked={publiclyAccessible}
              onChange={setPubliclyAccessible}
              hint="Allow resources outside the VPC to connect to the database"
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Additional configuration</h2></div>
          <div className="aws-panel-body">
            <CheckboxField
              label="Multi-AZ deployment"
              checked={multiAZ}
              onChange={setMultiAZ}
              hint="Creates a standby in a different Availability Zone for failover support"
            />
            <NumberField
              label="Backup retention period (days)"
              value={backupRetention}
              onChange={setBackupRetention}
              min={0}
              max={35}
              hint="0 to disable automated backups, 1-35 days to retain"
            />
            <CheckboxField
              label="Enable encryption"
              checked={encrypted}
              onChange={setEncrypted}
              hint="Encrypt the DB instance with an AWS KMS key"
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
          <button type="button" className="aws-btn aws-btn-secondary" onClick={() => navigate('/rds/databases')}>
            Cancel
          </button>
          <button type="submit" className="aws-btn aws-btn-primary" disabled={!engine || !engineVersion || !dbIdentifier || !masterPassword}>
            Create database
          </button>
        </div>
      </form>
    </div>
  );
}
