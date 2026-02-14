import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIAMStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { TextField } from '../../components/shared/FormFields';
import { generateGroupId } from '../../utils/idGenerator';
import { generateIAMArn } from '../../utils/arnGenerator';
import type { IAMGroup } from '../../types/aws';

export default function Groups() {
  const groups = useIAMStore((s) => s.groups);
  const addGroup = useIAMStore((s) => s.addGroup);
  const removeGroup = useIAMStore((s) => s.removeGroup);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<IAMGroup[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [path, setPath] = useState('/');

  const columns: Column<IAMGroup>[] = [
    {
      key: 'GroupName',
      header: 'Group name',
      render: (item) => (
        <Link to={`/iam/groups/${item.GroupName}`} onClick={(e) => e.stopPropagation()}>
          {item.GroupName}
        </Link>
      ),
    },
    { key: 'GroupId', header: 'Group ID' },
    { key: 'Arn', header: 'ARN' },
    {
      key: 'Users',
      header: 'Users',
      render: (item) => <span>{item.Users.length}</span>,
    },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newGroup: IAMGroup = {
      GroupName: groupName,
      GroupId: generateGroupId(),
      Arn: generateIAMArn('group', groupName, path),
      CreateDate: new Date().toISOString(),
      Users: [],
      Policies: [],
      Path: path,
    };
    addGroup(newGroup);
    setShowCreate(false);
    setGroupName('');
    setPath('/');
  }

  function handleDelete() {
    selected.forEach((g) => removeGroup(g.GroupName));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div>
      <ResourceTable
        columns={columns}
        data={groups as unknown as Record<string, unknown>[]}
        keyField="GroupName"
        title="Groups"
        onRowClick={(item) => navigate(`/iam/groups/${(item as unknown as IAMGroup).GroupName}`)}
        onSelectionChange={(items) => setSelected(items as unknown as IAMGroup[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)}>
              Create group
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create group"
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isValid={!!groupName.trim()}
      >
        <TextField label="Group name" value={groupName} onChange={setGroupName} required placeholder="my-group" />
        <TextField label="Path" value={path} onChange={setPath} placeholder="/" hint="The path for the group. Defaults to '/'" />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete groups"
        message={`Are you sure you want to delete ${selected.length} group(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}
