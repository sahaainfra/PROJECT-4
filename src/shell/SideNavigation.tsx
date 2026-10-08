import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import { getIcon, navigationRegistry, type NavEntry } from '../data/registries';

// ═══════════════════════════════════════════════════════════
// SIDE NAVIGATION (DS-12, DS-29)
// Full side nav on desktop, rail mode, mobile bottom nav
// ═══════════════════════════════════════════════════════════

interface SideNavigationProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SideNavigation({ collapsed, onNavigate }: SideNavigationProps) {
  const { isEnabled } = useFeatureFlags();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const isActive = (route: string) => {
    if (route === '/') return location.pathname === '/';
    return location.pathname.startsWith(route);
  };

  const topLevelEntries = navigationRegistry.filter(
    e => !e.parentId && e.isActive && isEnabled(e.featureFlag)
  );

  const ChevronIcon = getIcon('action.navigate');

  const renderEntry = (entry: NavEntry, depth: number = 0) => {
    const Icon = getIcon(entry.iconKey);
    const active = isActive(entry.route);
    const hasChildren = entry.children && entry.children.length > 0;
    const expanded = expandedGroups.has(entry.id);

    if (collapsed) {
      // Rail mode — icon only with tooltip
      return (
        <button
          key={entry.id}
          onClick={() => {
            if (hasChildren) {
              toggleGroup(entry.id);
            } else {
              navigate(entry.route);
              onNavigate?.();
            }
          }}
          className={`w-full flex items-center justify-center py-3 rounded-[var(--density-border-radius)] transition-colors group relative ${
            active ? 'font-medium' : 'hover:opacity-80'
          }`}
          style={{
            background: active ? 'var(--nav-active)' : 'transparent',
            color: active ? 'var(--nav-active-text)' : 'var(--text-secondary)',
          }}
          title={entry.label}
          aria-label={entry.label}
        >
          <Icon size={20} />
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
            style={{ background: 'var(--elevated-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            {entry.label}
          </div>
        </button>
      );
    }

    return (
      <div key={entry.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleGroup(entry.id);
            } else {
              navigate(entry.route);
              onNavigate?.();
            }
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-[var(--density-border-radius)] transition-colors text-left ${
            active ? 'font-medium' : 'hover:opacity-80'
          }`}
          style={{
            background: active ? 'var(--nav-active)' : 'transparent',
            color: active ? 'var(--nav-active-text)' : 'var(--text-secondary)',
            paddingLeft: depth > 0 ? `${12 + depth * 16}px` : '12px',
          }}
        >
          <Icon size={18} className="flex-shrink-0" />
          <span className="flex-1 text-sm truncate">{entry.label}</span>
          {hasChildren && (
            <ChevronIcon
              size={14}
              className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          )}
          {entry.badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--semantic-error)', color: '#fff' }}>
              {entry.badge}
            </span>
          )}
        </button>
        {/* Children */}
        {hasChildren && expanded && (
          <div className="mt-0.5">
            {entry.children!.filter(c => c.isActive && isEnabled(c.featureFlag)).map(child => renderEntry(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Group entries
  const groups = new Map<string, NavEntry[]>();
  topLevelEntries.forEach(entry => {
    const group = entry.group;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(entry);
  });

  return (
    <nav
      className={`h-full overflow-y-auto overflow-x-hidden py-[var(--density-spacing-sm)] flex flex-col gap-0.5 ${
        collapsed ? 'px-[var(--density-spacing-xs)]' : 'px-[var(--density-spacing-sm)]'
      }`}
      style={{ background: 'var(--nav-bg)' }}
      aria-label="Main navigation"
    >
      {Array.from(groups.entries()).map(([groupName, entries]) => (
        <div key={groupName} className="mb-1">
          {!collapsed && (
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}>
              {groupName}
            </div>
          )}
          {entries.map(entry => renderEntry(entry))}
        </div>
      ))}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════
// MOBILE BOTTOM NAVIGATION (DS-29)
// ═══════════════════════════════════════════════════════════

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const HomeIcon = getIcon('nav.home');
  const InboxIcon = getIcon('nav.notifications');
  const PlusIcon = getIcon('action.add');
  const TaskIcon = getIcon('status.progress');
  const MoreIcon = getIcon('action.more');

  const items = [
    { icon: HomeIcon, label: 'Home', route: '/' },
    { icon: InboxIcon, label: 'Inbox', route: '/procurement/orders' },
    { icon: PlusIcon, label: 'Capture', route: '/procurement/requisitions' },
    { icon: TaskIcon, label: 'Tasks', route: '/projects/list' },
    { icon: MoreIcon, label: 'More', route: '/reports' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 border-t md:hidden"
      style={{ background: 'var(--surface-bg)', borderColor: 'var(--border-color)' }}>
      {items.map(item => {
        const active = item.route === '/' ? location.pathname === '/' : location.pathname.startsWith(item.route);
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.route)}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-[var(--density-border-radius)]"
            style={{ color: active ? 'var(--brand-primary)' : 'var(--text-muted)' }}
          >
            <item.icon size={20} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
