import React, { useState } from 'react';
import { personas, type Persona } from './data/previewData';
import { getIcon } from '../data/registries';

// ═══════════════════════════════════════════════════════════
// PREVIEW SHELL — Part 02
// Separate environment with PREVIEW banner, persona switcher,
// device frame toggle. Never linked from production shell.
// ═══════════════════════════════════════════════════════════

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';

interface PreviewShellProps {
  children: React.ReactNode;
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
}

export function PreviewShell({ children, currentPersona, onPersonaChange, deviceMode, onDeviceModeChange }: PreviewShellProps) {
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);
  const HomeIcon = getIcon('nav.home');
  const EyeIcon = getIcon('sys.eye');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* PREVIEW BANNER */}
      <div className="h-8 flex items-center px-4 gap-3 text-xs font-medium"
        style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)', color: '#fff' }}>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(0,0,0,0.2)' }}>
          PREVIEW
        </span>
        <span>Synthetic Data — Not Connected to Production</span>
        <span className="ml-auto opacity-80">Part 02 · Live Dashboard Preview</span>
        <a href="/" className="flex items-center gap-1 ml-4 opacity-80 hover:opacity-100">
          <HomeIcon size={12} />
          <span>Exit Preview</span>
        </a>
      </div>

      {/* Preview Toolbar */}
      <header className="h-12 flex items-center px-4 gap-3 border-b"
        style={{ background: 'var(--surface-bg)', borderColor: 'var(--border-color)' }}>
        {/* Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--density-border-radius)] border transition-colors hover:opacity-80"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: currentPersona.color }}>
              {currentPersona.avatar}
            </div>
            <div className="text-left">
              <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{currentPersona.name}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{currentPersona.role}</div>
            </div>
            <span className="text-[10px] ml-1" style={{ color: 'var(--text-muted)' }}>▼</span>
          </button>

          {personaMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setPersonaMenuOpen(false)} />
              <div className="absolute top-full mt-1 left-0 w-72 rounded-[var(--density-border-radius)] shadow-lg z-50 overflow-hidden animate-fade-in"
                style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-color)' }}>
                <div className="p-2 border-b text-[10px] font-semibold uppercase tracking-wider" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  Switch Persona
                </div>
                <div className="max-h-80 overflow-y-auto p-1">
                  {personas.map(persona => (
                    <button
                      key={persona.id}
                      onClick={() => { onPersonaChange(persona); setPersonaMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-[var(--density-border-radius)] text-left transition-colors ${
                        persona.id === currentPersona.id ? 'opacity-100' : 'hover:opacity-80'
                      }`}
                      style={{ background: persona.id === currentPersona.id ? 'var(--nav-active)' : 'transparent' }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: persona.color }}>
                        {persona.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{persona.name}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{persona.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-6 w-px" style={{ background: 'var(--border-color)' }} />

        {/* Device Frame Toggle */}
        <div className="flex items-center gap-1">
          {([
            { mode: 'mobile' as DeviceMode, label: '360px', icon: '📱' },
            { mode: 'tablet' as DeviceMode, label: '820px', icon: '📋' },
            { mode: 'desktop' as DeviceMode, label: '1440px', icon: '🖥️' },
          ]).map(item => (
            <button
              key={item.mode}
              onClick={() => onDeviceModeChange(item.mode)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                deviceMode === item.mode ? 'text-white' : 'hover:opacity-70'
              }`}
              style={{
                background: deviceMode === item.mode ? 'var(--brand-primary)' : 'transparent',
                color: deviceMode === item.mode ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Preview Info */}
        <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
          <EyeIcon size={12} />
          <span>Preview Environment · Fixture Data · Week 1 Stakeholder Review</span>
        </div>
      </header>

      {/* Content Area with Device Frame */}
      <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
        <div
          className={`transition-all duration-300 ${
            deviceMode === 'mobile' ? 'w-[360px] min-h-[740px]' :
            deviceMode === 'tablet' ? 'w-[820px] min-h-[1180px]' :
            'w-full max-w-[1440px]'
          } rounded-[var(--density-border-radius)] overflow-hidden`}
          style={{
            background: 'var(--surface-bg)',
            border: deviceMode !== 'desktop' ? '2px solid var(--border-color)' : 'none',
            boxShadow: deviceMode !== 'desktop' ? 'var(--shadow-lg)' : 'none',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
