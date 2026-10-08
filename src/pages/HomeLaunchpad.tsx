import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../data/registries';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';

// ═══════════════════════════════════════════════════════════
// HOME LAUNCHPAD (DS-16, DS-25)
// Role spaces with launch tiles, KPI cards
// ═══════════════════════════════════════════════════════════

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  iconKey: string;
  color?: string;
}

function KPICard({ title, value, trend, trendValue, iconKey, color }: KPICardProps) {
  const Icon = getIcon(iconKey);
  const TrendIcon = trend === 'up' ? getIcon('kpi.trending-up') : trend === 'down' ? getIcon('kpi.trending-down') : null;

  return (
    <div className="rounded-[var(--density-border-radius)] p-4 transition-shadow hover:shadow-md"
      style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{title}</div>
          <div className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-1">
              {TrendIcon && <TrendIcon size={12} style={{ color: trend === 'up' ? 'var(--kpi-positive)' : trend === 'down' ? 'var(--kpi-negative)' : 'var(--kpi-neutral)' }} />}
              <span className="text-xs tabular-nums" style={{ color: trend === 'up' ? 'var(--kpi-positive)' : trend === 'down' ? 'var(--kpi-negative)' : 'var(--kpi-neutral)' }}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: color ? `${color}15` : 'var(--nav-active)' }}>
          <Icon size={20} style={{ color: color || 'var(--brand-primary)' }} />
        </div>
      </div>
    </div>
  );
}

interface LaunchTileProps {
  title: string;
  subtitle: string;
  iconKey: string;
  route: string;
  count?: number;
  color: string;
}

function LaunchTile({ title, subtitle, iconKey, route, count, color }: LaunchTileProps) {
  const navigate = useNavigate();
  const Icon = getIcon(iconKey);

  return (
    <button
      onClick={() => navigate(route)}
      className="rounded-[var(--density-border-radius)] p-4 text-left transition-all hover:shadow-md hover:-translate-y-0.5 group"
      style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {count !== undefined && count > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full tabular-nums"
            style={{ background: `${color}15`, color }}>
            {count}
          </span>
        )}
      </div>
      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{title}</div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</div>
    </button>
  );
}

export function HomeLaunchpad() {
  const { isEnabled } = useFeatureFlags();

  return (
    <div className="p-[var(--density-spacing-xl)] max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="mb-[var(--density-spacing-xl)]">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Good morning, Rajesh
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Riverside Tower — Phase II · Monday, 15 January 2024
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--density-spacing-md)] mb-[var(--density-spacing-xl)]">
        <KPICard
          title="Pending Approvals"
          value={12}
          trend="up"
          trendValue="+3 today"
          iconKey="status.progress"
          color="var(--brand-primary)"
        />
        <KPICard
          title="Open Purchase Orders"
          value={47}
          trend="neutral"
          trendValue="₹2.4 Cr"
          iconKey="module.procurement"
          color="var(--semantic-info)"
        />
        <KPICard
          title="Material Issues Today"
          value={23}
          trend="down"
          trendValue="-5 vs yesterday"
          iconKey="module.inventory"
          color="var(--semantic-warning)"
        />
        <KPICard
          title="Site Attendance"
          value="186/210"
          trend="up"
          trendValue="88.6%"
          iconKey="module.hr"
          color="var(--semantic-success)"
        />
      </div>

      {/* Quick Actions / Launch Tiles */}
      <div className="mb-[var(--density-spacing-xl)]">
        <h2 className="text-sm font-semibold mb-[var(--density-spacing-md)]" style={{ color: 'var(--text-secondary)' }}>
          QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[var(--density-spacing-md)]">
          <LaunchTile
            title="New Purchase Order"
            subtitle="Create PO from PR"
            iconKey="module.procurement"
            route="/procurement/orders"
            count={5}
            color="#0066cc"
          />
          <LaunchTile
            title="Goods Receipt"
            subtitle="Record material receipt"
            iconKey="module.inventory"
            route="/inventory/grn"
            count={3}
            color="#059669"
          />
          <LaunchTile
            title="Mark Attendance"
            subtitle="Daily labour attendance"
            iconKey="module.hr"
            route="/hr/attendance"
            color="#d97706"
          />
          <LaunchTile
            title="Site Diary"
            subtitle="Daily progress report"
            iconKey="module.project"
            route="/projects/list"
            color="#7c3aed"
          />
          <LaunchTile
            title="Subcontractor Bill"
            subtitle="Process running bill"
            iconKey="module.finance"
            route="/finance/bills"
            count={2}
            color="#dc2626"
          />
        </div>
      </div>

      {/* Module Overview */}
      <div className="mb-[var(--density-spacing-xl)]">
        <h2 className="text-sm font-semibold mb-[var(--density-spacing-md)]" style={{ color: 'var(--text-secondary)' }}>
          MODULE OVERVIEW
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--density-spacing-md)]">
          {/* Procurement Summary */}
          <div className="rounded-[var(--density-border-radius)] p-4"
            style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              {React.createElement(getIcon('module.procurement'), { size: 18, style: { color: '#0066cc' } })}
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Procurement</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Pending PRs</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>8</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Open POs</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>47</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Awaiting GRN</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--semantic-warning)' }}>12</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Overdue Deliveries</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--semantic-error)' }}>3</span>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <div className="rounded-[var(--density-border-radius)] p-4"
            style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              {React.createElement(getIcon('module.project'), { size: 18, style: { color: '#7c3aed' } })}
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Projects</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Active Projects</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>5</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>BOQ Value</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>₹12.8 Cr</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Completion</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--semantic-success)' }}>67%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Schedule Variance</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--semantic-warning)' }}>-4 days</span>
              </div>
            </div>
          </div>

          {/* Finance Summary */}
          <div className="rounded-[var(--density-border-radius)] p-4"
            style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              {React.createElement(getIcon('module.finance'), { size: 18, style: { color: '#dc2626' } })}
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Finance</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Pending Bills</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>6</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Payments Due</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>₹48.2 L</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>TDS Outstanding</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--semantic-warning)' }}>₹3.1 L</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Budget Utilized</span>
                <span className="font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>72%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-semibold mb-[var(--density-spacing-md)]" style={{ color: 'var(--text-secondary)' }}>
          RECENT ACTIVITY
        </h2>
        <div className="rounded-[var(--density-border-radius)] overflow-hidden"
          style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          {[
            { action: 'PO-2024-0142 created', user: 'Amit Sharma', time: '10 min ago', type: 'procurement' },
            { action: 'GRN-0089 posted for PO-2024-0138', user: 'Suresh Patel', time: '25 min ago', type: 'inventory' },
            { action: 'Attendance marked for Site A', user: 'Rajesh Kumar', time: '1 hr ago', type: 'hr' },
            { action: 'Bill #INV-2024-0034 approved', user: 'Priya Singh', time: '2 hr ago', type: 'finance' },
            { action: 'BOQ revised for WBS 3.2.1', user: 'Vikram Mehta', time: '3 hr ago', type: 'project' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0"
              style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: item.type === 'procurement' ? '#0066cc' :
                    item.type === 'inventory' ? '#059669' :
                    item.type === 'hr' ? '#d97706' :
                    item.type === 'finance' ? '#dc2626' : '#7c3aed'
                }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.action}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.user}</div>
              </div>
              <div className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
