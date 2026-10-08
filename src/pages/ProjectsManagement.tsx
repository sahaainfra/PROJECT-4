import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Filter,
  Search,
  Plus,
  Eye,
  Edit2,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Clock,
} from 'lucide-react';
import {
  projects,
  sites,
  allocations,
  getProjectLifecycleStatusColor,
  getProjectLifecycleStatusLabel,
  getSiteStatusColor,
  getSiteStatusLabel,
  type Project,
  type ProjectLifecycleStatus,
} from '../data/orgData';

// ═══════════════════════════════════════════════════════════
// PROJECTS MANAGEMENT — Part 05
// Project register with lifecycle management
// Route: /admin/org/projects
// ═══════════════════════════════════════════════════════════

export function ProjectsManagement() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'ALL' || project.lifecycleStatus === statusFilter;
    const matchesSearch = searchQuery === '' || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    ALL: projects.length,
    ACTIVE: projects.filter(p => p.lifecycleStatus === 'ACTIVE').length,
    MOBILISATION: projects.filter(p => p.lifecycleStatus === 'MOBILISATION').length,
    TENDERING: projects.filter(p => p.lifecycleStatus === 'TENDERING').length,
    ON_HOLD: projects.filter(p => p.lifecycleStatus === 'ON_HOLD').length,
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Projects
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage project lifecycle and allocations
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={16} />
            New Project
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex items-center gap-1">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === status ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
                }`}
                style={{
                  background: statusFilter === status ? 'var(--brand-600)' : 'transparent',
                  color: statusFilter === status ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {status === 'ALL' ? 'All' : getProjectLifecycleStatusLabel(status as ProjectLifecycleStatus)} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={selectedProject?.id === project.id}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedProject && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, isSelected, onClick }: { project: Project; isSelected: boolean; onClick: () => void }) {
  const statusColor = getProjectLifecycleStatusColor(project.lifecycleStatus);
  const statusLabel = getProjectLifecycleStatusLabel(project.lifecycleStatus);
  const projectSites = sites.filter(s => s.projectId === project.id);
  const projectAllocations = allocations.filter(a => a.projectId === project.id);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[var(--brand-500)]' : 'hover:shadow-md'
      }`}
      style={{ background: 'var(--card-bg)', borderColor: isSelected ? 'var(--brand-500)' : 'var(--card-border)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={16} style={{ color: 'var(--brand-600)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {project.name}
            </h3>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {project.projectCode} · {project.clientName}
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: statusColor + '20', color: statusColor }}>
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <DollarSign size={12} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>
            ₹{(project.contractValue / 10000000).toFixed(2)} Cr
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
            {project.startDate} → {project.plannedFinish}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
            {project.location}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={12} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
            {projectAllocations.length} allocated
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Building2 size={10} style={{ color: 'var(--text-muted)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {projectSites.length} site{projectSites.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            PM: {project.projectManagerName}
          </div>
        </div>
        <div className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
          {project.projectType}
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const statusColor = getProjectLifecycleStatusColor(project.lifecycleStatus);
  const statusLabel = getProjectLifecycleStatusLabel(project.lifecycleStatus);
  const projectSites = sites.filter(s => s.projectId === project.id);
  const projectAllocations = allocations.filter(a => a.projectId === project.id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {project.name}
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {project.projectCode}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Status */}
      <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Lifecycle Status</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: statusColor + '20', color: statusColor }}>
            {statusLabel}
          </span>
        </div>
        {project.legacyStatus && (
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Legacy Status: {project.legacyStatus}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Client" value={project.clientName} />
        <DetailRow label="Project Type" value={project.projectType} />
        <DetailRow label="Contract Mode" value={project.contractMode} />
        <DetailRow label="Contract Value" value={`₹${(project.contractValue / 10000000).toFixed(2)} Cr`} />
        <DetailRow label="Start Date" value={project.startDate} />
        <DetailRow label="Planned Finish" value={project.plannedFinish} />
        {project.revisedFinish && <DetailRow label="Revised Finish" value={project.revisedFinish} />}
        <DetailRow label="Location" value={project.location} />
      </div>

      {/* Team */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Project Team
        </h3>
        <div className="space-y-2">
          <TeamMember role="Project Manager" name={project.projectManagerName} />
          {project.planningManagerName && <TeamMember role="Planning Manager" name={project.planningManagerName} />}
          {project.commercialManagerName && <TeamMember role="Commercial Manager" name={project.commercialManagerName} />}
        </div>
      </div>

      {/* Sites */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Sites ({projectSites.length})
        </h3>
        <div className="space-y-2">
          {projectSites.map(site => (
            <div key={site.id} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {site.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ 
                  background: getSiteStatusColor(site.status) + '20', 
                  color: getSiteStatusColor(site.status) 
                }}>
                  {getSiteStatusLabel(site.status)}
                </span>
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {site.siteCode} · Manager: {site.siteManagerName}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocations */}
      <div>
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Allocations ({projectAllocations.length})
        </h3>
        <div className="space-y-2">
          {projectAllocations.map(alloc => (
            <div key={alloc.id} className="flex items-center justify-between p-2 rounded hover:bg-[var(--nav-hover)]">
              <div>
                <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {alloc.userName}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {alloc.roleOnProject}
                </div>
              </div>
              <div className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                {alloc.allocationPercent}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--brand-600)', color: '#fff' }}>
          <Edit2 size={12} />
          Edit Project
        </button>
        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Clock size={12} />
          History
        </button>
      </div>
    </div>
  );
}

function TeamMember({ role, name }: { role: string; name: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-[var(--nav-hover)]">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
        style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div>
        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{name}</div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{role}</div>
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
