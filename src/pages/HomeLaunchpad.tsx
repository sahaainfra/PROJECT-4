import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, DollarSign,
  Users, Package, ClipboardCheck, HardHat, BarChart3, Activity,
  ArrowUpRight, ArrowDownRight, Minus, Sparkles, Eye, Building2,
  Truck, Shield, AlertCircle, ChevronRight, Zap, Target, Briefcase
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ═══════════════════════════════════════════════════════════
// PREMIUM DASHBOARD — Construction ERP
// "Professional Construction Business Operating System"
// ═══════════════════════════════════════════════════════════

// ── Chart Data ──
const progressData = [
  { month: 'Aug', planned: 32, actual: 30 },
  { month: 'Sep', planned: 38, actual: 36 },
  { month: 'Oct', planned: 45, actual: 43 },
  { month: 'Nov', planned: 52, actual: 50 },
  { month: 'Dec', planned: 58, actual: 55 },
  { month: 'Jan', planned: 66, actual: 62 },
  { month: 'Feb', planned: 72, actual: null },
  { month: 'Mar', planned: 78, actual: null },
];

const cashFlowData = [
  { month: 'Aug', receipts: 2.1, payments: 1.8 },
  { month: 'Sep', receipts: 2.4, payments: 2.2 },
  { month: 'Oct', receipts: 1.9, payments: 2.5 },
  { month: 'Nov', receipts: 2.8, payments: 2.1 },
  { month: 'Dec', receipts: 3.2, payments: 2.9 },
  { month: 'Jan', receipts: 2.6, payments: 2.4 },
];

const costData = [
  { category: 'Civil', budget: 48, actual: 52, forecast: 55 },
  { category: 'Steel', budget: 22, actual: 23, forecast: 24 },
  { category: 'MEP', budget: 18, actual: 14, forecast: 17 },
  { category: 'Finishing', budget: 12, actual: 8, forecast: 11 },
  { category: 'Other', budget: 8, actual: 6, forecast: 7 },
];

const workforceData = [
  { day: 'Mon', present: 186, planned: 210 },
  { day: 'Tue', present: 192, planned: 210 },
  { day: 'Wed', present: 178, planned: 210 },
  { day: 'Thu', present: 195, planned: 210 },
  { day: 'Fri', present: 188, planned: 210 },
  { day: 'Sat', present: 142, planned: 160 },
];

// ── KPI Card Component ──
function KPICard({ title, value, unit, trend, trendValue, status, icon: Icon, iconColor, iconBg, onClick }: {
  title: string; value: string; unit?: string; trend?: 'up' | 'down' | 'flat'; trendValue?: string;
  status: 'positive' | 'negative' | 'warning' | 'neutral'; icon: any; iconColor: string; iconBg: string; onClick?: () => void;
}) {
  const statusColors = {
    positive: { text: 'var(--kpi-positive)', bg: 'var(--kpi-positive-bg)' },
    negative: { text: 'var(--kpi-negative)', bg: 'var(--kpi-negative-bg)' },
    warning: { text: 'var(--kpi-warning)', bg: 'var(--kpi-warning-bg)' },
    neutral: { text: 'var(--kpi-neutral)', bg: 'var(--kpi-neutral-bg)' },
  };
  const colors = statusColors[status];

  return (
    <button onClick={onClick} className="w-full text-left rounded-xl p-4 border transition-all hover:shadow-md group"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', transitionDuration: 'var(--motion-fast)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-md" style={{ background: colors.bg, color: colors.text }}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : trend === 'down' ? <ArrowDownRight size={12} /> : <Minus size={12} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{title}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{value}</span>
        {unit && <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
      </div>
    </button>
  );
}

// ── Section Card ──
function SectionCard({ title, action, children, className = '' }: { title: string; action?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border overflow-hidden ${className}`} style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        {action && (
          <button className="text-[11px] font-medium flex items-center gap-0.5 hover:opacity-80" style={{ color: 'var(--text-link)' }}>
            {action} <ChevronRight size={12} />
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ── Main Dashboard ──
export function HomeLaunchpad() {
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState('riverside');

  const projects = [
    { id: 'riverside', name: 'Riverside Tower', location: 'Pune', value: '₹12.8 Cr', planned: 66, actual: 62.4, health: 'warning' as const, schedule: -4, cost: '+3.2%' },
    { id: 'green', name: 'Green Valley Res.', location: 'Mumbai', value: '₹8.5 Cr', planned: 45, actual: 43.8, health: 'good' as const, schedule: -1, cost: '+1.4%' },
    { id: 'metro', name: 'Metro Link Bridge', location: 'Bangalore', value: '₹24.5 Cr', planned: 90, actual: 89.2, health: 'good' as const, schedule: 0, cost: '-0.8%' },
    { id: 'industrial', name: 'Industrial Park', location: 'Chennai', value: '₹5.2 Cr', planned: 30, actual: 24.1, health: 'critical' as const, schedule: -12, cost: '+8.4%' },
    { id: 'highway', name: 'Highway Expansion', location: 'Hyderabad', value: '₹18.0 Cr', planned: 95, actual: 94.8, health: 'good' as const, schedule: 0, cost: '-1.2%' },
  ];

  const exceptions = [
    { severity: 'critical', title: 'Budget exceeded on Industrial Park', description: 'Cost variance +8.4% — ₹42L over budget', project: 'Industrial Park', owner: 'Vikram Mehta', age: '3 days', action: 'Review' },
    { severity: 'critical', title: 'Cement stock critically low', description: 'Only 15 bags remaining — reorder level: 500', project: 'Riverside Tower', owner: 'Suresh Patel', age: '2 hrs', action: 'Order Now' },
    { severity: 'warning', title: 'Tower B foundation delayed', description: '4.8% behind planned progress', project: 'Riverside Tower', owner: 'Amit Verma', age: '1 day', action: 'Reschedule' },
    { severity: 'warning', title: 'Steel consumption above theoretical', description: 'Actual: 111 MT vs Theoretical: 100 MT (+11%)', project: 'Riverside Tower', owner: 'Suresh Patel', age: '5 hrs', action: 'Investigate' },
    { severity: 'action', title: 'RA Bill #34 pending certification', description: '₹48.5L — submitted 8 days ago', project: 'Green Valley', owner: 'Priya Singh', age: '8 days', action: 'Certify' },
    { severity: 'action', title: 'Safety observation #127 overdue', description: 'Closure pending for 5 days', project: 'Metro Link', owner: 'Ravi Nair', age: '5 days', action: 'Close' },
  ];

  const severityStyles: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    critical: { bg: 'var(--error-50)', border: 'var(--error-500)', text: 'var(--error-700)', badge: 'Critical' },
    warning: { bg: 'var(--warning-50)', border: 'var(--warning-500)', text: 'var(--warning-700)', badge: 'Warning' },
    action: { bg: 'var(--info-50)', border: 'var(--info-500)', text: 'var(--info-700)', badge: 'Action' },
  };

  const healthColors = { good: 'var(--success-500)', warning: 'var(--warning-500)', critical: 'var(--error-500)' };

  const inboxItems = [
    { id: 1, title: 'PO-2024-0142', type: 'Procurement', amount: '₹24.5L', age: '2 hrs', priority: 'high' },
    { id: 2, title: 'Bill #INV-2024-0034', type: 'Finance', amount: '₹48.5L', age: '8 days', priority: 'high' },
    { id: 3, title: 'PR-2024-0088', type: 'Procurement', amount: '₹3.2L', age: '1 day', priority: 'medium' },
    { id: 4, title: 'Change Order #CO-012', type: 'Projects', amount: '₹8.4L', age: '3 days', priority: 'medium' },
    { id: 5, title: 'Material Issue #MI-445', type: 'Stores', amount: '—', age: '4 hrs', priority: 'low' },
  ];

  const aiInsights = [
    { type: 'schedule', severity: 'warning', title: 'Tower B is 4.8% behind planned progress', explanation: 'Based on actual vs planned S-curve analysis. Critical path impact: 4 days.', action: 'View recovery plan', source: 'Schedule Engine' },
    { type: 'cost', severity: 'critical', title: 'Steel consumption 6.2% above theoretical', explanation: '111 MT consumed vs 100 MT theoretical for foundation work. Possible wastage or rework.', action: 'Investigate variance', source: 'Cost Engine' },
    { type: 'workforce', severity: 'neutral', title: '12 additional carpenters may be required next week', explanation: 'Based on upcoming shuttering activities and current productivity rates.', action: 'View manpower plan', source: 'Workforce Analytics' },
    { type: 'cash', severity: 'warning', title: '₹42.5L expected receipts are overdue', explanation: '3 client bills past due date. Oldest: 23 days. Escalation recommended.', action: 'View receivables', source: 'Finance Engine' },
  ];

  return (
    <div className="min-h-full" style={{ background: 'var(--shell-bg)' }}>
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6">
        {/* ═══ EXECUTIVE HEADER ═══ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--kpi-positive-bg)', color: 'var(--kpi-positive)' }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 animate-pulse-soft" style={{ background: 'var(--kpi-positive)' }} />
                Live
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Updated 2 min ago</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Good Morning, Rajesh</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Construction Operations Overview · FY 2024-25 · Q4</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={activeProject} onChange={e => setActiveProject(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border outline-none" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
              <option value="all">All Projects</option>
              <option value="riverside">Riverside Tower</option>
              <option value="green">Green Valley</option>
              <option value="metro">Metro Link</option>
            </select>
            <button className="text-xs px-3 py-2 rounded-lg border font-medium hover:shadow-sm transition-shadow" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              This Quarter
            </button>
            <button className="text-xs px-3 py-2 rounded-lg font-medium text-white transition-opacity hover:opacity-90" style={{ background: 'var(--brand-600)' }}>
              Customize
            </button>
          </div>
        </div>

        {/* ═══ EXECUTIVE KPIs ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <KPICard title="Contract Value" value="₹68.8" unit="Cr" status="neutral" icon={Briefcase} iconColor="var(--brand-600)" iconBg="var(--brand-50)" trend="up" trendValue="12%" />
          <KPICard title="Physical Progress" value="62.4" unit="%" status="warning" icon={Target} iconColor="var(--warning-600)" iconBg="var(--warning-50)" trend="down" trendValue="3.6%" />
          <KPICard title="Financial Progress" value="₹42.6" unit="Cr" status="positive" icon={DollarSign} iconColor="var(--success-600)" iconBg="var(--success-50)" trend="up" trendValue="8.2%" />
          <KPICard title="Cost Performance" value="96.8" unit="%" status="warning" icon={BarChart3} iconColor="var(--warning-600)" iconBg="var(--warning-50)" trend="down" trendValue="1.4%" />
          <KPICard title="Cash Flow" value="₹4.2" unit="Cr" status="positive" icon={Activity} iconColor="var(--success-600)" iconBg="var(--success-50)" trend="up" trendValue="15%" />
          <KPICard title="Receivables" value="₹8.7" unit="Cr" status="negative" icon={DollarSign} iconColor="var(--error-600)" iconBg="var(--error-50)" trend="down" trendValue="5.4%" />
          <KPICard title="Payables" value="₹6.3" unit="Cr" status="neutral" icon={DollarSign} iconColor="var(--brand-600)" iconBg="var(--brand-50)" />
          <KPICard title="Workforce" value="1,245" status="neutral" icon={Users} iconColor="#8B5CF6" iconBg="#F5F3FF" trend="up" trendValue="3%" />
          <KPICard title="Material Stock" value="₹2.8" unit="Cr" status="warning" icon={Package} iconColor="var(--accent-600)" iconBg="var(--accent-50)" trend="down" trendValue="12%" />
          <KPICard title="Pending Approvals" value="12" status="warning" icon={ClipboardCheck} iconColor="var(--accent-600)" iconBg="var(--accent-50)" trend="up" trendValue="+3" />
          <KPICard title="Equipment Active" value="34/42" status="positive" icon={Truck} iconColor="var(--success-600)" iconBg="var(--success-50)" trend="up" trendValue="4%" />
          <KPICard title="Project Health" value="3/5" unit="green" status="warning" icon={CheckCircle2} iconColor="var(--warning-600)" iconBg="var(--warning-50)" />
        </div>

        {/* ═══ ATTENTION REQUIRED ═══ */}
        <SectionCard title="⚡ Attention Required" action="View all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exceptions.map((exc, i) => {
              const style = severityStyles[exc.severity];
              return (
                <div key={i} className="rounded-lg p-3 border-l-[3px] transition-shadow hover:shadow-sm"
                  style={{ background: style.bg, borderLeftColor: style.border }}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded" style={{ background: style.border, color: '#fff' }}>
                      {style.badge}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{exc.age} ago</span>
                  </div>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: style.text }}>{exc.title}</div>
                  <div className="text-[11px] mb-2" style={{ color: 'var(--text-secondary)' }}>{exc.description}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {exc.project} · {exc.owner}
                    </div>
                    <button className="text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors" style={{ background: style.border, color: '#fff' }}>
                      {exc.action}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* ═══ PROJECT HEALTH ═══ */}
        <SectionCard title="Project Health" action="All projects">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left pb-2 pr-3">Project</th>
                  <th className="text-right pb-2 px-2">Value</th>
                  <th className="text-right pb-2 px-2">Progress</th>
                  <th className="text-right pb-2 px-2">Schedule</th>
                  <th className="text-right pb-2 px-2">Cost Var</th>
                  <th className="text-center pb-2 px-2">Health</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="py-2.5 pr-3">
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{p.location}</div>
                    </td>
                    <td className="py-2.5 px-2 text-right text-xs tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>{p.value}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                          <div className="h-full rounded-full" style={{ width: `${p.actual}%`, background: healthColors[p.health] }} />
                        </div>
                        <span className="text-[11px] tabular-nums font-medium w-8 text-right" style={{ color: 'var(--text-primary)' }}>{p.actual}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="text-[11px] tabular-nums font-medium" style={{ color: p.schedule < 0 ? 'var(--kpi-negative)' : 'var(--kpi-positive)' }}>
                        {p.schedule > 0 ? '+' : ''}{p.schedule}d
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span className="text-[11px] tabular-nums font-medium" style={{ color: p.cost.startsWith('+') ? 'var(--kpi-negative)' : 'var(--kpi-positive)' }}>
                        {p.cost}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: healthColors[p.health] + '15', color: healthColors[p.health] }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColors[p.health] }} />
                        {p.health === 'good' ? 'Healthy' : p.health === 'warning' ? 'Attention' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ═══ PROGRESS S-CURVE + FINANCIAL ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Cumulative Progress (S-Curve)" action="Details">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="planned" stroke="var(--chart-1)" strokeWidth={2} fill="url(#plannedGrad)" name="Planned" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="actual" stroke="var(--chart-3)" strokeWidth={2.5} fill="url(#actualGrad)" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Cash Flow (₹ Cr)" action="Details">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="receipts" fill="var(--chart-4)" radius={[3, 3, 0, 0]} name="Receipts" />
                  <Bar dataKey="payments" fill="var(--chart-5)" radius={[3, 3, 0, 0]} name="Payments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* ═══ COST PERFORMANCE + WORKFORCE ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Budget vs Actual vs Forecast (₹ L)" action="Why?">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="budget" fill="var(--chart-1)" radius={[3, 3, 0, 0]} name="Budget" />
                  <Bar dataKey="actual" fill="var(--chart-3)" radius={[3, 3, 0, 0]} name="Actual" />
                  <Bar dataKey="forecast" fill="var(--chart-6)" radius={[3, 3, 0, 0]} name="Forecast" opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Workforce Attendance" action="Details">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workforceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 11 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="planned" stroke="var(--chart-1)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Planned" />
                  <Line type="monotone" dataKey="present" stroke="var(--chart-4)" strokeWidth={2.5} dot={{ r: 3 }} name="Present" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        {/* ═══ SITE EXECUTION + MATERIAL ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Site Execution — Riverside Tower" action="DPR">
            <div className="space-y-3">
              {[
                { trade: 'Concrete (Tower A)', progress: 82, status: 'on-track' },
                { trade: 'Steel Fixing', progress: 71, status: 'delayed' },
                { trade: 'Shuttering', progress: 91, status: 'on-track' },
                { trade: 'Masonry (Block B)', progress: 55, status: 'on-track' },
                { trade: 'Plumbing — Level 3', progress: 34, status: 'behind' },
                { trade: 'Electrical Conduit', progress: 28, status: 'behind' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{item.trade}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>{item.progress}%</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: item.status === 'on-track' ? 'var(--kpi-positive-bg)' : item.status === 'delayed' ? 'var(--kpi-negative-bg)' : 'var(--kpi-warning-bg)',
                          color: item.status === 'on-track' ? 'var(--kpi-positive)' : item.status === 'delayed' ? 'var(--kpi-negative)' : 'var(--kpi-warning)',
                        }}>
                        {item.status === 'on-track' ? 'On Track' : item.status === 'delayed' ? 'Delayed' : 'Behind'}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${item.progress}%`,
                      background: item.status === 'on-track' ? 'var(--success-500)' : item.status === 'delayed' ? 'var(--error-500)' : 'var(--warning-500)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Material Intelligence" action="Stock Report">
            <div className="space-y-3">
              {[
                { material: 'Cement OPC 53', stock: '15 bags', reorder: '500', status: 'critical', variance: null },
                { material: 'TMT Bar 12mm', stock: '12 MT', reorder: '20', status: 'low', variance: null },
                { material: 'Sand (River)', stock: '85 Cum', reorder: '100', status: 'low', variance: null },
                { material: 'Steel Consumption', stock: '111 MT actual', reorder: '100 MT theo', status: 'variance', variance: '+11%' },
                { material: 'Bricks', stock: '35,000 Nos', reorder: '10,000', status: 'ok', variance: null },
                { material: 'Copper Wire', stock: '2,500 Mtr', reorder: '1,000', status: 'ok', variance: null },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: item.status === 'critical' ? 'var(--error-500)' : item.status === 'low' ? 'var(--warning-500)' : item.status === 'variance' ? 'var(--error-500)' : 'var(--success-500)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{item.material}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.variance && (
                      <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded" style={{ background: 'var(--error-50)', color: 'var(--error-600)' }}>
                        {item.variance}
                      </span>
                    )}
                    <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>{item.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ═══ MY INBOX + AI INSIGHTS ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="My Inbox" action="Open all">
            <div className="space-y-2">
              {inboxItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg border transition-colors hover:bg-[var(--card-hover)] cursor-pointer"
                  style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: item.priority === 'high' ? 'var(--error-500)' : item.priority === 'medium' ? 'var(--warning-500)' : 'var(--text-muted)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.type} · {item.age}</div>
                  </div>
                  {item.amount !== '—' && (
                    <span className="text-[11px] font-semibold tabular-nums flex-shrink-0" style={{ color: 'var(--text-primary)' }}>{item.amount}</span>
                  )}
                  <button className="text-[10px] font-medium px-2 py-1 rounded-md flex-shrink-0" style={{ background: 'var(--brand-50)', color: 'var(--brand-600)' }}>
                    Review
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="🧠 Construction AI Insights" action="All insights">
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="p-3 rounded-lg border-l-[3px]"
                  style={{
                    background: insight.severity === 'critical' ? 'var(--error-50)' : insight.severity === 'warning' ? 'var(--warning-50)' : 'var(--info-50)',
                    borderLeftColor: insight.severity === 'critical' ? 'var(--error-500)' : insight.severity === 'warning' ? 'var(--warning-500)' : 'var(--info-500)',
                  }}>
                  <div className="flex items-start gap-2 mb-1">
                    <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-600)' }} />
                    <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{insight.title}</div>
                  </div>
                  <div className="text-[11px] ml-6 mb-2" style={{ color: 'var(--text-secondary)' }}>{insight.explanation}</div>
                  <div className="flex items-center justify-between ml-6">
                    <span className="text-[9px] uppercase tracking-wide font-medium" style={{ color: 'var(--text-muted)' }}>{insight.source}</span>
                    <button className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'var(--brand-600)', color: '#fff' }}>
                      {insight.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ═══ HSE / QUALITY ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--error-50)' }}>
                <AlertTriangle size={16} style={{ color: 'var(--error-600)' }} />
              </div>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>Safety Incidents (MTD)</div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>2</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--kpi-positive)' }}>↓ from 3 last month</div>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--warning-50)' }}>
                <AlertCircle size={16} style={{ color: 'var(--warning-600)' }} />
              </div>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>Open NCRs</div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>4</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--kpi-negative)' }}>2 overdue</div>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--success-50)' }}>
                <Shield size={16} style={{ color: 'var(--success-600)' }} />
              </div>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>Safety Compliance</div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>96%</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--kpi-positive)' }}>↑ from 94%</div>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-50)' }}>
                <ClipboardCheck size={16} style={{ color: 'var(--brand-600)' }} />
              </div>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>Inspection Pass Rate</div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>91%</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--kpi-positive)' }}>↑ from 89%</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 pb-8 text-center">
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Construction ERP · Acme Infrastructure Ltd · FY 2024-25 · Last sync: 15 Jan 2024, 10:32 AM
          </p>
        </div>
      </div>
    </div>
  );
}
