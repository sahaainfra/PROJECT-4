import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, CheckSquare, CheckCircle, Bell, MoreHorizontal, Building2,
  FileText, BarChart3, Settings, Menu, X, ChevronRight, User,
  Search, LayoutDashboard, ShoppingCart, Package, DollarSign, Users
} from 'lucide-react';
import {
  DeviceType,
  NavItem,
  defaultNavigationConfig,
  getDeviceInfo,
  BREAKPOINTS,
} from '../data/responsiveData';
import {
  getCurrentDevice,
  onDeviceChange,
  isMobile,
  isTablet,
  isDesktop,
} from '../core/ResponsiveService';

// ═══════════════════════════════════════════════════════════
// RESPONSIVE SHELL COMPONENT — Part 21
// ═══════════════════════════════════════════════════════════

interface ResponsiveShellProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveShell({ children, className = '' }: ResponsiveShellProps) {
  const [device, setDevice] = useState<DeviceType>(getCurrentDevice().type);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onDeviceChange((deviceInfo) => {
      setDevice(deviceInfo.type);
    });

    return unsubscribe;
  }, []);

  // Render appropriate shell based on device
  switch (device) {
    case 'mobile':
      return (
        <MobileShell
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          moreMenuOpen={moreMenuOpen}
          setMoreMenuOpen={setMoreMenuOpen}
          className={className}
        >
          {children}
        </MobileShell>
      );
    case 'tablet':
      return (
        <TabletShell className={className}>
          {children}
        </TabletShell>
      );
    case 'desktop':
    default:
      return (
        <DesktopShell className={className}>
          {children}
        </DesktopShell>
      );
  }
}

// ═══════════════════════════════════════════════════════════
// MOBILE SHELL — Part 21
// ═══════════════════════════════════════════════════════════

interface MobileShellProps {
  children: React.ReactNode;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  moreMenuOpen: boolean;
  setMoreMenuOpen: (open: boolean) => void;
  className?: string;
}

function MobileShell({
  children,
  mobileMenuOpen,
  setMobileMenuOpen,
  moreMenuOpen,
  setMoreMenuOpen,
  className = '',
}: MobileShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const bottomNav = defaultNavigationConfig.mobile.bottomNav;
  const moreMenu = defaultNavigationConfig.mobile.moreMenu;

  const handleNavClick = (item: NavItem) => {
    if (item.id === 'more') {
      setMoreMenuOpen(!moreMenuOpen);
    } else {
      navigate(item.route);
      setMoreMenuOpen(false);
    }
  };

  const isActive = (route: string): boolean => {
    return location.pathname === route;
  };

  return (
    <div className={`h-screen flex flex-col ${className}`} style={{ background: 'var(--shell-bg)' }}>
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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}>
            <Building2 size={16} />
          </div>
          <span className="text-sm font-semibold">Construction ERP</span>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Search size={20} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40" style={{ background: 'var(--overlay-bg)' }}>
          <div
            className="absolute left-0 top-0 bottom-0 w-80 animate-slide-in"
            style={{ background: 'var(--surface-bg)', borderRight: '1px solid var(--border-subtle)' }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
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
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--nav-hover)]"
              >
                <X size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            <nav className="p-2">
              {defaultNavigationConfig.desktop.sidebar.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-[var(--nav-hover)]"
                  style={{
                    background: isActive(item.route) ? 'var(--nav-active-bg)' : 'transparent',
                    color: isActive(item.route) ? 'var(--nav-active-text)' : 'var(--text-secondary)',
                  }}
                >
                  {item.icon === 'Home' && <Home size={18} />}
                  {item.icon === 'LayoutDashboard' && <LayoutDashboard size={18} />}
                  {item.icon === 'Building2' && <Building2 size={18} />}
                  {item.icon === 'ShoppingCart' && <ShoppingCart size={18} />}
                  {item.icon === 'Package' && <Package size={18} />}
                  {item.icon === 'DollarSign' && <DollarSign size={18} />}
                  {item.icon === 'Users' && <Users size={18} />}
                  {item.icon === 'BarChart3' && <BarChart3 size={18} />}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>

      {/* More Menu Overlay */}
      {moreMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ background: 'var(--overlay-bg)' }}
          onClick={() => setMoreMenuOpen(false)}
        >
          <div
            className="absolute bottom-16 left-4 right-4 rounded-xl shadow-xl overflow-hidden animate-fade-in"
            style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-subtle)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2">
              {moreMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-[var(--nav-hover)]"
                >
                  {item.icon === 'Building2' && <Building2 size={18} style={{ color: 'var(--text-secondary)' }} />}
                  {item.icon === 'FileText' && <FileText size={18} style={{ color: 'var(--text-secondary)' }} />}
                  {item.icon === 'BarChart3' && <BarChart3 size={18} style={{ color: 'var(--text-secondary)' }} />}
                  {item.icon === 'Settings' && <Settings size={18} style={{ color: 'var(--text-secondary)' }} />}
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
        {bottomNav.map((item) => {
          const active = isActive(item.route) || (item.id === 'more' && moreMenuOpen);
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative"
              style={{
                color: active ? 'var(--brand-600)' : 'var(--text-muted)',
                minHeight: '44px',
              }}
            >
              {item.icon === 'Home' && <Home size={20} strokeWidth={active ? 2.5 : 1.8} />}
              {item.icon === 'CheckSquare' && <CheckSquare size={20} strokeWidth={active ? 2.5 : 1.8} />}
              {item.icon === 'CheckCircle' && <CheckCircle size={20} strokeWidth={active ? 2.5 : 1.8} />}
              {item.icon === 'Bell' && <Bell size={20} strokeWidth={active ? 2.5 : 1.8} />}
              {item.icon === 'MoreHorizontal' && <MoreHorizontal size={20} strokeWidth={active ? 2.5 : 1.8} />}
              
              <span className="text-[10px] font-medium">{item.label}</span>

              {item.badge && item.badge > 0 && (
                <span
                  className="absolute top-2 right-1/2 translate-x-5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'var(--error-500)', color: '#fff' }}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TABLET SHELL — Part 21
// ═══════════════════════════════════════════════════════════

interface TabletShellProps {
  children: React.ReactNode;
  className?: string;
}

function TabletShell({ children, className = '' }: TabletShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const rail = defaultNavigationConfig.tablet.rail;

  const isActive = (route: string): boolean => {
    return location.pathname === route;
  };

  return (
    <div className={`h-screen flex flex-col ${className}`} style={{ background: 'var(--shell-bg)' }}>
      {/* Top Bar */}
      <header
        className="flex items-center px-4 gap-3 border-b"
        style={{
          height: '56px',
          background: 'var(--shell-bar-bg)',
          color: 'var(--shell-bar-text)',
          borderColor: 'var(--shell-bar-border)',
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}>
            <Building2 size={16} />
          </div>
          <span className="text-sm font-semibold">Construction ERP</span>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Search size={14} />
          <span>Search...</span>
        </button>

        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--error-500)' }} />
        </button>

        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}>
            RK
          </div>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Rail */}
        <nav
          className="flex flex-col border-r transition-all"
          style={{
            width: collapsed ? '64px' : '200px',
            background: 'var(--nav-bg)',
            borderColor: 'var(--border-subtle)',
            transitionDuration: 'var(--motion-normal)',
          }}
        >
          <div className="flex-1 py-3">
            {rail.map((item) => {
              const active = isActive(item.route);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2 transition-colors ${
                    collapsed ? 'justify-center' : ''
                  }`}
                  style={{
                    background: active ? 'var(--nav-active-bg)' : 'transparent',
                    color: active ? 'var(--nav-active-text)' : 'var(--text-secondary)',
                    width: collapsed ? '48px' : 'calc(100% - 16px)',
                  }}
                  title={item.label}
                >
                  {item.icon === 'Home' && <Home size={20} strokeWidth={active ? 2.5 : 1.8} />}
                  {item.icon === 'Building2' && <Building2 size={20} strokeWidth={active ? 2.5 : 1.8} />}
                  {item.icon === 'CheckSquare' && <CheckSquare size={20} strokeWidth={active ? 2.5 : 1.8} />}
                  {item.icon === 'CheckCircle' && <CheckCircle size={20} strokeWidth={active ? 2.5 : 1.8} />}
                  {item.icon === 'FileText' && <FileText size={20} strokeWidth={active ? 2.5 : 1.8} />}
                  {item.icon === 'BarChart3' && <BarChart3 size={20} strokeWidth={active ? 2.5 : 1.8} />}
                  
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}

                  {item.badge && item.badge > 0 && !collapsed && (
                    <span
                      className="ml-auto min-w-[20px] h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: 'var(--error-500)', color: '#fff' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DESKTOP SHELL — Part 21
// ═══════════════════════════════════════════════════════════

interface DesktopShellProps {
  children: React.ReactNode;
  className?: string;
}

function DesktopShell({ children, className = '' }: DesktopShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const sidebar = defaultNavigationConfig.desktop.sidebar;
  const header = defaultNavigationConfig.desktop.header;

  const isActive = (route: string): boolean => {
    return location.pathname === route;
  };

  return (
    <div className={`h-screen flex flex-col ${className}`} style={{ background: 'var(--shell-bg)' }}>
      {/* Top Bar */}
      <header
        className="flex items-center px-4 gap-3 border-b"
        style={{
          height: '56px',
          background: 'var(--shell-bar-bg)',
          color: 'var(--shell-bar-text)',
          borderColor: 'var(--shell-bar-border)',
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}>
            <Building2 size={16} />
          </div>
          <div className="hidden lg:block">
            <div className="text-sm font-semibold">Construction ERP</div>
            <div className="text-[10px] opacity-60">Acme Infrastructure Ltd</div>
          </div>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-white/10 hover:bg-white/10 transition-colors min-w-[200px]"
        >
          <Search size={14} />
          <span>Search projects, documents...</span>
          <span className="ml-auto opacity-40 text-[10px]">⌘K</span>
        </button>

        <div className="flex-1" />

        {header.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.route)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
          >
            {item.icon === 'Search' && <Search size={18} />}
            {item.icon === 'Bell' && <Bell size={18} />}
            {item.icon === 'User' && <User size={18} />}
            
            {item.badge && item.badge > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: 'var(--error-500)', color: '#fff' }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, var(--brand-500), var(--brand-700))', color: '#fff' }}>
            RK
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium">Rajesh Kumar</div>
            <div className="text-[10px] opacity-60">Project Manager</div>
          </div>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav
          className="flex flex-col border-r transition-all"
          style={{
            width: collapsed ? '64px' : '260px',
            background: 'var(--nav-bg)',
            borderColor: 'var(--border-subtle)',
            transitionDuration: 'var(--motion-normal)',
          }}
        >
          <div className="flex-1 py-3">
            {sidebar.map((item) => {
              const active = isActive(item.route);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2 transition-colors ${
                    collapsed ? 'justify-center' : ''
                  }`}
                  style={{
                    background: active ? 'var(--nav-active-bg)' : 'transparent',
                    color: active ? 'var(--nav-active-text)' : 'var(--text-secondary)',
                    width: collapsed ? '48px' : 'calc(100% - 16px)',
                  }}
                  title={item.label}
                >
                  {item.icon === 'Home' && <Home size={18} strokeWidth={active ? 2.2 : 1.8} />}
                  {item.icon === 'LayoutDashboard' && <LayoutDashboard size={18} strokeWidth={active ? 2.2 : 1.8} />}
                  {item.icon === 'Building2' && <Building2 size={18} strokeWidth={active ? 2.2 : 1.8} />}
                  {item.icon === 'ShoppingCart' && <ShoppingCart size={18} strokeWidth={active ? 2.2 : 1.8} />}
                  {item.icon === 'Package' && <Package size={18} strokeWidth={active ? 2.2 : 1.8} />}
                  {item.icon === 'DollarSign' && <DollarSign size={18} strokeWidth={active ? 2.2 : 1.8} />}
                  {item.icon === 'Users' && <Users size={18} strokeWidth={active ? 2.2 : 1.8} />}
                  {item.icon === 'BarChart3' && <BarChart3 size={18} strokeWidth={active ? 2.2 : 1.8} />}
                  
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}

                  {item.badge && item.badge > 0 && !collapsed && (
                    <span
                      className="ml-auto min-w-[20px] h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: 'var(--error-500)', color: '#fff' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
