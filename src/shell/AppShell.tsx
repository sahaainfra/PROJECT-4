import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ShellBar } from './ShellBar';
import { SideNavigation, MobileBottomNav } from './SideNavigation';

// ═══════════════════════════════════════════════════════════
// APPLICATION SHELL (DS-12, DS-29)
// Shell bar + Side nav + Content area
// ═══════════════════════════════════════════════════════════

export function AppShell() {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--shell-bg)' }}>
      {/* Shell Bar */}
      <ShellBar
        onToggleNav={() => {
          if (window.innerWidth < 768) {
            setMobileNavOpen(!mobileNavOpen);
          } else {
            setNavCollapsed(!navCollapsed);
          }
        }}
        navCollapsed={navCollapsed}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop/Tablet Side Navigation */}
        <aside
          className={`hidden md:flex flex-col border-r transition-all duration-200 ${
            navCollapsed ? 'w-14' : 'w-60'
          }`}
          style={{ borderColor: 'var(--border-color)' }}
        >
          <SideNavigation collapsed={navCollapsed} />
        </aside>

        {/* Mobile overlay navigation */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0"
              style={{ background: 'var(--overlay-bg)' }}
              onClick={() => setMobileNavOpen(false)}
            />
            <aside
              className="absolute left-0 top-0 bottom-0 w-64 z-50 animate-fade-in"
              style={{ background: 'var(--nav-bg)', borderRight: '1px solid var(--border-color)' }}
            >
              <SideNavigation collapsed={false} onNavigate={() => setMobileNavOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
