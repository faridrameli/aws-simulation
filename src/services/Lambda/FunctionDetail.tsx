import { useParams, useNavigate } from 'react-router-dom';
import { useLambdaStore } from '../../store';
import DetailPanel from '../../components/shared/DetailPanel';
import { KeyValueDisplay } from '../../components/shared/FormFields';
import StatusBadge from '../../components/shared/StatusBadge';

export default function FunctionDetail() {
  const { functionName } = useParams<{ functionName: string }>();
  const fn = useLambdaStore((s) => s.functions.find((f) => f.FunctionName === functionName));
  const removeFunction = useLambdaStore((s) => s.removeFunction);
  const navigate = useNavigate();

  if (!fn) {
    return (
      <div className="aws-empty-state">
        <h3>Function not found</h3>
        <p>The function {functionName} does not exist.</p>
      </div>
    );
  }

  const envEntries = Object.entries(fn.Environment);

  return (
    <DetailPanel
      title={fn.FunctionName}
      subtitle={fn.FunctionArn}
      actions={
        <>
          <button
            className="aws-btn aws-btn-danger"
            onClick={() => {
              removeFunction(fn.FunctionName);
              navigate('/lambda/functions');
            }}
          >
            Delete function
          </button>
        </>
      }
      tabs={[
        {
          key: 'configuration',
          label: 'Configuration',
          content: (
            <KeyValueDisplay
              data={{
                'Function name': fn.FunctionName,
                'Function ARN': fn.FunctionArn,
                'Runtime': fn.Runtime,
                'Handler': fn.Handler,
                'Memory (MB)': String(fn.MemorySize),
                'Timeout (seconds)': String(fn.Timeout),
                'Description': fn.Description || '-',
                'Role': fn.Role,
                'State': <StatusBadge status={fn.State} />,
                'Last modified': fn.LastModified,
                'Code size': `${fn.CodeSize} bytes`,
              }}
            />
          ),
        },
        {
          key: 'environment',
          label: 'Environment variables',
          content: (
            <div>
              {envEntries.length === 0 ? (
                <p style={{ color: 'var(--aws-text-secondary)' }}>No environment variables configured.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', fontSize: '12px', color: '#545b64' }}>Key</th>
                      <th style={{ textAlign: 'left', padding: '8px', fontSize: '12px', color: '#545b64' }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {envEntries.map(([key, value]) => (
                      <tr key={key} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{key}</td>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{value}</td>
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
              {fn.Tags.length === 0 ? (
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
                    {fn.Tags.map((tag, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{tag.Key}</td>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{tag.Value}</td>
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
  );
}
