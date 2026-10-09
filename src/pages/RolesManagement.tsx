import React, { useState } from 'react';
import { Shield, Users, Edit2, Plus, Search, Eye, Lock, Unlock } from 'lucide-react';
import { roles, permissions, rolePermissions, type Role } from '../data/iamData';

// ═══════════════════════════════════════════════════════════
// ROLES MANAGEMENT — Part 06
// Route: /admin/iam/roles
// ═══════════════════════════════════════════════════════════

export function RolesManagement() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPermissionMatrix, setShowPermissionMatrix] = useState(false);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRolePermissionCount = (roleId: string) => {
    return rolePermissions.filter(rp => rp.roleId === roleId && rp.effect === 'allow').length;
  };

  const getCategoryColor = (category: Role['category']) => {
    switch (category) {
      case 'administrative': return 'var(--error-600)';
      case 'management': return 'var(--brand-600)';
      case 'operational': return 'var(--success-600)';
      case 'external': return 'var(--warning-600)';
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Roles
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage system roles and permission assignments
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={16} />
            New Role
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Roles List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map(role => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedRole?.id === role.id ? 'ring-2 ring-[var(--brand-500)]' : 'hover:shadow-md'
                }`}
                style={{ background: 'var(--card-bg)', borderColor: selectedRole?.id === role.id ? 'var(--brand-500)' : 'var(--card-border)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {role.isSystem ? (
                      <Lock size={16} style={{ color: getCategoryColor(role.category) }} />
                    ) : (
                      <Unlock size={16} style={{ color: getCategoryColor(role.category) }} />
                    )}
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {role.name}
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: getCategoryColor(role.category) + '20', color: getCategoryColor(role.category) }}>
                    {role.category}
                  </span>
                </div>

                <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {role.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-medium">{role.code}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Shield size={10} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {getRolePermissionCount(role.id)} perms
                      </span>
                    </div>
                    <div className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                      {role.maxScope}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedRole && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedRole.isSystem ? (
                      <Lock size={20} style={{ color: getCategoryColor(selectedRole.category) }} />
                    ) : (
                      <Unlock size={20} style={{ color: getCategoryColor(selectedRole.category) }} />
                    )}
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {selectedRole.name}
                    </h2>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {selectedRole.code}
                  </div>
                </div>
                <button onClick={() => setSelectedRole(null)} className="p-1 rounded hover:bg-[var(--nav-hover)]">
                  <span style={{ color: 'var(--text-muted)' }}>✕</span>
                </button>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6">
                <DetailRow label="Description" value={selectedRole.description} />
                <DetailRow label="Category" value={selectedRole.category} />
                <DetailRow label="Max Scope" value={selectedRole.maxScope} />
                <DetailRow label="System Role" value={selectedRole.isSystem ? 'Yes (Locked)' : 'No (Editable)'} />
                <DetailRow label="Permissions" value={`${getRolePermissionCount(selectedRole.id)} assigned`} />
              </div>

              {/* Permission Matrix Button */}
              <button
                onClick={() => setShowPermissionMatrix(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90 mb-4"
                style={{ background: 'var(--brand-600)', color: '#fff' }}
              >
                <Eye size={12} />
                View Permission Matrix
              </button>

              {/* Actions */}
              <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
                  style={{ background: 'var(--brand-600)', color: '#fff' }}>
                  <Edit2 size={12} />
                  Edit Role
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Permission Matrix Modal */}
      {showPermissionMatrix && selectedRole && (
        <PermissionMatrixModal
          role={selectedRole}
          onClose={() => setShowPermissionMatrix(false)}
        />
      )}
    </div>
  );
}

function PermissionMatrixModal({ role, onClose }: { role: Role; onClose: () => void }) {
  const rolePerms = rolePermissions.filter(rp => rp.roleId === role.id);
  
  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const hasPermission = (permKey: string) => {
    return rolePerms.some(rp => rp.permissionKey === permKey && rp.effect === 'allow');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-bg)' }}>
      <div className="w-full max-w-5xl max-h-[90vh] rounded-xl overflow-hidden flex flex-col" style={{ background: 'var(--surface-bg)' }}>
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Permission Matrix - {role.name}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {rolePerms.filter(rp => rp.effect === 'allow').length} permissions assigned
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--nav-hover)]">
            <span style={{ color: 'var(--text-muted)' }}>✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {Object.entries(permissionsByModule).map(([module, perms]) => (
              <div key={module}>
                <h3 className="text-sm font-semibold mb-3 capitalize" style={{ color: 'var(--text-primary)' }}>
                  {module}
                </h3>
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
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
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {perms.map(perm => {
                        const has = hasPermission(perm.key);
                        return (
                          <tr key={perm.key} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                            <td className="px-4 py-2">
                              <code className="text-xs" style={{ color: 'var(--text-primary)' }}>
                                {perm.key}
                              </code>
                            </td>
                            <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {perm.description}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {has ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                  style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                                  ✓ Allowed
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                  style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                                  ✗ Denied
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
