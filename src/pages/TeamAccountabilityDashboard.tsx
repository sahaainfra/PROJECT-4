import React, { useState } from 'react';
import {
  Users,
  Filter,
  Search,
  Eye,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import {
  responsibilityItems,
  complianceScores,
  getResponsibilityItemsByUser,
  getOverdueItemsByUser,
  getComplianceScoreBySubject,
  getScoreColor,
  type ResponsibilityItem,
} from '../data/accountabilityData';

// ═══════════════════════════════════════════════════════════
// TEAM ACCOUNTABILITY DASHBOARD — Part 15
// Route: /admin/acc/team
// ═══════════════════════════════════════════════════════════

export function TeamAccountabilityDashboard() {
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample team members (in production, this would come from organization data)
  const teamMembers = [
    { id: 'user-010', name: 'Rajesh Kumar', role: 'Project Manager', team: 'project-001' },
    { id: 'user-011', name: 'Priya Sharma', role: 'Procurement Officer', team: 'project-001' },
    { id: 'user-017', name: 'Suresh Kumar', role: 'Site Engineer', team: 'project-001' },
    { id: 'user-012', name: 'Amit Verma', role: 'Commercial Manager', team: 'project-002' },
    { id: 'user-016', name: 'Mohan Das', role: 'QS Engineer', team: 'project-002' },
  ];

  const currentPeriod = '2024-01';

  const filteredMembers = teamMembers.filter(member => {
    const matchesTeam = selectedTeam === 'ALL' || member.team === selectedTeam;
    const matchesSearch = searchQuery === '' ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const teams = Array.from(new Set(teamMembers.map(m => m.team)));

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Users size={24} style={{ color: 'var(--brand-600)' }} />
              Team Accountability Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Monitor team responsibilities, compliance, and performance
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Download size={12} />
            Export Report
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Team Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Team Members
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {filteredMembers.length}
            </div>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Total Responsibilities
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {filteredMembers.reduce((sum, m) => sum + getResponsibilityItemsByUser(m.id).length, 0)}
            </div>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Overdue Items
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--error-600)' }}>
              {filteredMembers.reduce((sum, m) => sum + getOverdueItemsByUser(m.id).length, 0)}
            </div>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Avg Compliance Score
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {(() => {
                const scores = filteredMembers
                  .map(m => getComplianceScoreBySubject('user', m.id, currentPeriod)?.score)
                  .filter((s): s is number => s !== undefined);
                return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
              })()}%
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Team Members
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Role</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Pending</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>In Progress</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Overdue</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Completed</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Compliance Score</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => {
                  const responsibilities = getResponsibilityItemsByUser(member.id);
                  const overdue = getOverdueItemsByUser(member.id);
                  const score = getComplianceScoreBySubject('user', member.id, currentPeriod);

                  const pending = responsibilities.filter(r => r.status === 'pending').length;
                  const inProgress = responsibilities.filter(r => r.status === 'in_progress').length;
                  const completed = responsibilities.filter(r => r.status === 'completed').length;

                  return (
                    <tr key={member.id} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                            style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                              {member.name}
                            </div>
                            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              {member.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {member.role}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs tabular-nums" style={{ color: 'var(--info-600)' }}>
                          {pending}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs tabular-nums" style={{ color: 'var(--warning-600)' }}>
                          {inProgress}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs tabular-nums font-medium" style={{ color: overdue.length > 0 ? 'var(--error-600)' : 'var(--text-muted)' }}>
                          {overdue.length}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs tabular-nums" style={{ color: 'var(--success-600)' }}>
                          {completed}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {score ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${score.score}%`,
                                  background: getScoreColor(score.score),
                                }}
                              />
                            </div>
                            <span className="text-xs tabular-nums font-medium" style={{ color: getScoreColor(score.score) }}>
                              {score.score}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="View Details">
                          <Eye size={14} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workload Balance */}
        <div className="mt-6 rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Workload Balance
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {filteredMembers.map(member => {
                const responsibilities = getResponsibilityItemsByUser(member.id);
                const maxLoad = 20; // Example max load
                const currentLoad = responsibilities.length;
                const loadPercent = Math.min(100, (currentLoad / maxLoad) * 100);

                return (
                  <div key={member.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                        {member.name}
                      </span>
                      <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {currentLoad} / {maxLoad}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${loadPercent}%`,
                          background: loadPercent > 80 ? 'var(--error-600)' :
                                     loadPercent > 60 ? 'var(--warning-600)' : 'var(--success-600)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
