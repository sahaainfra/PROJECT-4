import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  Menu, Search, Bell, User, Sun, Moon, Monitor, Command,
  ChevronDown, X, Plus, Sparkles, Building2, Calendar
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// PREMIUM SHELL BAR — Construction ERP
// ═══════════════════════════════════════════════════════════

interface ShellBarProps {
  onToggleNav: () => void;
  navCollapsed: boolean;
}

export function ShellBar({ onToggleNav, navCollapsed }: ShellBarProps) {
  const { theme, setTheme, density, setDensity } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setAiOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const notifications = [
    { id: 1, type: 'critical', title: 'Tower B foundation delay — 4.8% behind schedule', time: '5m', module: 'Projects' },
    { id: 2, type: 'action', title: 'PO-2024-0142 awaiting your approval (₹24.5L)', time: '12m', module: 'Procurement' },
    { id: 3, type: 'warning', title: 'Cement stock below reorder level — Site Store A', time: '28m', module: 'Stores' },
    { id: 4, type: 'info', title: 'RA Bill #34 certified — ₹48.5L', time: '1h', module: 'Finance' },
    { id: 5, type: 'action', title: 'Safety observation #127 requires closure', time: '2h', module: 'HSE' },
  ];

  const searchSuggestions = [
    { label: 'Projects', items: ['Riverside Tower', 'Green Valley Residences', 'Metro Link Bridge'] },
    { label: 'Actions', items: ['Create Purchase Order', 'Mark Attendance', 'New GRN', 'Generate Report'] },
    { label: 'Recent', items: ['PO-2024-0142', 'GRN-0089', 'Bill #INV-0034'] },
  ];

  const aiSuggestions = [
    'Show projects delayed this week',
    'Which site has highest material variance?',
    'Prepare today\'s management summary',
    'Show pending RA bills',
    'Which workers are absent today?',
  ];

  const typeColors: Record<string, string> = {
    critical: 'var(--error-600)',
    action: 'var(--brand-600)',
    warning: 'var(--warning-600)',
    info: 'var(--info-600)',
  };

  return (
    <>
      <header
        className="flex items-center px-4 gap-3 border-b relative z-30"
        style={{
          height: 'var(--density-shell-h)',
          background: 'var(--shell-bar-bg)',
          color: 'var(--shell-bar-text)',
          borderColor: 'var(--shell-bar-border)',
        }}
      >
        {/* Menu toggle */}
        <button
          onClick={onToggleNav}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ transitionDuration: 'var(--motion-fast)' }}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}>
            <Building2 size={16} />
          </div>
          <div className="hidden lg:block">
            <div className="text-sm font-semibold tracking-tight leading-none">Construction ERP</div>
            <div className="text-[10px] opacity-60 leading-none mt-0.5">Acme Infrastructure Ltd</div>
          </div>
        </button>

        {/* Context Switcher */}
        <div className="relative hidden md:block ml-2">
          <button
            onClick={() => setContextOpen(!contextOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="flex flex-col items-start">
              <span className="opacity-60 text-[10px] leading-none">Project</span>
              <span className="font-medium leading-tight">Riverside Tower — Phase II</span>
            </div>
            <ChevronDown size={14} className="opacity-50" />
          </button>
          {contextOpen && (
            <div className="absolute top-full mt-2 left-0 w-72 rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden"
              style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-subtle)' }}>
              <div className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Company</div>
                <div className="text-sm font-medium px-2 py-1.5 rounded-lg" style={{ background: 'var(--nav-active-bg)', color: 'var(--nav-active-text)' }}>Acme Infrastructure Ltd</div>
              </div>
              <div className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Project</div>
                <div className="text-sm font-medium px-2 py-1.5 rounded-lg" style={{ background: 'var(--nav-active-bg)', color: 'var(--nav-active-text)' }}>Riverside Tower — Phase II</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Period</div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Calendar size={14} />
                  <span>FY 2024-25 · Q4</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <button
          onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-white/10 hover:bg-white/10 transition-colors min-w-[180px] lg:min-w-[260px]"
        >
          <Search size={14} className="opacity-50" />
          <span className="opacity-50 hidden sm:inline">Search projects, BOQs, vendors, bills...</span>
          <span className="hidden lg:flex items-center gap-0.5 opacity-40 text-[10px] ml-auto bg-white/10 px-1.5 py-0.5 rounded">
            <Command size={10} />K
          </span>
        </button>

        {/* Create Button */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:shadow-md"
          style={{ background: 'var(--accent-400)', color: 'var(--accent-900)' }}>
          <Plus size={14} />
          <span className="hidden lg:inline">Create</span>
        </button>

        {/* AI Assistant */}
        <button
          onClick={() => setAiOpen(!aiOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
          aria-label="AI Assistant"
        >
          <Sparkles size={18} className="text-amber-300" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
              style={{ background: 'var(--error-500)', color: '#fff' }}>
              {notifications.length}
            </span>
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute top-full mt-2 right-0 w-96 rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden"
                style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-subtle)' }}>
                <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--error-50)', color: 'var(--error-600)' }}>
                    {notifications.length} unread
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 border-b hover:bg-[var(--card-hover)] cursor-pointer transition-colors"
                      style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: typeColors[n.type] }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs leading-snug" style={{ color: 'var(--text-primary)' }}>{n.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--badge-default-bg)', color: 'var(--badge-default-text)' }}>{n.module}</span>
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{n.time} ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button className="w-full text-center text-xs py-1.5 rounded-lg hover:bg-[var(--card-hover)] transition-colors" style={{ color: 'var(--text-link)' }}>
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Switcher */}
        <div className="hidden lg:flex items-center rounded-lg border border-white/10 overflow-hidden">
          <button onClick={() => setTheme('light')} className={`p-1.5 transition-colors ${theme === 'light' ? 'bg-white/20' : 'hover:bg-white/10'}`} aria-label="Light">
            <Sun size={14} />
          </button>
          <button onClick={() => setTheme('dark')} className={`p-1.5 transition-colors ${theme === 'dark' ? 'bg-white/20' : 'hover:bg-white/10'}`} aria-label="Dark">
            <Moon size={14} />
          </button>
          <button onClick={() => setTheme('high-contrast')} className={`p-1.5 transition-colors ${theme === 'high-contrast' ? 'bg-white/20' : 'hover:bg-white/10'}`} aria-label="High Contrast">
            <Monitor size={14} />
          </button>
        </div>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}>
              RK
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-medium leading-none">Rajesh Kumar</div>
              <div className="text-[10px] opacity-60 leading-none mt-0.5">Project Manager</div>
            </div>
          </button>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute top-full mt-2 right-0 w-56 rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden"
                style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-subtle)' }}>
                <div className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Rajesh Kumar</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>rajesh.k@acme-infra.com</div>
                </div>
                <div className="p-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1" style={{ color: 'var(--text-muted)' }}>Density</div>
                  <div className="flex gap-1 px-1">
                    {(['compact', 'cozy', 'touch'] as const).map(d => (
                      <button key={d} onClick={() => setDensity(d)}
                        className="flex-1 text-[10px] py-1.5 rounded-md font-medium transition-colors"
                        style={density === d ? { background: 'var(--brand-600)', color: '#fff' } : { color: 'var(--text-secondary)' }}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-[var(--card-hover)] transition-colors" style={{ color: 'var(--text-secondary)' }}>Preferences</button>
                  <button className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-[var(--card-hover)] transition-colors" style={{ color: 'var(--text-secondary)' }}>Help & Support</button>
                  <button className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-[var(--card-hover)] transition-colors" style={{ color: 'var(--error-600)' }}>Sign Out</button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ═══ Global Search Overlay ═══ */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]" style={{ background: 'var(--overlay-bg)' }} onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fade-in" style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-subtle)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects, BOQs, workers, vendors, bills, materials..."
                className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)} />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>ESC</kbd>
            </div>
            <div className="p-3 max-h-80 overflow-y-auto">
              {searchSuggestions.map(group => (
                <div key={group.label} className="mb-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1" style={{ color: 'var(--text-muted)' }}>{group.label}</div>
                  {group.items.map(item => (
                    <button key={item} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-[var(--card-hover)] transition-colors text-sm" style={{ color: 'var(--text-primary)' }}>
                      {item}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ AI Assistant Panel ═══ */}
      {aiOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]" style={{ background: 'var(--overlay-bg)' }} onClick={() => setAiOpen(false)}>
          <div className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-in" style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-subtle)' }} onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-400), var(--accent-600))' }}>
                <Sparkles size={16} style={{ color: '#fff' }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Construction AI</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Ask anything about your projects</div>
              </div>
              <button onClick={() => setAiOpen(false)} className="ml-auto p-1 rounded hover:bg-[var(--card-hover)]">
                <X size={16} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            <div className="p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Try asking</div>
              <div className="space-y-1.5">
                {aiSuggestions.map(s => (
                  <button key={s} className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[var(--card-hover)] transition-colors border" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    "{s}"
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 border rounded-lg px-3 py-2" style={{ borderColor: 'var(--border-subtle)' }}>
                <input placeholder="Ask Construction AI..." className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
                <button className="px-3 py-1 rounded-md text-xs font-medium text-white" style={{ background: 'var(--brand-600)' }}>Ask</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
