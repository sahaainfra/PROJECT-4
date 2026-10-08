import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Building2, FileText, ShoppingCart, Package, Users, Calculator,
  ClipboardCheck, HardHat, Truck, Wrench, BarChart3, Settings,
  ChevronRight, Briefcase, HardHat as Helmet, Ruler, Shield,
  FolderOpen, MessageSquare, Bell, User, type LucideIcon
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// PREMIUM SIDEBAR — Construction ERP
// ═══════════════════════════════════════════════════════════

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
  badge?: number;
  badgeColor?: string;
  children?: { id: string; label: string; route: string; badge?: number }[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { id: 'home', label: 'Dashboard', icon: Home, route: '/' },
    ],
  },
  {
    title: 'Project Management',
    items: [
      {
        id: 'projects', label: 'Projects', icon: Building2, route: '/projects', badge: 5,
        children: [
          { id: 'proj-list', label: 'Project Register', route: '/projects/list' },
          { id: 'proj-boq', label: 'BOQ', route: '/projects/boq' },
        ],
      },
      { id: 'docs', label: 'Engineering & Docs', icon: FolderOpen, route: '/projects' },
    ],
  },
  {
    title: 'Execution',
    items: [
      { id: 'estimation', label: 'Estimation & Commercial', icon: Ruler, route: '/projects/boq' },
      { id: 'site', label: 'Site Execution', icon: HardHat, route: '/projects/list', badge: 3, badgeColor: 'var(--warning-600)' },
    ],
  },
  {
    title: 'Supply Chain',
    items: [
      {
        id: 'procurement', label: 'Procurement', icon: ShoppingCart, route: '/procurement', badge: 8,
        children: [
          { id: 'pr', label: 'Purchase Requisitions', route: '/procurement/requisitions' },
          { id: 'po', label: 'Purchase Orders', route: '/procurement/orders', badge: 5 },
        ],
      },
      {
        id: 'inventory', label: 'Stores & Inventory', icon: Package, route: '/inventory',
        children: [
          { id: 'grn', label: 'Goods Receipt', route: '/inventory/grn' },
          { id: 'stock', label: 'Stock Register', route: '/inventory/stock' },
        ],
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      { id: 'plant', label: 'Plant & Equipment', icon: Truck, route: '/projects' },
      {
        id: 'hr', label: 'Workforce', icon: Users, route: '/hr',
        children: [
          { id: 'attendance', label: 'Attendance', route: '/hr/attendance' },
        ],
      },
    ],
  },
  {
    title: 'Control',
    items: [
      { id: 'quality', label: 'Quality & HSE', icon: Shield, route: '/projects', badge: 2, badgeColor: 'var(--error-600)' },
      {
        id: 'finance', label: 'Finance', icon: Calculator, route: '/finance', badge: 6, badgeColor: 'var(--accent-400)',
        children: [
          { id: 'bills', label: 'Subcontractor Bills', route: '/finance/bills' },
        ],
      },
    ],
  },
  {
    title: 'Insights',
    items: [
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, route: '/reports' },
      { id: 'collab', label: 'Collaboration', icon: MessageSquare, route: '/' },
    ],
  },
];

interface SideNavigationProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SideNavigation({ collapsed, onNavigate }: SideNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['procurement']));

  const isActive = (route: string) => {
    if (route === '/') return location.pathname === '/';
    return location.pathname.startsWith(route);
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.route);
    const expanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    if (collapsed) {
      return (
        <button
          key={item.id}
          onClick={() => {
            if (hasChildren) toggleExpand(item.id);
            else { navigate(item.route); onNavigate?.(); }
          }}
          className="w-full flex items-center justify-center py-3 rounded-xl transition-all group relative"
          style={{
            background: active ? 'var(--nav-active-bg)' : 'transparent',
            color: active ? 'var(--nav-active-text)' : 'var(--text-secondary)',
            transitionDuration: 'var(--motion-fast)',
          }}
          title={item.label}
        >
          <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
          {item.badge && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center"
              style={{ background: item.badgeColor || 'var(--brand-600)', color: '#fff' }}>
              {item.badge}
            </span>
          )}
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity shadow-lg"
            style={{ background: 'var(--surface-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
            {item.label}
          </div>
        </button>
      );
    }

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) toggleExpand(item.id);
            else { navigate(item.route); onNavigate?.(); }
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left relative group"
          style={{
            background: active ? 'var(--nav-active-bg)' : 'transparent',
            color: active ? 'var(--nav-active-text)' : 'var(--text-secondary)',
            transitionDuration: 'var(--motion-fast)',
          }}
        >
          {/* Active indicator */}
          {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: 'var(--nav-active-border)' }} />
          )}
          <Icon size={18} strokeWidth={active ? 2.2 : 1.8} className="flex-shrink-0" />
          <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
          {item.badge && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md min-w-[20px] text-center"
              style={{ background: (item.badgeColor || 'var(--brand-600)') + '15', color: item.badgeColor || 'var(--brand-600)' }}>
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight size={14} className={`transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}
              style={{ transitionDuration: 'var(--motion-fast)', color: 'var(--text-muted)' }} />
          )}
        </button>
        {/* Children */}
        {hasChildren && expanded && (
          <div className="ml-5 mt-0.5 mb-1 pl-3 border-l" style={{ borderColor: 'var(--border-subtle)' }}>
            {item.children!.map(child => {
              const childActive = isActive(child.route);
              return (
                <button
                  key={child.id}
                  onClick={() => { navigate(child.route); onNavigate?.(); }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-left transition-colors text-[12px]"
                  style={{
                    color: childActive ? 'var(--nav-active-text)' : 'var(--text-muted)',
                    fontWeight: childActive ? 500 : 400,
                    transitionDuration: 'var(--motion-fast)',
                  }}
                >
                  <span>{child.label}</span>
                  {child.badge && (
                    <span className="text-[9px] font-semibold px-1 py-0.5 rounded" style={{ background: 'var(--badge-default-bg)', color: 'var(--badge-default-text)' }}>
                      {child.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={`h-full overflow-y-auto overflow-x-hidden flex flex-col ${collapsed ? 'px-2 py-3' : 'px-3 py-4'}`}
      style={{ background: 'var(--nav-bg)' }}
      aria-label="Main navigation"
    >
      {navSections.map(section => (
        <div key={section.title} className="mb-3">
          {!collapsed && (
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--nav-section)' }}>
              {section.title}
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            {section.items.map(renderNavItem)}
          </div>
        </div>
      ))}

      {/* Bottom section */}
      {!collapsed && (
        <div className="mt-auto pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <Settings size={18} strokeWidth={1.8} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════
// MOBILE BOTTOM NAVIGATION
// ═══════════════════════════════════════════════════════════

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: Home, label: 'Home', route: '/' },
    { icon: ClipboardCheck, label: 'Tasks', route: '/procurement/orders' },
    { icon: Briefcase, label: 'Projects', route: '/projects/list' },
    { icon: Bell, label: 'Alerts', route: '/reports' },
    { icon: User, label: 'More', route: '/hr/attendance' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 border-t md:hidden z-30"
      style={{ background: 'var(--surface-bg)', borderColor: 'var(--border-subtle)', paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
      {items.map(item => {
        const active = item.route === '/' ? location.pathname === '/' : location.pathname.startsWith(item.route);
        const Icon = item.icon;
        return (
          <button key={item.label} onClick={() => navigate(item.route)}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg min-w-[52px]"
            style={{ color: active ? 'var(--brand-600)' : 'var(--text-muted)', minHeight: 'var(--density-touch)' }}>
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}


