import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Plus,
  Edit3,
  Save,
  X,
  RefreshCw,
  Settings,
  GripVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Bell,
  ListTodo,
  Building2,
  DollarSign,
  Package,
  Users,
  LineChart,
  PieChart,
  Shield,
  Award,
  Zap,
  ArrowRight,
} from 'lucide-react';
import {
  dashboardWidgets,
  dashboardKpis,
  getWidgetByCode,
  getKpiByCode,
  getKpiStatus,
  sampleKpiData,
  sampleListData,
  sampleChartData,
  type DashboardWidget,
  type DashboardLayout,
  type WidgetPosition,
  type DeviceType,
  type KpiWidgetData,
  type ListWidgetData,
  type ChartWidgetData,
} from '../data/dashboardData';
import {
  getEffectiveLayout,
  saveUserLayout,
  resetToRoleDefault,
  getWidgetData,
  getDashboardStats,
} from '../core/DashboardService';
import { getQuickActionsForUser } from '../data/dashboardData';

// ═══════════════════════════════════════════════════════════
// DASHBOARD WORKSPACE — Part 20
// Route: /home/dash
// ═══════════════════════════════════════════════════════════

export function DashboardWorkspace() {
  // Current user and role (in production, from auth context)
  const currentUserId = 'user-001';
  const currentRoleId = 'role-004'; // Project Manager
  
  // Detect device type
  const [device, setDevice] = useState<DeviceType>('desktop');
  
  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width < 768) setDevice('mobile');
      else if (width < 1024) setDevice('tablet');
      else setDevice('desktop');
    };
    
    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  const [editMode, setEditMode] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [layout, setLayout] = useState<DashboardLayout | null>(null);
  const [widgetData, setWidgetData] = useState<Record<string, any>>({});
  const [loadingWidgets, setLoadingWidgets] = useState<Set<string>>(new Set());
  const [errorWidgets, setErrorWidgets] = useState<Set<string>>(new Set());

  // Load layout
  useEffect(() => {
    const effectiveLayout = getEffectiveLayout(currentUserId, currentRoleId, device);
    setLayout(effectiveLayout);
  }, [currentUserId, currentRoleId, device]);

  // Load widget data
  useEffect(() => {
    if (!layout) return;

    const loadWidgetData = async () => {
      const newData: Record<string, any> = {};
      const loading = new Set<string>();
      const errors = new Set<string>();

      for (const position of layout.layout_json) {
        loading.add(position.widgetCode);
        try {
          const data = getWidgetData(position.widgetCode, currentUserId, position.filters);
          if (data) {
            newData[position.widgetCode] = data;
          }
          loading.delete(position.widgetCode);
        } catch (error) {
          console.error(`Failed to load widget ${position.widgetCode}:`, error);
          loading.delete(position.widgetCode);
          errors.add(position.widgetCode);
        }
      }

      setWidgetData(newData);
      setLoadingWidgets(loading);
      setErrorWidgets(errors);
    };

    loadWidgetData();
  }, [layout, currentUserId]);

  const handleSaveLayout = () => {
    if (!layout) return;

    saveUserLayout({
      userId: currentUserId,
      device,
      name: 'My Custom Layout',
      layout: layout.layout_json,
    });

    setEditMode(false);
    alert('Layout saved successfully');
  };

  const handleResetLayout = () => {
    const roleLayout = resetToRoleDefault(currentUserId, currentRoleId, device);
    if (roleLayout) {
      setLayout(roleLayout);
      setEditMode(false);
      alert('Layout reset to role default');
    }
  };

  const handleRefresh = () => {
    // Trigger data reload
    setLayout(layout ? { ...layout } : null);
  };

  if (!layout) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--shell-bg)' }}>
        <div className="text-center">
          <LayoutDashboard size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No Dashboard Layout Found
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Please contact your administrator to set up a default layout.
          </p>
        </div>
      </div>
    );
  }

  const gridColumns = device === 'mobile' ? 12 : device === 'tablet' ? 12 : 12;

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <LayoutDashboard size={24} style={{ color: 'var(--brand-600)' }} />
              My Workspace
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Your personalized dashboard • {device.charAt(0).toUpperCase() + device.slice(1)} view
            </p>
          </div>
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  onClick={() => setShowGallery(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  <Plus size={14} />
                  Add Widget
                </button>
                <button
                  onClick={handleResetLayout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  <RefreshCw size={14} />
                  Reset
                </button>
                <button
                  onClick={handleSaveLayout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                  style={{ background: 'var(--success-600)', color: '#fff' }}
                >
                  <Save size={14} />
                  Save Layout
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  <X size={14} />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                  style={{ background: 'var(--brand-600)', color: '#fff' }}
                >
                  <Edit3 size={14} />
                  Edit Layout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gridAutoRows: 'minmax(100px, auto)',
          }}
        >
          {layout.layout_json.map((position, index) => {
            const widget = getWidgetByCode(position.widgetCode);
            if (!widget) return null;

            const data = widgetData[position.widgetCode];
            const isLoading = loadingWidgets.has(position.widgetCode);
            const hasError = errorWidgets.has(position.widgetCode);

            return (
              <WidgetContainer
                key={`${position.widgetCode}-${index}`}
                widget={widget}
                position={position}
                data={data}
                isLoading={isLoading}
                hasError={hasError}
                editMode={editMode}
                device={device}
                onRemove={() => {
                  const newLayout = {
                    ...layout,
                    layout_json: layout.layout_json.filter((_, i) => i !== index),
                  };
                  setLayout(newLayout);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Widget Gallery Drawer */}
      {showGallery && (
        <WidgetGalleryDrawer
          onClose={() => setShowGallery(false)}
          onAddWidget={(widgetCode) => {
            const widget = getWidgetByCode(widgetCode);
            if (!widget || !layout) return;

            const defaultSize = widget.default_size[device];
            const newPosition: WidgetPosition = {
              widgetCode,
              x: 0,
              y: layout.layout_json.length * 2,
              w: defaultSize.w,
              h: defaultSize.h,
            };

            const newLayout = {
              ...layout,
              layout_json: [...layout.layout_json, newPosition],
            };
            setLayout(newLayout);
            setShowGallery(false);
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WIDGET CONTAINER
// ═══════════════════════════════════════════════════════════

interface WidgetContainerProps {
  widget: DashboardWidget;
  position: WidgetPosition;
  data: any;
  isLoading: boolean;
  hasError: boolean;
  editMode: boolean;
  device: DeviceType;
  onRemove: () => void;
}

function WidgetContainer({
  widget,
  position,
  data,
  isLoading,
  hasError,
  editMode,
  device,
  onRemove,
}: WidgetContainerProps) {
  const gridStyle: React.CSSProperties = {
    gridColumn: `span ${position.w}`,
    gridRow: `span ${position.h}`,
  };

  const getWidgetIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      CheckCircle: <CheckCircle size={16} />,
      ListTodo: <ListTodo size={16} />,
      Bell: <Bell size={16} />,
      Building2: <Building2 size={16} />,
      TrendingUp: <TrendingUp size={16} />,
      DollarSign: <DollarSign size={16} />,
      Package: <Package size={16} />,
      Users: <Users size={16} />,
      LineChart: <LineChart size={16} />,
      PieChart: <PieChart size={16} />,
      Shield: <Shield size={16} />,
      AlertTriangle: <AlertTriangle size={16} />,
      Award: <Award size={16} />,
      Zap: <Zap size={16} />,
      Clock: <Clock size={16} />,
    };
    return icons[iconName] || <LayoutDashboard size={16} />;
  };

  return (
    <div
      style={gridStyle}
      className="relative"
    >
      {editMode && (
        <div
          className="absolute top-2 right-2 z-10 flex items-center gap-1"
          style={{ background: 'var(--surface-bg)', padding: '4px', borderRadius: '6px', boxShadow: 'var(--shadow-sm)' }}
        >
          <GripVertical size={14} style={{ color: 'var(--text-muted)', cursor: 'move' }} />
          <button
            onClick={onRemove}
            className="p-1 rounded hover:bg-[var(--error-50)]"
            title="Remove widget"
          >
            <X size={14} style={{ color: 'var(--error-600)' }} />
          </button>
        </div>
      )}

      <div
        className="h-full rounded-xl border overflow-hidden"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        {/* Widget Header */}
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <div style={{ color: 'var(--brand-600)' }}>
              {getWidgetIcon(widget.icon)}
            </div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {widget.name}
            </h3>
          </div>
          {data?.asOf && (
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Updated: {new Date(data.asOf).toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Widget Content */}
        <div className="p-4 h-[calc(100%-52px)] overflow-auto">
          {isLoading ? (
            <WidgetLoading />
          ) : hasError ? (
            <WidgetError widgetName={widget.name} />
          ) : !data ? (
            <WidgetEmpty widgetName={widget.name} />
          ) : (
            <>
              {widget.type === 'kpi' && <KpiWidget data={data} widget={widget} />}
              {widget.type === 'list' && <ListWidget data={data} widget={widget} />}
              {widget.type === 'chart' && <ChartWidget data={data} widget={widget} />}
              {widget.type === 'custom' && widget.code === 'quick_actions' && (
                <QuickActionsWidget userId="user-001" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// KPI WIDGET
// ═══════════════════════════════════════════════════════════

function KpiWidget({ data, widget }: { data: KpiWidgetData; widget: DashboardWidget }) {
  const kpi = getKpiByCode(widget.code.replace('kpi_', ''));
  
  const getTrendIcon = () => {
    if (!data.previous) return null;
    
    const current = typeof data.value === 'number' ? data.value : parseFloat(data.value);
    const previous = typeof data.previous === 'number' ? data.previous : parseFloat(data.previous);
    
    if (current > previous) return <TrendingUp size={14} style={{ color: 'var(--success-600)' }} />;
    if (current < previous) return <TrendingDown size={14} style={{ color: 'var(--error-600)' }} />;
    return <Minus size={14} style={{ color: 'var(--text-muted)' }} />;
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'green': return 'var(--success-600)';
      case 'amber': return 'var(--warning-600)';
      case 'red': return 'var(--error-600)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
          {data.label}
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-3xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {typeof data.value === 'number' ? data.value.toFixed(1) : data.value}
          </div>
          {data.unit && (
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {data.unit}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          {data.previous && (
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              vs {typeof data.previous === 'number' ? data.previous.toFixed(1) : data.previous}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: getStatusColor() }} />
          <span className="text-xs font-medium" style={{ color: getStatusColor() }}>
            {data.status.toUpperCase()}
          </span>
        </div>
      </div>

      {data.trend && data.trend.length > 0 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-end justify-between h-8">
            {data.trend.map((point, i) => {
              const maxValue = Math.max(...data.trend!.map(p => p.value));
              const height = (point.value / maxValue) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 mx-0.5 rounded-t"
                  style={{
                    height: `${height}%`,
                    background: 'var(--brand-600)',
                    opacity: 0.2 + (i / data.trend!.length) * 0.8,
                  }}
                  title={`${point.period}: ${point.value}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {data.drillLink && (
        <a
          href={data.drillLink}
          className="mt-3 flex items-center gap-1 text-xs font-medium hover:opacity-80"
          style={{ color: 'var(--brand-600)' }}
        >
          View Details <ArrowRight size={12} />
        </a>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LIST WIDGET
// ═══════════════════════════════════════════════════════════

function ListWidget({ data, widget }: { data: ListWidgetData; widget: DashboardWidget }) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'var(--error-700)';
      case 'high': return 'var(--error-600)';
      case 'medium': return 'var(--warning-600)';
      case 'low': return 'var(--info-600)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="space-y-2">
      {data.items.slice(0, 5).map((item) => (
        <a
          key={item.id}
          href={item.link || '#'}
          className="block p-3 rounded-lg border hover:bg-[var(--card-hover)] transition-colors"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </div>
              {item.subtitle && (
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {item.subtitle}
                </div>
              )}
            </div>
            {item.priority && (
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                style={{ background: getPriorityColor(item.priority) }}
              />
            )}
          </div>
          {item.status && (
            <div className="text-[10px] px-2 py-0.5 rounded-full inline-block"
              style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
              {item.status}
            </div>
          )}
        </a>
      ))}
      {data.totalCount > 5 && (
        <div className="text-xs text-center pt-2" style={{ color: 'var(--text-muted)' }}>
          +{data.totalCount - 5} more
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CHART WIDGET
// ═══════════════════════════════════════════════════════════

function ChartWidget({ data, widget }: { data: ChartWidgetData; widget: DashboardWidget }) {
  // Simple chart visualization (in production, use a charting library)
  if (data.type === 'line' || data.type === 'area') {
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-end justify-between gap-2 mb-2">
          {data.labels.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col gap-0.5" style={{ height: '80px' }}>
                {data.datasets.map((dataset, j) => {
                  const height = (dataset.data[i] / maxValue) * 100;
                  return (
                    <div
                      key={j}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${height}%`,
                        background: dataset.color || 'var(--brand-600)',
                        opacity: 0.6 + (j * 0.2),
                      }}
                      title={`${dataset.label}: ${dataset.data[i]}`}
                    />
                  );
                })}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          {data.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: dataset.color || 'var(--brand-600)' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {dataset.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'pie') {
    const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
    let currentAngle = 0;

    return (
      <div className="h-full flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.datasets[0].data.map((value, i) => {
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              const radius = 40;
              const centerX = 50;
              const centerY = 50;
              const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
              const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
              const endX = centerX + radius * Math.cos((startAngle + angle - 90) * Math.PI / 180);
              const endY = centerY + radius * Math.sin((startAngle + angle - 90) * Math.PI / 180);
              const largeArcFlag = angle > 180 ? 1 : 0;

              return (
                <path
                  key={i}
                  d={`M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                  fill={data.datasets[0].color || `hsl(${i * 60}, 70%, 60%)`}
                  opacity={0.8}
                />
              );
            })}
          </svg>
        </div>
        <div className="ml-4 space-y-2">
          {data.labels.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ background: data.datasets[0].color || `hsl(${i * 60}, 70%, 60%)` }}
              />
              <div>
                <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {data.datasets[0].data[i]} ({((data.datasets[0].data[i] / total) * 100).toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════
// QUICK ACTIONS WIDGET
// ═══════════════════════════════════════════════════════════

function QuickActionsWidget({ userId }: { userId: string }) {
  const actions = getQuickActionsForUser(userId);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {actions.map((action: any) => (
        <a
          key={action.id}
          href={action.action_route}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-[var(--card-hover)] transition-colors whitespace-nowrap"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <Zap size={14} style={{ color: 'var(--brand-600)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
            {action.action_name}
          </span>
        </a>
      ))}
      {actions.length === 0 && (
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          No quick actions configured
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WIDGET STATES
// ═══════════════════════════════════════════════════════════

function WidgetLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
    </div>
  );
}

function WidgetError({ widgetName }: { widgetName: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <XCircle size={24} className="mb-2" style={{ color: 'var(--error-600)' }} />
      <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        Failed to load {widgetName}
      </div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        Please try refreshing the page
      </div>
    </div>
  );
}

function WidgetEmpty({ widgetName }: { widgetName: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <LayoutDashboard size={24} className="mb-2" style={{ color: 'var(--text-muted)' }} />
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
        No data available for {widgetName}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WIDGET GALLERY DRAWER
// ═══════════════════════════════════════════════════════════

interface WidgetGalleryDrawerProps {
  onClose: () => void;
  onAddWidget: (widgetCode: string) => void;
}

function WidgetGalleryDrawer({ onClose, onAddWidget }: WidgetGalleryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState<string>('ALL');

  const modules = Array.from(new Set(dashboardWidgets.map(w => w.module)));

  const filteredWidgets = dashboardWidgets.filter(widget => {
    const matchesSearch = searchQuery === '' ||
      widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesModule = filterModule === 'ALL' || widget.module === filterModule;

    return matchesSearch && matchesModule;
  });

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: 'var(--overlay-bg)' }}>
      <div className="flex-1" onClick={onClose} />
      <div
        className="w-96 h-full overflow-y-auto"
        style={{ background: 'var(--surface-bg)', borderLeft: '1px solid var(--border-subtle)' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Widget Gallery
            </h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
              <X size={20} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />

            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            >
              <option value="ALL">All Modules</option>
              {modules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <div className="space-y-2">
              {filteredWidgets.map(widget => (
                <div
                  key={widget.code}
                  className="p-3 rounded-lg border hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--border-subtle)' }}
                  onClick={() => onAddWidget(widget.code)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div style={{ color: 'var(--brand-600)' }}>
                        {widget.icon === 'CheckCircle' && <CheckCircle size={16} />}
                        {widget.icon === 'ListTodo' && <ListTodo size={16} />}
                        {widget.icon === 'Bell' && <Bell size={16} />}
                        {widget.icon === 'Building2' && <Building2 size={16} />}
                        {widget.icon === 'TrendingUp' && <TrendingUp size={16} />}
                        {widget.icon === 'DollarSign' && <DollarSign size={16} />}
                        {widget.icon === 'Package' && <Package size={16} />}
                        {widget.icon === 'Users' && <Users size={16} />}
                        {widget.icon === 'LineChart' && <LineChart size={16} />}
                        {widget.icon === 'PieChart' && <PieChart size={16} />}
                        {widget.icon === 'Shield' && <Shield size={16} />}
                        {widget.icon === 'AlertTriangle' && <AlertTriangle size={16} />}
                        {widget.icon === 'Award' && <Award size={16} />}
                        {widget.icon === 'Zap' && <Zap size={16} />}
                        {widget.icon === 'Clock' && <Clock size={16} />}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {widget.name}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {widget.module} • {widget.type}
                        </div>
                      </div>
                    </div>
                    <Plus size={16} style={{ color: 'var(--brand-600)' }} />
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {widget.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
