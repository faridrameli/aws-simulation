import { useState, useMemo } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface ResourceTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  onRowClick?: (item: T) => void;
  onSelectionChange?: (items: T[]) => void;
  actions?: React.ReactNode;
  title?: string;
  emptyMessage?: string;
  selectable?: boolean;
}

export default function ResourceTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  onRowClick,
  onSelectionChange,
  actions,
  title,
  emptyMessage = 'No resources found',
  selectable = true,
}: ResourceTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (!filter) return data;
    const lower = filter.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = col.render ? '' : String(item[col.key] ?? '');
        return val.toLowerCase().includes(lower);
      })
    );
  }, [data, filter, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey] ?? '');
      const bVal = String(b[sortKey] ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    onSelectionChange?.(data.filter((d) => next.has(String(d[keyField]))));
  }

  function toggleAll() {
    if (selected.size === sorted.length) {
      setSelected(new Set());
      onSelectionChange?.([]);
    } else {
      const all = new Set(sorted.map((d) => String(d[keyField])));
      setSelected(all);
      onSelectionChange?.(sorted);
    }
  }

  return (
    <div className="aws-panel">
      <div className="aws-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {title && <h2>{title}</h2>}
          <span style={{ color: 'var(--aws-text-secondary)', fontSize: '13px' }}>
            ({sorted.length})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            placeholder="Filter resources..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--aws-border-dark)',
              borderRadius: '2px',
              fontSize: '13px',
              width: '200px',
            }}
          />
          {actions}
        </div>
      </div>
      {sorted.length === 0 ? (
        <div className="aws-empty-state">
          <h3>{emptyMessage}</h3>
          <p>Get started by creating a new resource.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid var(--aws-border)' }}>
                {selectable && (
                  <th style={{ ...thStyle, width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selected.size === sorted.length && sorted.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ ...thStyle, cursor: col.sortable !== false ? 'pointer' : undefined, width: col.width }}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    {col.header}
                    {sortKey === col.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => {
                const id = String(item[keyField]);
                return (
                  <tr
                    key={id}
                    style={{
                      borderBottom: '1px solid var(--aws-border)',
                      background: selected.has(id) ? '#f1f8ff' : undefined,
                      cursor: onRowClick ? 'pointer' : undefined,
                    }}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td style={tdStyle}>
                        <input
                          type="checkbox"
                          checked={selected.has(id)}
                          onChange={(e) => { e.stopPropagation(); toggleSelect(id); }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} style={tdStyle}>
                        {col.render ? col.render(item) : String(item[col.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 700,
  color: '#545b64',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '13px',
  color: '#16191f',
};
