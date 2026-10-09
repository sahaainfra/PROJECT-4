import React, { useState } from 'react';
import { Users, Calendar, Plus, Filter, Search } from 'lucide-react';
import { allocations, projects, getProjectLifecycleStatusColor, getProjectLifecycleStatusLabel } from '../data/orgData';

// ═══════════════════════════════════════════════════════════
// ALLOCATIONS MANAGEMENT — Part 05
// User × Project allocation matrix
// Route: /admin/org/allocations
// ═══════════════════════════════════════════════════════════

export function AllocationsManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAllocations = allocations.filter(alloc => {
    return searchQuery === '' || 
      alloc.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alloc.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alloc.roleOnProject.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Project Allocations
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage user allocations to projects and sites
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={16} />
            New Allocation
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search allocations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface-sunken)' }}>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Site
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Period
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Allocation
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map(alloc => {
                const project = projects.find(p => p.id === alloc.projectId);
                const statusColor = project ? getProjectLifecycleStatusColor(project.lifecycleStatus) : 'var(--text-muted)';
                
                return (
                  <tr key={alloc.id} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                          style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                          {alloc.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                            {alloc.userName}
                          </div>
                          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {alloc.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                        {alloc.projectName}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {project?.projectCode}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs" style={{ color: alloc.siteName ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {alloc.siteName || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs px-2 py-0.5 rounded inline-block" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                        {alloc.roleOnProject}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                        {alloc.fromDate}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {alloc.toDate || 'Ongoing'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${alloc.allocationPercent}%`,
                              background: alloc.allocationPercent > 100 ? 'var(--error-500)' : 
                                         alloc.allocationPercent > 80 ? 'var(--warning-500)' : 'var(--success-500)'
                            }}
                          />
                        </div>
                        <span className="text-xs tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>
                          {alloc.allocationPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" 
                        style={{ 
                          background: alloc.isActive ? 'var(--success-50)' : 'var(--surface-sunken)',
                          color: alloc.isActive ? 'var(--success-700)' : 'var(--text-muted)'
                        }}>
                        {alloc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Total Allocations
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {allocations.length}
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Active Allocations
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--success-600)' }}>
              {allocations.filter(a => a.isActive).length}
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Avg Allocation
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {Math.round(allocations.reduce((sum, a) => sum + a.allocationPercent, 0) / allocations.length)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
