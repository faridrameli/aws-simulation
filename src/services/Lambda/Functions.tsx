import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLambdaStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import StatusBadge from '../../components/shared/StatusBadge';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import type { LambdaFunction } from '../../types/aws';

export default function Functions() {
  const functions = useLambdaStore((s) => s.functions);
  const removeFunction = useLambdaStore((s) => s.removeFunction);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<LambdaFunction[]>([]);
  const [showDelete, setShowDelete] = useState(false);

  const columns: Column<LambdaFunction>[] = [
    {
      key: 'FunctionName',
      header: 'Function name',
      render: (item) => (
        <Link to={`/lambda/functions/${item.FunctionName}`} onClick={(e) => e.stopPropagation()}>
          {item.FunctionName}
        </Link>
      ),
    },
    { key: 'Runtime', header: 'Runtime' },
    {
      key: 'State',
      header: 'State',
      render: (item) => <StatusBadge status={item.State} />,
    },
    { key: 'MemorySize', header: 'Memory (MB)' },
    { key: 'LastModified', header: 'Last modified' },
  ];

  function handleDelete() {
    selected.forEach((fn) => removeFunction(fn.FunctionName));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div data-mission="lambda-functions-table">
      <ResourceTable
        columns={columns}
        data={functions as unknown as Record<string, unknown>[]}
        keyField="FunctionName"
        title="Functions"
        onRowClick={(item) => navigate(`/lambda/functions/${(item as unknown as LambdaFunction).FunctionName}`)}
        onSelectionChange={(items) => setSelected(items as unknown as LambdaFunction[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <Link to="/lambda/functions/create" className="aws-btn aws-btn-primary aws-btn-sm" data-mission="lambda-create-btn">
              Create function
            </Link>
          </div>
        }
      />

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete functions"
        message={`Are you sure you want to delete ${selected.length} function(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}
