import { useState } from 'react';

interface Tab {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface DetailPanelProps {
  title: string;
  subtitle?: string;
  tabs: Tab[];
  actions?: React.ReactNode;
}

export default function DetailPanel({ title, subtitle, tabs, actions }: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key);

  const currentTab = tabs.find((t) => t.key === activeTab);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>{title}</h1>
          {subtitle && <p style={{ color: 'var(--aws-text-secondary)', fontSize: '13px', marginTop: '4px' }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
      </div>

      <div className="aws-panel">
        <div className="aws-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`aws-tab ${activeTab === tab.key ? 'aws-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="aws-panel-body">
          {currentTab?.content}
        </div>
      </div>
    </div>
  );
}
