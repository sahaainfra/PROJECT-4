import React from 'react';
import { getIcon } from '../data/registries';
import { widgetRegistry, feedbackEntries, personas } from '../preview/data/previewData';

// ═══════════════════════════════════════════════════════════
// WIDGET STATUS BOARD — Part 02
// Technical Console › Widget Status (PREVIEW/LIVE/PROMOTED)
// Route: /_tech/preview/status
// ═══════════════════════════════════════════════════════════

const statusColors: Record<string, string> = {
  PREVIEW: '#d97706',
  LIVE: '#059669',
  PROMOTED: '#0066cc',
  RETIRED: '#6b7280',
};

const dataModeColors: Record<string, string> = {
  fixture: '#d97706',
  live: '#059669',
};

export function WidgetStatusBoard() {
  const HomeIcon = getIcon('nav.home');
  const EyeIcon = getIcon('sys.eye');

  const totalWidgets = widgetRegistry.length;
  const previewCount = widgetRegistry.filter(w => w.status === 'PREVIEW').length;
  const liveCount = widgetRegistry.filter(w => w.status === 'LIVE').length;
  const promotedCount = widgetRegistry.filter(w => w.status === 'PROMOTED').length;
  const totalFeedback = feedbackEntries.length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--shell-bg)' }}>
      {/* Minimal Shell Bar */}
      <header className="h-10 flex items-center px-4 gap-3 border-b"
        style={{ background: 'var(--shell-bar-bg)', color: 'var(--shell-bar-text)', borderColor: 'var(--border-color)' }}>
        <a href="/" className="flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity">
          <HomeIcon size={14} />
          <span>Back to App</span>
        </a>
        <span className="opacity-30">|</span>
        <EyeIcon size={14} />
        <span className="text-xs font-medium">Widget Status Board — Part 02</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--semantic-info)', color: '#fff' }}>
          TECH_ADMIN
        </span>
      </header>

      <div className="p-[var(--density-spacing-xl)] max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-[var(--density-spacing-xl)]">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Widget Status Board
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Part 02 — Preview → Live → Promoted lifecycle tracking · ff.preview enabled
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: statusColors.PREVIEW, color: '#fff' }}>
              {previewCount} PREVIEW
            </span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: statusColors.LIVE, color: '#fff' }}>
              {liveCount} LIVE
            </span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: statusColors.PROMOTED, color: '#fff' }}>
              {promotedCount} PROMOTED
            </span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--shell-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
              {totalWidgets} total widgets
            </span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--semantic-info)', color: '#fff' }}>
              {totalFeedback} feedback entries
            </span>
          </div>
        </div>

        {/* Summary by Persona */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-[var(--density-spacing-xl)]">
          {personas.map(persona => {
            const personaWidgets = widgetRegistry.filter(w => w.persona === persona.id);
            return (
              <div key={persona.id} className="rounded-[var(--density-border-radius)] p-3"
                style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: persona.color }}>
                    {persona.avatar}
                  </div>
                  <div>
                    <div className="text-[10px] font-medium" style={{ color: 'var(--text-primary)' }}>{persona.role}</div>
                  </div>
                </div>
                <div className="text-lg font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {personaWidgets.length}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>widgets</div>
              </div>
            );
          })}
        </div>

        {/* Widget Registry Table */}
        <div className="rounded-[var(--density-border-radius)] overflow-hidden mb-[var(--density-spacing-xl)]"
          style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Widget Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--shell-bg)' }}>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Code</th>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Persona</th>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>KPI Codes</th>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Source Part</th>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Future API</th>
                  <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
                  <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Data</th>
                  <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {widgetRegistry.map(widget => {
                  const persona = personas.find(p => p.id === widget.persona);
                  const feedbackCount = feedbackEntries.filter(f => f.widgetCode === widget.code).length;
                  return (
                    <tr key={widget.code} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <td className="px-4 py-2">
                        <code className="text-xs font-medium" style={{ color: 'var(--brand-primary)' }}>{widget.code}</code>
                      </td>
                      <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-primary)' }}>{widget.title}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white"
                            style={{ background: persona?.color || '#666' }}>
                            {persona?.avatar || '?'}
                          </div>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{persona?.role || widget.persona}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{widget.kpiCodes.join(', ')}</code>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-secondary)' }}>{widget.futureSourcePrompt}</span>
                      </td>
                      <td className="px-4 py-2">
                        <code className="text-[9px] break-all max-w-[150px] block" style={{ color: 'var(--text-muted)' }}>{widget.futureApi}</code>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{ background: `${statusColors[widget.status]}20`, color: statusColors[widget.status] }}>
                          {widget.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ background: `${dataModeColors[widget.dataMode]}20`, color: dataModeColors[widget.dataMode] }}>
                          {widget.dataMode}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-xs tabular-nums" style={{ color: feedbackCount > 0 ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
                          {feedbackCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Log */}
        <div className="rounded-[var(--density-border-radius)] overflow-hidden"
          style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Feedback Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--shell-bg)' }}>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Widget</th>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Screen</th>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Reviewer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Comment</th>
                  <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Decision</th>
                  <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbackEntries.map((fb, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="px-4 py-2">
                      <code className="text-xs" style={{ color: 'var(--brand-primary)' }}>{fb.widgetCode}</code>
                    </td>
                    <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-primary)' }}>{fb.screen}</td>
                    <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{fb.reviewer}</td>
                    <td className="px-4 py-2 text-xs max-w-[300px] truncate" style={{ color: 'var(--text-secondary)' }}>{fb.comment}</td>
                    <td className="px-4 py-2 text-center">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: fb.decision === 'accepted' ? 'var(--semantic-success)' : fb.decision === 'change_requested' ? 'var(--semantic-warning)' : 'var(--text-muted)',
                          color: '#fff'
                        }}>
                        {fb.decision}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>{fb.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lifecycle Legend */}
        <div className="mt-[var(--density-spacing-xl)] rounded-[var(--density-border-radius)] p-4"
          style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Widget Lifecycle</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { status: 'PREVIEW', desc: 'Fixture data, stakeholder review', color: statusColors.PREVIEW },
              { status: 'ACCEPTED', desc: 'Layout approved, awaiting live API', color: '#7c3aed' },
              { status: 'LIVE', desc: 'Reading from staging API', color: statusColors.LIVE },
              { status: 'PROMOTED', desc: 'In production dashboard', color: statusColors.PROMOTED },
              { status: 'RETIRED', desc: 'Preview copy removed', color: statusColors.RETIRED },
            ].map((item, i) => (
              <React.Fragment key={item.status}>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: `${item.color}15` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-[10px] font-medium" style={{ color: item.color }}>{item.status}</span>
                </div>
                <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
                {i < 4 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
