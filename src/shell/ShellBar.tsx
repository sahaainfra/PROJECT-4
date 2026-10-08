import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useFeatureFlags } from '../contexts/FeatureFlagContext';
import { getIcon, flattenNav, navigationRegistry, type NavEntry } from '../data/registries';

// ═══════════════════════════════════════════════════════════
// SHELL BAR (DS-12)
// ═══════════════════════════════════════════════════════════

interface ShellBarProps {
  onToggleNav: () => void;
  navCollapsed: boolean;
}

export function ShellBar({ onToggleNav, navCollapsed }: ShellBarProps) {
  const { theme, setTheme, density, setDensity } = useTheme();
  const { isEnabled } = useFeatureFlags();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NavEntry[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Command palette (Ctrl/⌘ K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 100);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const allNav = flattenNav(navigationRegistry);
    const filtered = allNav.filter(entry =>
      entry.isActive &&
      isEnabled(entry.featureFlag) &&
      (entry.label.toLowerCase().includes(query.toLowerCase()) ||
        entry.keywords.some(k => k.includes(query.toLowerCase())))
    );
    setSearchResults(filtered.slice(0, 8));
  };

  const ShellIcon = getIcon('nav.menu');
  const SearchIcon = getIcon('nav.search');
  const BellIcon = getIcon('nav.notifications');
  const UserIcon = getIcon('nav.user');
  const SunIcon = getIcon('sys.theme-light');
  const MoonIcon = getIcon('sys.theme-dark');
  const MonitorIcon = getIcon('sys.theme-hc');
  const ChevronIcon = getIcon('action.navigate');
  const CloseIcon = getIcon('nav.close');
  const CommandIcon = getIcon('sys.command');

  const notifications = [
    { id: 1, type: 'action', title: 'PO-2024-0142 awaiting approval', time: '5 min ago' },
    { id: 2, type: 'info', title: 'GRN-0089 posted successfully', time: '12 min ago' },
    { id: 3, type: 'warning', title: 'Material shortage alert: Cement OPC 53', time: '1 hr ago' },
    { id: 4, type: 'info', title: 'Monthly attendance report ready', time: '2 hr ago' },
  ];

  return (
    <>
      <header
        className="h-[var(--density-shell-height)] flex items-center px-[var(--density-spacing-md)] gap-[var(--density-spacing-md)]"
        style={{ background: 'var(--shell-bar-bg)', color: 'var(--shell-bar-text)' }}
      >
        {/* Menu toggle */}
        <button
          onClick={onToggleNav}
          className="p-2 rounded-[var(--density-border-radius)] hover:opacity-80 transition-opacity"
          aria-label={navCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <ShellIcon size={20} />
        </button>

        {/* Logo / App name */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-semibold text-sm tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs"
            style={{ background: 'var(--brand-primary)', color: '#fff' }}>
            ERP
          </div>
          <span className="hidden sm:inline">Construction ERP</span>
        </button>

        {/* Context Switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setContextOpen(!contextOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--density-border-radius)] text-xs hover:opacity-80 transition-opacity border border-white/20"
          >
            <span className="opacity-70">Acme Infra Ltd</span>
            <span className="opacity-40">|</span>
            <span>Riverside Tower</span>
            <ChevronIcon size={12} className="opacity-60" />
          </button>
          {contextOpen && (
            <div className="absolute top-full mt-1 left-0 w-64 rounded-[var(--density-border-radius)] shadow-lg z-50 animate-fade-in"
              style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-color)' }}>
              <div className="p-3">
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>COMPANY</div>
                <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Acme Infra Ltd</div>
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>PROJECT</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Riverside Tower — Phase II</div>
              </div>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <button
          onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--density-border-radius)] text-xs border border-white/20 hover:opacity-80 transition-opacity"
        >
          <SearchIcon size={14} className="opacity-60" />
          <span className="hidden sm:inline opacity-60">Search...</span>
          <span className="hidden lg:flex items-center gap-0.5 opacity-40 text-[10px]">
            <CommandIcon size={10} />K
          </span>
        </button>

        {/* Theme switcher */}
        <div className="hidden lg:flex items-center gap-0.5">
          <button
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded transition-opacity ${theme === 'light' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            aria-label="Light theme"
          >
            <SunIcon size={16} />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded transition-opacity ${theme === 'dark' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            aria-label="Dark theme"
          >
            <MoonIcon size={16} />
          </button>
          <button
            onClick={() => setTheme('high-contrast')}
            className={`p-1.5 rounded transition-opacity ${theme === 'high-contrast' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            aria-label="High contrast theme"
          >
            <MonitorIcon size={16} />
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-[var(--density-border-radius)] hover:opacity-80 transition-opacity relative"
            aria-label="Notifications"
          >
            <BellIcon size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--semantic-error)' }} />
          </button>
          {notifOpen && (
            <div className="absolute top-full mt-1 right-0 w-80 rounded-[var(--density-border-radius)] shadow-lg z-50 animate-fade-in"
              style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-color)' }}>
              <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--semantic-error)', color: '#fff' }}>4</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="px-3 py-2.5 border-b cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: n.type === 'action' ? 'var(--brand-primary)' : n.type === 'warning' ? 'var(--semantic-warning)' : 'var(--semantic-info)' }} />
                      <div>
                        <div className="text-xs" style={{ color: 'var(--text-primary)' }}>{n.title}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-[var(--density-border-radius)] hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
              style={{ background: 'var(--brand-primary)', color: '#fff' }}>
              RK
            </div>
            <span className="hidden md:inline text-xs">Rajesh Kumar</span>
          </button>
          {userMenuOpen && (
            <div className="absolute top-full mt-1 right-0 w-56 rounded-[var(--density-border-radius)] shadow-lg z-50 animate-fade-in"
              style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-color)' }}>
              <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Rajesh Kumar</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Project Manager</div>
              </div>
              <div className="p-1">
                <div className="text-xs font-medium px-2 py-1 mt-1" style={{ color: 'var(--text-muted)' }}>DENSITY</div>
                <div className="flex gap-1 px-2 pb-2">
                  {(['compact', 'cozy', 'touch'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      className={`flex-1 text-[10px] py-1 rounded transition-colors ${density === d ? 'font-medium' : 'opacity-60 hover:opacity-100'}`}
                      style={density === d ? { background: 'var(--brand-primary)', color: '#fff' } : {}}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button className="w-full text-left px-3 py-2 text-xs rounded hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-secondary)' }}>
                  Preferences
                </button>
                <button className="w-full text-left px-3 py-2 text-xs rounded hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-secondary)' }}>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          style={{ background: 'var(--overlay-bg)' }}
          onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-xl rounded-lg shadow-lg overflow-hidden animate-fade-in"
            style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-color)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <SearchIcon size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search modules, pages, records..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
                onKeyDown={e => {
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 rounded hover:opacity-70">
                <CloseIcon size={16} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="max-h-64 overflow-y-auto p-2">
                {searchResults.map(result => {
                  const Icon = getIcon(result.iconKey);
                  return (
                    <button
                      key={result.id}
                      onClick={() => { navigate(result.route); setSearchOpen(false); setSearchQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-[var(--density-border-radius)] text-left hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Icon size={16} style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <div className="text-sm">{result.label}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{result.group}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="p-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
