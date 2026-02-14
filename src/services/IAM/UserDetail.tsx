import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIAMStore } from '../../store';
import DetailPanel from '../../components/shared/DetailPanel';
import { KeyValueDisplay, TagEditor } from '../../components/shared/FormFields';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { generateAccessKeyId } from '../../utils/idGenerator';
import type { IAMAccessKey } from '../../types/aws';

export default function UserDetail() {
  const { userName } = useParams<{ userName: string }>();
  const user = useIAMStore((s) => s.users.find((u) => u.UserName === userName));
  const updateUser = useIAMStore((s) => s.updateUser);
  const removeUser = useIAMStore((s) => s.removeUser);
  const groups = useIAMStore((s) => s.groups);
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteKey, setShowDeleteKey] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="aws-empty-state">
        <h3>User not found</h3>
        <p>The user &quot;{userName}&quot; does not exist.</p>
      </div>
    );
  }

  const userGroups = groups.filter((g) => user.Groups.includes(g.GroupName));

  function handleAddAccessKey() {
    if (!user) return;
    const newKey: IAMAccessKey = {
      AccessKeyId: generateAccessKeyId(),
      Status: 'Active',
      CreateDate: new Date().toISOString(),
    };
    updateUser(user.UserName, {
      AccessKeys: [...user.AccessKeys, newKey],
    });
  }

  function handleRemoveAccessKey() {
    if (!user || !keyToDelete) return;
    updateUser(user.UserName, {
      AccessKeys: user.AccessKeys.filter((k) => k.AccessKeyId !== keyToDelete),
    });
    setKeyToDelete(null);
    setShowDeleteKey(false);
  }

  function handleDeleteUser() {
    if (!user) return;
    removeUser(user.UserName);
    navigate('/iam/users');
  }

  return (
    <>
      <DetailPanel
        title={user.UserName}
        subtitle={user.UserId}
        actions={
          <button className="aws-btn aws-btn-danger" onClick={() => setShowDelete(true)}>
            Delete user
          </button>
        }
        tabs={[
          {
            key: 'summary',
            label: 'Summary',
            content: (
              <KeyValueDisplay
                data={{
                  'User name': user.UserName,
                  'User ID': user.UserId,
                  'ARN': user.Arn,
                  'Path': user.Path,
                  'Creation time': user.CreateDate,
                  'MFA enabled': user.MFAEnabled ? 'Yes' : 'No',
                  'Password last used': user.PasswordLastUsed || 'Never',
                }}
              />
            ),
          },
          {
            key: 'groups',
            label: 'Groups',
            content: (
              <div>
                <h3 style={{ marginBottom: '12px' }}>Group memberships</h3>
                {userGroups.length === 0 ? (
                  <p style={{ color: 'var(--aws-text-secondary)' }}>This user is not a member of any groups.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <th style={thStyle}>Group name</th>
                        <th style={thStyle}>Group ID</th>
                        <th style={thStyle}>ARN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userGroups.map((g) => (
                        <tr key={g.GroupName} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                          <td style={tdStyle}>{g.GroupName}</td>
                          <td style={tdStyle}>{g.GroupId}</td>
                          <td style={tdStyle}>{g.Arn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ),
          },
          {
            key: 'permissions',
            label: 'Permissions',
            content: (
              <div>
                <h3 style={{ marginBottom: '12px' }}>Attached policies</h3>
                {user.Policies.length === 0 ? (
                  <p style={{ color: 'var(--aws-text-secondary)' }}>No policies are attached to this user.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <th style={thStyle}>Policy name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.Policies.map((p) => (
                        <tr key={p} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                          <td style={tdStyle}>{p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ),
          },
          {
            key: 'accesskeys',
            label: 'Access keys',
            content: (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3>Access keys</h3>
                  <button className="aws-btn aws-btn-primary aws-btn-sm" onClick={handleAddAccessKey}>
                    Create access key
                  </button>
                </div>
                {user.AccessKeys.length === 0 ? (
                  <p style={{ color: 'var(--aws-text-secondary)' }}>No access keys for this user.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <th style={thStyle}>Access key ID</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Created</th>
                        <th style={thStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.AccessKeys.map((key) => (
                        <tr key={key.AccessKeyId} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                          <td style={tdStyle}>{key.AccessKeyId}</td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                color: key.Status === 'Active' ? '#1d8102' : '#d13212',
                                fontWeight: 600,
                              }}
                            >
                              {key.Status}
                            </span>
                          </td>
                          <td style={tdStyle}>{key.CreateDate}</td>
                          <td style={tdStyle}>
                            <button
                              className="aws-btn aws-btn-danger aws-btn-sm"
                              onClick={() => {
                                setKeyToDelete(key.AccessKeyId);
                                setShowDeleteKey(true);
                              }}
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
                <h3 style={{ marginBottom: '12px' }}>Tags</h3>
                <TagEditor
                  tags={user.Tags}
                  onChange={(tags) => updateUser(user.UserName, { Tags: tags })}
                />
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete user"
        message={`Are you sure you want to delete user "${user.UserName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteUser}
        onCancel={() => setShowDelete(false)}
        danger
      />

      <ConfirmDialog
        isOpen={showDeleteKey}
        title="Delete access key"
        message={`Are you sure you want to delete access key "${keyToDelete}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleRemoveAccessKey}
        onCancel={() => {
          setShowDeleteKey(false);
          setKeyToDelete(null);
        }}
        danger
      />
    </>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px',
  fontSize: '12px',
  color: '#545b64',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tdStyle: React.CSSProperties = {
  padding: '8px',
  fontSize: '13px',
};
