import React, { useState } from 'react';
import { Users, Calendar, Plus, Search, Edit2, Trash2, Shield } from 'lucide-react';
import { userRoleAssignments, roles, users, type UserRoleAssignment } from '../data/iamData';

// ═══════════════════════════════════════════════════════════
// USER ASSIGNMENTS — Part 06
// Route: /admin/iam/assignments
// ═══════════════════════════════════════════════════════════

export function UserAssignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<UserRoleAssignment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredAssignments = userRoleAssignments.filter(assignment => {
    const matchesSearch = searchQuery === '' ||
      assignment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.roleName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || assignment.roleId === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getScopeIcon = (scopeType: string) => {
    switch (scopeType) {
      case 'company': return '🏢';
      case 'project': return '📋';
      case 'site': return '📍';
      case 'department': return '🏛️';
      case 'own': return '👤';
      default: return '🔒';
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              User Role Assignments
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage user role assignments with scope and validity
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={16} />
            New Assignment
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search users or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
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
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Scope
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Validity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Assigned By
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map(assignment => (
                <tr
                  key={assignment.id}
                  onClick={() => setSelectedAssignment(assignment)}
                  className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                        {assignment.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {assignment.userName}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {assignment.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield size={12} style={{ color: 'var(--brand-600)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                        {assignment.roleName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>{getScopeIcon(assignment.scopeType)}</span>
                      <div>
                        <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                          {assignment.scopeType}
                        </div>
                        {assignment.scopeName && (
                          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {assignment.scopeName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                      {assignment.validFrom}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {assignment.validTo || 'No expiry'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {assignment.assignedBy}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: assignment.isActive ? 'var(--success-50)' : 'var(--surface-sunken)',
                        color: assignment.isActive ? 'var(--success-700)' : 'var(--text-muted)'
                      }}>
                      {assignment.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Edit">
                        <Edit2 size={12} style={{ color: 'var(--text-muted)' }} />
                      </button>
                      <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Delete">
                        <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Total Assignments
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {userRoleAssignments.length}
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Active Assignments
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--success-600)' }}>
              {userRoleAssignments.filter(a => a.isActive).length}
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Unique Users
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {new Set(userRoleAssignments.map(a => a.userId)).size}
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Expiring Soon
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--warning-600)' }}>
              {userRoleAssignments.filter(a => {
                if (!a.validTo) return false;
                const expiry = new Date(a.validTo);
                const now = new Date();
                const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
              }).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
