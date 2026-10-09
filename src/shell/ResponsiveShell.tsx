import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Menu,
  Home,
  ClipboardCheck,
  Briefcase,
  Bell,
  User,
  MoreHorizontal,
  X,
  ChevronLeft,
  Settings,
  LogOut,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { detectDeviceType, getDeviceCapabilities } from '../data/deviceData';
import { addConnectivityListeners, isOnline } from '../core/DeviceService';

// ═══════════════════════════════════════════════════════════
// RESPONSIVE SHELL — Part 21
// Mobile + Tablet + Desktop Experience
// ═══════════════════════════════════════════════════════════

export function ResponsiveShell() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [online, setOnline] = useState(isOnline());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    // Detect device type on mount and resize
    const updateDeviceType = () => {
      setDeviceType(detectDeviceType());
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);

    // Listen for connectivity changes
    const cleanup = addConnectivityListeners(
      () => setOnline(true),
      () => setOnline(false)
    );

    return () => {
      window.removeEventListener('resize', updateDeviceType);
      cleanup();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--shell-bg)' }}>
      {/* Offline Banner */}
      {!online && (
        <div className="px-4 py-2 text-xs font-medium text-center" style={{ background: 'var(--warning-50)', color: 'var(--warning-700)' }}>
          <WifiOff size={12} className="inline mr-1" />
          You are offline. Some features may be unavailable.
        </div>
      )}

      {/* Render appropriate shell based on device type */}
      {deviceType === 'mobile' && (
        <MobileShell
          menuOpen={mobileMenuOpen}
          onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={() => setUserMenuOpen(!userMenuOpen)}
        />
      )}
      {deviceType === 'tablet' && (
        <TabletShell
          menuOpen={mobileMenuOpen}
          onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={() => setUserMenuOpen(!userMenuOpen)}
        />
      )}
      {deviceType === 'desktop' && (
        <DesktopShell
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={() => setUserMenuOpen(!userMenuOpen)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MOBILE SHELL
// ═══════════════════════════════════════════════════════════

interface ShellProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
  userMenuOpen: boolean;
  onToggleUserMenu: () => void;
}

function MobileShell({ menuOpen, onToggleMenu, userMenuOpen, onToggleUserMenu }: ShellProps) {
  const navigate = useNavigate();
  const capabilities = getDeviceCapabilities();

  const bottomNavItems = [
    { icon: Home, label: 'Home', route: '/' },
    { icon: ClipboardCheck, label: 'Tasks', route: '/home/wf' },
    { icon: Briefcase, label: 'Projects', route: '/projects/list' },
    { icon: Bell, label: 'Alerts', route: '/home/rt' },
    { icon: MoreHorizontal, label: 'More', route: '/home/dash' },
  ];

  return (
    <>
      {/* Top Bar */}
      <header
        className="flex items-center justify-between px-4 border-b"
        style={{
          height: '56px',
          background: 'var(--shell-bar-bg)',
          color: 'var(--shell-bar-text)',
          borderColor: 'var(--shell-bar-border)',
        }}
      >
        <button
          onClick={onToggleMenu}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}
          >
            ERP
          </div>
          <span className="text-sm font-semibold">Construction ERP</span>
        </div>

        <button
          onClick={onToggleUserMenu}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="User menu"
        >
          <User size={20} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0"
            style={{ background: 'var(--overlay-bg)' }}
            onClick={onToggleMenu}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-80 z-50 animate-slide-in"
            style={{ background: 'var(--nav-bg)', borderRight: '1px solid var(--border-subtle)' }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Menu
              </span>
              <button onClick={onToggleMenu} className="p-1 rounded hover:bg-[var(--nav-hover)]">
                <X size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {[
                { icon: Home, label: 'Dashboard', route: '/' },
                { icon: ClipboardCheck, label: 'My Approvals', route: '/home/wf' },
                { icon: Briefcase, label: 'Projects', route: '/projects/list' },
                { icon: Bell, label: 'Notifications', route: '/home/rt' },
                { icon: User, label: 'My Accountability', route: '/home/acc' },
                { icon: Settings, label: 'Settings', route: '/home/dash' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.route}
                    onClick={() => {
                      navigate(item.route);
                      onToggleMenu();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--nav-hover)] transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* User Menu Overlay */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0"
            style={{ background: 'var(--overlay-bg)' }}
            onClick={onToggleUserMenu}
          />
          <aside
            className="absolute right-0 top-0 bottom-0 w-80 z-50 animate-slide-in"
            style={{ background: 'var(--nav-bg)', borderLeft: '1px solid var(--border-subtle)' }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Profile
              </span>
              <button onClick={onToggleUserMenu} className="p-1 rounded hover:bg-[var(--nav-hover)]">
                <X size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}
                >
                  RK
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Rajesh Kumar
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Project Manager
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--nav-hover)] transition-colors"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Settings size={18} />
                  Preferences
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--nav-hover)] transition-colors"
                  style={{ color: 'var(--error-600)' }}>
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t"
        style={{
          height: '64px',
          background: 'var(--surface-bg)',
          borderColor: 'var(--border-subtle)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = window.location.pathname === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center gap-1 px-3 py-2 min-w-[64px] transition-colors"
              style={{ color: isActive ? 'var(--brand-600)' : 'var(--text-muted)' }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// TABLET SHELL
// ═══════════════════════════════════════════════════════════

function TabletShell({ menuOpen, onToggleMenu, userMenuOpen, onToggleUserMenu }: ShellProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Top Bar */}
      <header
        className="flex items-center px-4 border-b"
        style={{
          height: '64px',
          background: 'var(--shell-bar-bg)',
          color: 'var(--shell-bar-text)',
          borderColor: 'var(--shell-bar-border)',
        }}
      >
        <button
          onClick={onToggleMenu}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-3"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}
          >
            ERP
          </div>
          <span className="text-sm font-semibold">Construction ERP</span>
        </div>

        <div className="flex-1" />

        <button
          onClick={onToggleUserMenu}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}
          >
            RK
          </div>
          <span className="text-xs font-medium">Rajesh Kumar</span>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Rail */}
        {menuOpen && (
          <aside
            className="border-r overflow-y-auto"
            style={{
              width: '240px',
              background: 'var(--nav-bg)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <nav className="p-3 space-y-1">
              {[
                { icon: Home, label: 'Dashboard', route: '/' },
                { icon: ClipboardCheck, label: 'My Approvals', route: '/home/wf' },
                { icon: Briefcase, label: 'Projects', route: '/projects/list' },
                { icon: Bell, label: 'Notifications', route: '/home/rt' },
                { icon: User, label: 'My Accountability', route: '/home/acc' },
                { icon: Settings, label: 'Settings', route: '/home/dash' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.route}
                    onClick={() => navigate(item.route)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--nav-hover)] transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// DESKTOP SHELL
// ═══════════════════════════════════════════════════════════

interface DesktopShellProps {
  userMenuOpen: boolean;
  onToggleUserMenu: () => void;
}

function DesktopShell({ userMenuOpen, onToggleUserMenu }: DesktopShellProps) {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <header
        className="flex items-center px-4 border-b"
        style={{
          height: '56px',
          background: 'var(--shell-bar-bg)',
          color: 'var(--shell-bar-text)',
          borderColor: 'var(--shell-bar-border)',
        }}
      >
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-3"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}
          >
            ERP
          </div>
          <div className="hidden lg:block">
            <div className="text-sm font-semibold leading-none">Construction ERP</div>
            <div className="text-[10px] opacity-60 leading-none mt-0.5">Acme Infrastructure Ltd</div>
          </div>
        </div>

        <div className="flex-1" />

        <button
          onClick={onToggleUserMenu}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}
          >
            RK
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium leading-none">Rajesh Kumar</div>
            <div className="text-[10px] opacity-60 leading-none mt-0.5">Project Manager</div>
          </div>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="border-r overflow-y-auto transition-all"
          style={{
            width: sidebarCollapsed ? '64px' : '260px',
            background: 'var(--nav-bg)',
            borderColor: 'var(--border-subtle)',
            transitionDuration: 'var(--motion-normal)',
          }}
        >
          <nav className="p-3 space-y-1">
            {[
              { icon: Home, label: 'Dashboard', route: '/' },
              { icon: ClipboardCheck, label: 'My Approvals', route: '/home/wf' },
              { icon: Briefcase, label: 'Projects', route: '/projects/list' },
              { icon: Bell, label: 'Notifications', route: '/home/rt' },
              { icon: User, label: 'My Accountability', route: '/home/acc' },
              { icon: Settings, label: 'Settings', route: '/home/dash' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--nav-hover)] transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Icon size={18} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
