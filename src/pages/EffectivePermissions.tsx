import React, { useState } from 'react';
import { Search, Shield, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { users, permissions, type User } from '../data/iamData';
import { getUserEffectivePermissions, type EffectivePermission } from '../core/PermissionEngine';

// ═══════════════════════════════════════════════════════════
// EFFECTIVE PERMISSIONS — Part 06
// Route: /admin/iam/effective
// ═══════════════════════════════════════════════════════════

export function EffectivePermissions() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');

  const effectivePermissions = selectedUser 
    ? getUserEffectivePermissions(selectedUser.id)
    : [];

  const filteredPermissions = effectivePermissions.filter(ep => {
    const matchesSearch = searchQuery === '' ||
      ep.permissionKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.permission.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesModule = moduleFilter === 'ALL' || ep.permission.module === moduleFilter;
    
    return matchesSearch && matchesModule;
  });

  // Group by module
  const permissionsByModule = filteredPermissions.reduce((acc, ep) => {
    const module = ep.permission.module;
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(ep);
    return acc;
  }, {} as Record<string, EffectivePermission[]>);

  const modules = Array.from(new Set(permissions.map(p => p.module)));

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="mb-4">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Effective Permissions
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            View effective permissions for any user with source and scope details
          </p>
        </div>

        {/* User Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const user = users.find(u => u.id === e.target.value);
              setSelectedUser(user || null);
            }}
            className="flex-1 max-w-md px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="">Select a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {selectedUser ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Permissions List */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                  style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              >
                <option value="ALL">All Modules</option>
                {modules.map(module => (
                  <option key={module} value={module} className="capitalize">{module}</option>
                ))}
              </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Total Permissions
                </div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {effectivePermissions.length}
                </div>
              </div>
              <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Allowed
                </div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--success-600)' }}>
                  {effectivePermissions.filter(ep => ep.effect === 'allow').length}
                </div>
              </div>
              <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Denied
                </div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--error-600)' }}>
                  {effectivePermissions.filter(ep => ep.effect === 'deny').length}
                </div>
              </div>
            </div>

            {/* Permissions by Module */}
            <div className="space-y-6">
              {Object.entries(permissionsByModule).map(([module, perms]) => (
                <div key={module}>
                  <h3 className="text-sm font-semibold mb-3 capitalize" style={{ color: 'var(--text-primary)' }}>
                    {module} ({perms.length})
                  </h3>
                  <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: 'var(--surface-sunken)' }}>
                          <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            Permission
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            Description
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            Effect
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            Source Role
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            Scope
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {perms.map((ep, idx) => (
                          <tr key={idx} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                            <td className="px-4 py-2">
                              <code className="text-xs" style={{ color: 'var(--text-primary)' }}>
                                {ep.permissionKey}
                              </code>
                            </td>
                            <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {ep.permission.description}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {ep.effect === 'allow' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                                  style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                                  <CheckCircle2 size={10} />
                                  Allow
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                                  style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
                                  <XCircle size={10} />
                                  Deny
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-1">
                                <Shield size={10} style={{ color: 'var(--brand-600)' }} />
                                <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                                  {ep.roleName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {ep.scopeType}
                                {ep.scopeName && (
                                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                    {ep.scopeName}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Info Panel */}
          <div className="w-80 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium mb-3"
                style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                {selectedUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {selectedUser.name}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {selectedUser.email}
              </p>
            </div>

            <div className="space-y-4">
              <DetailRow label="Employee Code" value={selectedUser.employeeCode} />
              {selectedUser.department && <DetailRow label="Department" value={selectedUser.department} />}
              <DetailRow label="Status" value={selectedUser.isActive ? 'Active' : 'Inactive'} />
              {selectedUser.lastLogin && <DetailRow label="Last Login" value={selectedUser.lastLogin} />}
            </div>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--nav-hover)]"
                  style={{ color: 'var(--text-secondary)' }}>
                  <AlertCircle size={14} />
                  View Audit Log
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--nav-hover)]"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Shield size={14} />
                  Manage Assignments
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Shield size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Select a User
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Choose a user from the dropdown to view their effective permissions
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span className="text-xs text-right" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}
