import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIAMStore } from '../../store';
import ResourceTable from '../../components/shared/ResourceTable';
import type { Column } from '../../components/shared/ResourceTable';
import CreateResourceModal from '../../components/shared/CreateResourceModal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { TextField, CheckboxField } from '../../components/shared/FormFields';
import { generateUserId } from '../../utils/idGenerator';
import { generateIAMArn } from '../../utils/arnGenerator';
import type { IAMUser } from '../../types/aws';

export default function Users() {
  const users = useIAMStore((s) => s.users);
  const addUser = useIAMStore((s) => s.addUser);
  const removeUser = useIAMStore((s) => s.removeUser);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<IAMUser[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [userName, setUserName] = useState('');
  const [path, setPath] = useState('/');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const columns: Column<IAMUser>[] = [
    {
      key: 'UserName',
      header: 'User name',
      render: (item) => (
        <Link to={`/iam/users/${item.UserName}`} onClick={(e) => e.stopPropagation()}>
          {item.UserName}
        </Link>
      ),
    },
    { key: 'UserId', header: 'User ID' },
    { key: 'Arn', header: 'ARN' },
    { key: 'CreateDate', header: 'Creation time' },
    {
      key: 'MFAEnabled',
      header: 'MFA',
      render: (item) => <span>{item.MFAEnabled ? 'Yes' : 'No'}</span>,
    },
  ];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newUser: IAMUser = {
      UserName: userName,
      UserId: generateUserId(),
      Arn: generateIAMArn('user', userName, path),
      CreateDate: new Date().toISOString(),
      Groups: [],
      Policies: [],
      AccessKeys: [],
      MFAEnabled: mfaEnabled,
      Tags: [],
      Path: path,
    };
    addUser(newUser);
    setShowCreate(false);
    setUserName('');
    setPath('/');
    setMfaEnabled(false);
  }

  function handleDelete() {
    selected.forEach((u) => removeUser(u.UserName));
    setSelected([]);
    setShowDelete(false);
  }

  return (
    <div data-mission="iam-users-table">
      <ResourceTable
        columns={columns}
        data={users as unknown as Record<string, unknown>[]}
        keyField="UserName"
        title="Users"
        onRowClick={(item) => navigate(`/iam/users/${(item as unknown as IAMUser).UserName}`)}
        onSelectionChange={(items) => setSelected(items as unknown as IAMUser[])}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="aws-btn aws-btn-danger aws-btn-sm"
              disabled={selected.length === 0}
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={() => setShowCreate(true)} data-mission="iam-create-user-btn">
              Create user
            </button>
          </div>
        }
      />

      <CreateResourceModal
        title="Create user"
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isValid={!!userName.trim()}
      >
        <TextField label="User name" value={userName} onChange={setUserName} required placeholder="my-user" />
        <TextField label="Path" value={path} onChange={setPath} placeholder="/" hint="The path for the user name. Defaults to '/'" />
        <CheckboxField label="Enable MFA" checked={mfaEnabled} onChange={setMfaEnabled} hint="Enable multi-factor authentication for this user" />
      </CreateResourceModal>

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete users"
        message={`Are you sure you want to delete ${selected.length} user(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        danger
      />
    </div>
  );
}
