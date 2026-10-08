import React, { useState } from 'react';
import { type WidgetPayload, type WidgetDefinition, feedbackEntries } from '../data/previewData';
import { getIcon } from '../../data/registries';

// ═══════════════════════════════════════════════════════════
// PREVIEW WIDGETS — Part 02
// KPI Cards, Charts, Tables with PREVIEW badges
// ═══════════════════════════════════════════════════════════

interface PreviewWidgetProps {
  definition: WidgetDefinition;
  payload: WidgetPayload;
  size?: 'small' | 'medium' | 'large';
}

// ── PREVIEW Badge ──
function PreviewBadge({ widgetCode, futureApi }: { widgetCode: string; futureApi: string }) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="relative">
      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
        style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fbbf24' }}>
        <span className="w-1 h-1 rounded-full" style={{ background: '#f59e0b' }} />
        PREVIEW DATA
      </span>
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="ml-1 text-[9px] px-1 py-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
        style={{ background: 'var(--shell-bg)', color: 'var(--text-muted)' }}
        title="Show data source"
      >
        ?
      </button>
      {showInfo && (
        <div className="absolute top-full right-0 mt-1 w-56 p-2 rounded text-[10px] z-50 shadow-md animate-fade-in"
          style={{ background: 'var(--elevated-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
          <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Future Data Source</div>
          <div>Widget: <code>{widgetCode}</code></div>
          <div>API: <code className="break-all">{futureApi}</code></div>
          <div className="mt-1 opacity-70">Currently reading from fixture file</div>
        </div>
      )}
    </div>
  );
}

// ── Status Indicator ──
function StatusDot({ status }: { status?: string }) {
  const colors: Record<string, string> = {
    good: 'var(--semantic-success)',
    warning: 'var(--semantic-warning)',
    critical: 'var(--semantic-error)',
    neutral: 'var(--text-muted)',
  };
  return (
    <span className="w-2 h-2 rounded-full inline-block" style={{ background: colors[status || 'neutral'] }} />
  );
}

// ── Mini Sparkline ──
function Sparkline({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

// ── KPI Card Widget ──
export function KPICardWidget({ definition, payload, size = 'medium' }: PreviewWidgetProps) {
  const trendColor = payload.trend && payload.trend.length >= 2
    ? payload.trend[payload.trend.length - 1].value >= payload.trend[0].value
      ? 'var(--kpi-positive)' : 'var(--kpi-negative)'
    : 'var(--kpi-neutral)';

  return (
    <div className={`rounded-[var(--density-border-radius)] p-4 transition-shadow hover:shadow-md ${
      size === 'large' ? 'col-span-2' : ''
    }`} style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <StatusDot status={payload.status} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{payload.label}</span>
        </div>
        <PreviewBadge widgetCode={definition.code} futureApi={definition.futureApi} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {typeof payload.value === 'number' ? payload.value.toLocaleString() : payload.value}
          </div>
          {payload.previous && (
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Previous: {typeof payload.previous === 'number' ? payload.previous.toLocaleString() : payload.previous}
            </div>
          )}
        </div>
        {payload.trend && payload.trend.length > 1 && (
          <div className="flex flex-col items-end gap-1">
            <Sparkline data={payload.trend} color={trendColor} />
            <span className="text-[9px] tabular-nums" style={{ color: trendColor }}>
              {payload.trend[payload.trend.length - 1].value > payload.trend[0].value ? '↑' : '↓'}
              {' '}
              {Math.abs(payload.trend[payload.trend.length - 1].value - payload.trend[0].value).toFixed(1)}
            </span>
          </div>
        )}
      </div>
      {payload.formula && (
        <div className="mt-2 pt-2 border-t text-[9px] opacity-60" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          <code>{payload.formula}</code>
        </div>
      )}
      <div className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
        As of: {payload.asOf}
      </div>
    </div>
  );
}

// ── Table Widget ──
interface TableWidgetProps {
  definition: WidgetDefinition;
  title: string;
  columns: { key: string; label: string; align?: 'left' | 'right' }[];
  data: Record<string, any>[];
  size?: 'small' | 'medium' | 'large';
}

export function TableWidget({ definition, title, columns, data, size = 'medium' }: TableWidgetProps) {
  return (
    <div className={`rounded-[var(--density-border-radius)] overflow-hidden ${
      size === 'large' ? 'col-span-2' : ''
    }`} style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="px-4 py-2.5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)' }}>
        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{title}</span>
        <PreviewBadge widgetCode={definition.code} futureApi={definition.futureApi} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--shell-bg)' }}>
              {columns.map(col => (
                <th key={col.key} className="px-3 py-1.5 text-[10px] font-medium text-left"
                  style={{ color: 'var(--text-muted)', textAlign: col.align || 'left' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                {columns.map(col => (
                  <td key={col.key} className="px-3 py-1.5 text-xs tabular-nums"
                    style={{ color: 'var(--text-primary)', textAlign: col.align || 'left' }}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Progress Widget ──
interface ProgressWidgetProps {
  definition: WidgetDefinition;
  title: string;
  items: { label: string; value: number; max: number; color?: string }[];
}

export function ProgressWidget({ definition, title, items }: ProgressWidgetProps) {
  return (
    <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{title}</span>
        <PreviewBadge widgetCode={definition.code} futureApi={definition.futureApi} />
      </div>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{item.value}/{item.max}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--shell-bg)' }}>
              <div className="h-full rounded-full transition-all" style={{
                width: `${(item.value / item.max) * 100}%`,
                background: item.color || 'var(--brand-primary)',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Activity Feed Widget ──
interface ActivityFeedProps {
  definition: WidgetDefinition;
  title: string;
  items: { time: string; text: string; type: 'info' | 'warning' | 'success' | 'error' }[];
}

export function ActivityFeedWidget({ definition, title, items }: ActivityFeedProps) {
  const typeColors: Record<string, string> = {
    info: 'var(--semantic-info)',
    warning: 'var(--semantic-warning)',
    success: 'var(--semantic-success)',
    error: 'var(--semantic-error)',
  };

  return (
    <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{title}</span>
        <PreviewBadge widgetCode={definition.code} futureApi={definition.futureApi} />
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: typeColors[item.type] }} />
            <div className="flex-1 min-w-0">
              <div className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{item.text}</div>
              <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Gate Status Widget (Protocol) ──
interface GateStatusProps {
  definition: WidgetDefinition;
  gates: { stage: string; status: 'passed' | 'pending' | 'blocked' | 'skipped' }[];
}

export function GateStatusWidget({ definition, gates }: GateStatusProps) {
  const statusColors: Record<string, string> = {
    passed: 'var(--semantic-success)',
    pending: 'var(--semantic-warning)',
    blocked: 'var(--semantic-error)',
    skipped: 'var(--text-muted)',
  };
  const statusIcons: Record<string, string> = {
    passed: '✓',
    pending: '◷',
    blocked: '✗',
    skipped: '—',
  };

  return (
    <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Protocol Gate Status</span>
        <PreviewBadge widgetCode={definition.code} futureApi={definition.futureApi} />
      </div>
      <div className="flex items-center gap-0">
        {gates.map((gate, i) => (
          <React.Fragment key={gate.stage}>
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `${statusColors[gate.status]}20`, color: statusColors[gate.status], border: `2px solid ${statusColors[gate.status]}` }}>
                {statusIcons[gate.status]}
              </div>
              <span className="text-[8px] mt-1 font-medium" style={{ color: statusColors[gate.status] }}>{gate.stage}</span>
            </div>
            {i < gates.length - 1 && (
              <div className="flex-1 h-0.5 mx-1" style={{ background: gate.status === 'passed' ? statusColors.passed : 'var(--border-color)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Feedback Drawer ──
export function FeedbackDrawer({ widgetCode, onClose }: { widgetCode: string; onClose: () => void }) {
  const [comment, setComment] = useState('');
  const [decision, setDecision] = useState<'accepted' | 'change_requested'>('change_requested');
  const existingFeedback = feedbackEntries.filter(f => f.widgetCode === widgetCode);

  return (
    <div className="fixed bottom-0 right-0 w-80 h-96 rounded-tl-[var(--density-border-radius)] shadow-lg flex flex-col z-50 animate-fade-in"
      style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-color)' }}>
      <div className="px-4 py-2.5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)' }}>
        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Feedback — {widgetCode}</span>
        <button onClick={onClose} className="text-xs hover:opacity-70" style={{ color: 'var(--text-muted)' }}>✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {existingFeedback.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Previous Feedback</div>
            {existingFeedback.map((fb, i) => (
              <div key={i} className="mb-2 p-2 rounded text-[10px]" style={{ background: 'var(--shell-bg)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{fb.reviewer}</span>
                  <span className="px-1 py-0.5 rounded text-[8px] font-medium"
                    style={{
                      background: fb.decision === 'accepted' ? 'var(--semantic-success)' : fb.decision === 'change_requested' ? 'var(--semantic-warning)' : 'var(--text-muted)',
                      color: '#fff'
                    }}>
                    {fb.decision}
                  </span>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>{fb.comment}</div>
                <div className="mt-1" style={{ color: 'var(--text-muted)' }}>{fb.createdAt}</div>
              </div>
            ))}
          </div>
        )}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Add Feedback</div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Your comment..."
            className="w-full h-16 p-2 rounded text-xs resize-none border outline-none focus:ring-1"
            style={{ borderColor: 'var(--border-color)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setDecision('accepted')}
              className={`flex-1 text-[10px] py-1.5 rounded font-medium ${decision === 'accepted' ? 'text-white' : ''}`}
              style={{ background: decision === 'accepted' ? 'var(--semantic-success)' : 'var(--shell-bg)', color: decision === 'accepted' ? '#fff' : 'var(--text-secondary)' }}
            >
              ✓ Accept
            </button>
            <button
              onClick={() => setDecision('change_requested')}
              className={`flex-1 text-[10px] py-1.5 rounded font-medium ${decision === 'change_requested' ? 'text-white' : ''}`}
              style={{ background: decision === 'change_requested' ? 'var(--semantic-warning)' : 'var(--shell-bg)', color: decision === 'change_requested' ? '#fff' : 'var(--text-secondary)' }}
            >
              ↻ Change Request
            </button>
          </div>
          <button className="w-full mt-2 text-xs py-2 rounded font-medium text-white transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-primary)' }}>
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
