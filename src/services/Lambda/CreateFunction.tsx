import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLambdaStore, useGlobalStore } from '../../store';
import { TextField, SelectField, NumberField, TextAreaField, TagEditor } from '../../components/shared/FormFields';
import { LAMBDA_RUNTIMES } from '../../utils/constants';
import { generateLambdaArn } from '../../utils/arnGenerator';
import type { Tag } from '../../types/aws';

export default function CreateFunction() {
  const addFunction = useLambdaStore((s) => s.addFunction);
  const region = useGlobalStore((s) => s.region);
  const navigate = useNavigate();

  const [functionName, setFunctionName] = useState('');
  const [runtime, setRuntime] = useState('nodejs20.x');
  const [handler, setHandler] = useState('index.handler');
  const [description, setDescription] = useState('');
  const [memorySize, setMemorySize] = useState(128);
  const [timeout, setTimeout] = useState(3);
  const [roleName, setRoleName] = useState('');
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([]);
  const [envKey, setEnvKey] = useState('');
  const [envValue, setEnvValue] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);

  function addEnvVar() {
    if (envKey) {
      setEnvVars([...envVars, { key: envKey, value: envValue }]);
      setEnvKey('');
      setEnvValue('');
    }
  }

  function removeEnvVar(index: number) {
    setEnvVars(envVars.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const environment: Record<string, string> = {};
    envVars.forEach((ev) => {
      environment[ev.key] = ev.value;
    });

    addFunction({
      FunctionName: functionName,
      FunctionArn: generateLambdaArn(region, functionName),
      Runtime: runtime,
      Handler: handler,
      Description: description,
      MemorySize: memorySize,
      Timeout: timeout,
      LastModified: new Date().toISOString(),
      CodeSize: Math.floor(Math.random() * 50000) + 1000,
      State: 'Active',
      Role: roleName ? `arn:aws:iam::123456789012:role/${roleName}` : '',
      Environment: environment,
      Tags: tags,
      Layers: [],
    });

    navigate('/lambda/functions');
  }

  const runtimeOptions = LAMBDA_RUNTIMES.map((r) => ({ value: r, label: r }));

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '20px' }}>Create function</h1>

      <form onSubmit={handleSubmit}>
        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Basic information</h2></div>
          <div className="aws-panel-body">
            <TextField
              label="Function name"
              value={functionName}
              onChange={setFunctionName}
              placeholder="my-function"
              required
              hint="The name must be unique within your account and region."
            />
            <SelectField
              label="Runtime"
              value={runtime}
              onChange={setRuntime}
              options={runtimeOptions}
              required
              hint="Choose the language runtime for your function."
            />
            <TextField
              label="Handler"
              value={handler}
              onChange={setHandler}
              placeholder="index.handler"
              hint="The method in your code that Lambda calls to begin execution."
            />
            <TextAreaField
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="A short description of your function"
              rows={3}
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>General configuration</h2></div>
          <div className="aws-panel-body">
            <NumberField
              label="Memory (MB)"
              value={memorySize}
              onChange={setMemorySize}
              min={128}
              max={10240}
              hint="Between 128 MB and 10,240 MB in 1-MB increments."
            />
            <NumberField
              label="Timeout (seconds)"
              value={timeout}
              onChange={setTimeout}
              min={1}
              max={900}
              hint="Between 1 second and 15 minutes (900 seconds)."
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Permissions</h2></div>
          <div className="aws-panel-body">
            <TextField
              label="Execution role name"
              value={roleName}
              onChange={setRoleName}
              placeholder="my-lambda-role"
              hint="IAM role that Lambda assumes when it runs your function."
            />
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Environment variables</h2></div>
          <div className="aws-panel-body">
            {envVars.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--aws-border)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', fontSize: '12px', color: '#545b64' }}>Key</th>
                      <th style={{ textAlign: 'left', padding: '8px', fontSize: '12px', color: '#545b64' }}>Value</th>
                      <th style={{ width: '60px', padding: '8px' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {envVars.map((ev, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--aws-border)' }}>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{ev.key}</td>
                        <td style={{ padding: '8px', fontSize: '13px' }}>{ev.value}</td>
                        <td style={{ padding: '8px' }}>
                          <button
                            type="button"
                            className="aws-btn aws-btn-secondary aws-btn-sm"
                            onClick={() => removeEnvVar(i)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div>
                <label className="aws-form-label">Key</label>
                <input
                  type="text"
                  className="aws-form-input"
                  value={envKey}
                  onChange={(e) => setEnvKey(e.target.value)}
                  placeholder="ENV_VAR_KEY"
                  style={{ width: '200px' }}
                />
              </div>
              <div>
                <label className="aws-form-label">Value</label>
                <input
                  type="text"
                  className="aws-form-input"
                  value={envValue}
                  onChange={(e) => setEnvValue(e.target.value)}
                  placeholder="value"
                  style={{ width: '200px' }}
                />
              </div>
              <button type="button" className="aws-btn aws-btn-secondary aws-btn-sm" onClick={addEnvVar}>
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="aws-panel">
          <div className="aws-panel-header"><h2>Tags</h2></div>
          <div className="aws-panel-body">
            <TagEditor tags={tags} onChange={setTags} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button type="button" className="aws-btn aws-btn-secondary" onClick={() => navigate('/lambda/functions')}>
            Cancel
          </button>
          <button type="submit" className="aws-btn aws-btn-primary" disabled={!functionName}>
            Create function
          </button>
        </div>
      </form>
    </div>
  );
}
