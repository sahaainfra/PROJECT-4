import React, { useState } from 'react';
import { getIcon } from '../data/registries';

// ═══════════════════════════════════════════════════════════
// LIST REPORT TEMPLATE (DS-26)
// Filter bar + grid with sorting, pagination, export
// ═══════════════════════════════════════════════════════════

interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  format?: 'text' | 'number' | 'currency' | 'date' | 'status';
}

interface ListReportProps {
  title: string;
  subtitle?: string;
  columns: Column[];
  data: Record<string, any>[];
  statusField?: string;
  onRowClick?: (row: Record<string, any>) => void;
}

const statusColors: Record<string, string> = {
  'Open': 'var(--status-open)',
  'In Progress': 'var(--status-progress)',
  'Approved': 'var(--status-approved)',
  'Rejected': 'var(--status-rejected)',
  'Closed': 'var(--status-closed)',
  'Draft': 'var(--status-closed)',
  'Pending': 'var(--status-progress)',
  'Posted': 'var(--status-approved)',
  'Cancelled': 'var(--status-rejected)',
};

export function ListReport({ title, subtitle, columns, data, statusField, onRowClick }: ListReportProps) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const FilterIcon = getIcon('action.filter');
  const DownloadIcon = getIcon('action.download');
  const PlusIcon = getIcon('action.add');
  const RefreshIcon = getIcon('action.refresh');
  const ChevronRight = getIcon('action.navigate');
  const ChevronLeft = getIcon('action.back');

  // Filter
  const filtered = data.filter(row =>
    Object.values(row).some(v =>
      String(v).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortDir === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const formatValue = (value: any, format?: string) => {
    if (value === null || value === undefined) return '—';
    switch (format) {
      case 'currency':
        return `₹${Number(value).toLocaleString('en-IN')}`;
      case 'number':
        return Number(value).toLocaleString('en-IN');
      case 'date':
        return value; // Already formatted
      case 'status':
        return value;
      default:
        return String(value);
    }
  };

  return (
    <div className="p-[var(--density-spacing-xl)] max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-[var(--density-spacing-lg)]">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
          {subtitle && <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--density-border-radius)] text-xs border transition-colors hover:opacity-80"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <RefreshIcon size={14} />
            Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--density-border-radius)] text-xs border transition-colors hover:opacity-80"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <DownloadIcon size={14} />
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--density-border-radius)] text-xs text-white transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-primary)' }}>
            <PlusIcon size={14} />
            New
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-[var(--density-spacing-md)]">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-[var(--density-border-radius)] border"
          style={{ borderColor: 'var(--border-color)', background: 'var(--surface-bg)' }}>
          <FilterIcon size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Filter records..."
            value={filterText}
            onChange={e => { setFilterText(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} records
        </div>
      </div>

      {/* Data Grid */}
      <div className="rounded-[var(--density-border-radius)] overflow-hidden border"
        style={{ borderColor: 'var(--border-color)', background: 'var(--surface-bg)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--shell-bg)' }}>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-2.5 text-left text-xs font-medium cursor-pointer select-none hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--text-secondary)', width: col.width, textAlign: col.align || 'left' }}
                  >
                    <div className="flex items-center gap-1" style={{ justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }}>
                      {col.label}
                      {sortKey === col.key && (
                        <span className="text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className="border-t cursor-pointer transition-colors hover:opacity-80"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className="px-4 py-2.5 text-sm"
                      style={{ color: 'var(--text-primary)', textAlign: col.align || 'left' }}
                    >
                      {col.format === 'status' && statusField ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: `${statusColors[row[col.key]] || 'var(--text-muted)'}15`,
                            color: statusColors[row[col.key]] || 'var(--text-muted)',
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[row[col.key]] || 'var(--text-muted)' }} />
                          {row[col.key]}
                        </span>
                      ) : (
                        <span className={col.format === 'currency' || col.format === 'number' ? 'tabular-nums' : ''}>
                          {formatValue(row[col.key], col.format)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded transition-opacity disabled:opacity-30 hover:opacity-80"
              >
                <ChevronLeft size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded transition-opacity disabled:opacity-30 hover:opacity-80"
              >
                <ChevronRight size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
