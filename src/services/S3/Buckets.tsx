import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useS3Store } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import StatusBadge from '../../components/shared/StatusBadge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import type { S3Bucket } from '../../types/aws';

export default function Buckets() {
  const buckets = useS3Store((s) => s.buckets);
  const removeBucket = useS3Store((s) => s.removeBucket);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<S3Bucket[]>([]);
  const [showDelete, setShowDelete] = useState(false);

  const columns: Column<S3Bucket>[] = [
    {
      key: 'Name',
      header: 'Name',
      render: (item) => (
        <Link to={`/s3/buckets/${item.Name}`} onClick={(e) => e.stopPropagation()}>
          {item.Name}
        </Link>
      ),
    },
    { key: 'Region', header: 'Region' },
    {
      key: 'CreationDate',
      header: 'Creation date',
      render: (item) => new Date(item.CreationDate).toLocaleString(),
    },
    {
      key: 'Versioning',
      header: 'Versioning',
      render: (item) => <StatusBadge status={item.Versioning} />,
    },
    {
      key: 'Objects',
      header: 'Objects',
      render: (item) => String(item.Objects.length),
    },
  ];

  function handleDelete() {
    selected.forEach((b) => removeBucket(b.Name));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={buckets as unknown as Record<string, unknown>[]}
        keyField="Name"
        onRowClick={(item) => navigate(`/s3/buckets/${(item as unknown as S3Bucket).Name}`)}
        onSelectionChange={(items) => setSelected(items as unknown as S3Bucket[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <Link to="/s3/buckets/create" className="aws-btn aws-btn-primary aws-btn-sm">
              Create bucket
            </Link>
          </div>
        }
      />

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete buckets"
        message={`Are you sure you want to delete ${selected.length} bucket(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}
