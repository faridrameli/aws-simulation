import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRDSStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import StatusBadge from '../../components/shared/StatusBadge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import type { RDSInstance } from '../../types/aws';

export default function Databases() {
  const instances = useRDSStore((s) => s.instances);
  const removeInstance = useRDSStore((s) => s.removeInstance);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<RDSInstance[]>([]);
  const [showDelete, setShowDelete] = useState(false);

  const columns: Column<RDSInstance>[] = [
    {
      key: 'DBInstanceIdentifier',
      header: 'DB identifier',
      render: (item) => (
        <Link to={`/rds/databases/${item.DBInstanceIdentifier}`} onClick={(e) => e.stopPropagation()}>
          {item.DBInstanceIdentifier}
        </Link>
      ),
    },
    { key: 'Engine', header: 'Engine' },
    {
      key: 'Status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.Status} />,
    },
    { key: 'DBInstanceClass', header: 'Instance class' },
    {
      key: 'AllocatedStorage',
      header: 'Storage',
      render: (item) => `${item.AllocatedStorage} GB`,
    },
    { key: 'AvailabilityZone', header: 'Region & AZ' },
    {
      key: 'MultiAZ',
      header: 'Multi-AZ',
      render: (item) => (item.MultiAZ ? 'Yes' : 'No'),
    },
  ];

  function handleDelete() {
    selected.forEach((i) => removeInstance(i.DBInstanceIdentifier));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div data-mission="rds-databases-table">
      <ResourceTable
        columns={columns}
        data={instances as unknown as Record<string, unknown>[]}
        keyField="DBInstanceIdentifier"
        title="Databases"
        onRowClick={(item) => navigate(`/rds/databases/${(item as unknown as RDSInstance).DBInstanceIdentifier}`)}
        onSelectionChange={(items) => setSelected(items as unknown as RDSInstance[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <Link to="/rds/databases/create" className="aws-btn aws-btn-primary aws-btn-sm" data-mission="rds-create-btn">
              Create database
            </Link>
          </div>
        }
      />

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete databases"
        message={`Are you sure you want to delete ${selected.length} database(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}
