import React, { useState } from 'react';
import {
  Building2,
  ChevronRight,
  ChevronDown,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  Navigation,
  Edit2,
  Plus,
  Filter,
  Search,
  Eye,
  MoreVertical,
} from 'lucide-react';
import {
  companies,
  businessUnits,
  divisions,
  departments,
  projects,
  sites,
  branches,
  getProjectLifecycleStatusColor,
  getProjectLifecycleStatusLabel,
  getSiteStatusColor,
  getSiteStatusLabel,
} from '../data/orgData';

// ═══════════════════════════════════════════════════════════
// ORGANISATION EXPLORER — Part 05
// Tree view + detail drawer for enterprise hierarchy
// Route: /admin/org
// ═══════════════════════════════════════════════════════════

type EntityType = 'company' | 'business-unit' | 'division' | 'department' | 'project' | 'site' | 'branch';

interface TreeNode {
  id: string;
  type: EntityType;
  name: string;
  code?: string;
  children?: TreeNode[];
  data?: any;
}

export function OrganisationExplorer() {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['company-001']));
  const [searchQuery, setSearchQuery] = useState('');

  // Build tree structure
  const buildTree = (): TreeNode[] => {
    return companies.map(company => ({
      id: company.id,
      type: 'company' as EntityType,
      name: company.name,
      code: company.code,
      data: company,
      children: [
        ...businessUnits
          .filter(bu => bu.companyId === company.id)
          .map(bu => ({
            id: bu.id,
            type: 'business-unit' as EntityType,
            name: bu.name,
            code: bu.code,
            data: bu,
            children: [
              ...divisions
                .filter(div => div.businessUnitId === bu.id)
                .map(div => ({
                  id: div.id,
                  type: 'division' as EntityType,
                  name: div.name,
                  code: div.code,
                  data: div,
                  children: [
                    ...departments
                      .filter(dept => dept.divisionId === div.id)
                      .map(dept => ({
                        id: dept.id,
                        type: 'department' as EntityType,
                        name: dept.name,
                        code: dept.code,
                        data: dept,
                      })),
                  ],
                })),
              ...projects
                .filter(proj => proj.businessUnitId === bu.id)
                .map(proj => ({
                  id: proj.id,
                  type: 'project' as EntityType,
                  name: proj.name,
                  code: proj.projectCode,
                  data: proj,
                  children: sites
                    .filter(site => site.projectId === proj.id)
                    .map(site => ({
                      id: site.id,
                      type: 'site' as EntityType,
                      name: site.name,
                      code: site.siteCode,
                      data: site,
                    })),
                })),
            ],
          })),
        ...branches
          .filter(branch => branch.companyId === company.id && branch.type === 'branch')
          .map(branch => ({
            id: branch.id,
            type: 'branch' as EntityType,
            name: branch.name,
            code: branch.code,
            data: branch,
          })),
      ],
    }));
  };

  const tree = buildTree();

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getIcon = (type: EntityType) => {
    const iconProps = { size: 16 };
    switch (type) {
      case 'company':
        return <Building2 {...iconProps} style={{ color: 'var(--brand-600)' }} />;
      case 'business-unit':
        return <Briefcase {...iconProps} style={{ color: 'var(--info-600)' }} />;
      case 'division':
        return <Briefcase {...iconProps} style={{ color: 'var(--success-600)' }} />;
      case 'department':
        return <Users {...iconProps} style={{ color: 'var(--warning-600)' }} />;
      case 'project':
        return <Building2 {...iconProps} style={{ color: 'var(--brand-600)' }} />;
      case 'site':
        return <MapPin {...iconProps} style={{ color: 'var(--accent-600)' }} />;
      case 'branch':
        return <Building2 {...iconProps} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
            isSelected ? 'bg-[var(--nav-active-bg)]' : 'hover:bg-[var(--nav-hover)]'
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => {
            setSelectedNode(node);
            if (hasChildren) toggleNode(node.id);
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            ) : (
              <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            )
          ) : (
            <div style={{ width: 14 }} />
          )}
          {getIcon(node.type)}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: isSelected ? 'var(--nav-active-text)' : 'var(--text-primary)' }}>
              {node.name}
            </div>
            {node.code && (
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {node.code}
              </div>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>{node.children!.map(child => renderTreeNode(child, level + 1))}</div>
        )}
      </div>
    );
  };

  const renderDetailPanel = () => {
    if (!selectedNode) {
      return (
        <div className="flex items-center justify-center h-full text-sm" style={{ color: 'var(--text-muted)' }}>
          Select an item from the tree to view details
        </div>
      );
    }

    const { type, data } = selectedNode;

    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {getIcon(type)}
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {selectedNode.name}
            </h2>
          </div>
          {selectedNode.code && (
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Code: {selectedNode.code}
            </div>
          )}
        </div>

        {/* Type-specific details */}
        {type === 'company' && <CompanyDetails data={data} />}
        {type === 'business-unit' && <BusinessUnitDetails data={data} />}
        {type === 'division' && <DivisionDetails data={data} />}
        {type === 'department' && <DepartmentDetails data={data} />}
        {type === 'project' && <ProjectDetails data={data} />}
        {type === 'site' && <SiteDetails data={data} />}
        {type === 'branch' && <BranchDetails data={data} />}

        {/* Actions */}
        <div className="mt-6 pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Edit2 size={12} />
            Edit
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Eye size={12} />
            View History
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex" style={{ background: 'var(--shell-bg)' }}>
      {/* Left Panel - Tree */}
      <div className="w-80 border-r flex flex-col" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Organisation Structure
          </h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-xs border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto py-2">
          {tree.map(node => renderTreeNode(node))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={12} />
            Add New
          </button>
        </div>
      </div>

      {/* Right Panel - Details */}
      <div className="flex-1 overflow-y-auto" style={{ background: 'var(--surface-bg)' }}>
        {renderDetailPanel()}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DETAIL COMPONENTS
// ═══════════════════════════════════════════════════════════

function CompanyDetails({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <DetailRow label="Legal Name" value={data.legalName} />
      <DetailRow label="PAN" value={data.pan} />
      <DetailRow label="GSTIN" value={data.gstin} />
      <DetailRow label="CIN" value={data.cin} />
      <DetailRow label="Registered Address" value={data.registeredAddress} />
      <DetailRow label="Base Currency" value={data.baseCurrency} />
      <DetailRow label="Status" value={data.isActive ? 'Active' : 'Inactive'} />
      <DetailRow label="Created" value={data.createdAt} />
    </div>
  );
}

function BusinessUnitDetails({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <DetailRow label="Head" value={data.headUserName} />
      <DetailRow label="Status" value={data.isActive ? 'Active' : 'Inactive'} />
    </div>
  );
}

function DivisionDetails({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <DetailRow label="Head" value={data.headUserName} />
    </div>
  );
}

function DepartmentDetails({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <DetailRow label="Head" value={data.headUserName} />
    </div>
  );
}

function ProjectDetails({ data }: { data: any }) {
  const statusColor = getProjectLifecycleStatusColor(data.lifecycleStatus);
  const statusLabel = getProjectLifecycleStatusLabel(data.lifecycleStatus);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Lifecycle Status</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: statusColor + '20', color: statusColor }}>
            {statusLabel}
          </span>
        </div>
        {data.legacyStatus && (
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Legacy Status: {data.legacyStatus}
          </div>
        )}
      </div>

      <DetailRow label="Client" value={data.clientName} />
      <DetailRow label="Project Type" value={data.projectType} />
      <DetailRow label="Contract Mode" value={data.contractMode} />
      <DetailRow label="Contract Value" value={`₹${(data.contractValue / 10000000).toFixed(2)} Cr`} />
      <DetailRow label="Start Date" value={data.startDate} />
      <DetailRow label="Planned Finish" value={data.plannedFinish} />
      {data.revisedFinish && <DetailRow label="Revised Finish" value={data.revisedFinish} />}
      <DetailRow label="Project Manager" value={data.projectManagerName} />
      {data.planningManagerName && <DetailRow label="Planning Manager" value={data.planningManagerName} />}
      {data.commercialManagerName && <DetailRow label="Commercial Manager" value={data.commercialManagerName} />}
      <DetailRow label="Cost Centre" value={data.costCentreName} />
      <DetailRow label="Profit Centre" value={data.profitCentreName} />
      <DetailRow label="Location" value={data.location} />
      <DetailRow label="State" value={data.stateCode} />
      <DetailRow label="District" value={data.district} />
      {data.description && <DetailRow label="Description" value={data.description} />}

      {/* Sites */}
      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Sites ({sites.filter(s => s.projectId === data.id).length})
        </h4>
        <div className="space-y-1">
          {sites.filter(s => s.projectId === data.id).map(site => (
            <div key={site.id} className="flex items-center gap-2 text-xs p-2 rounded hover:bg-[var(--nav-hover)]">
              <MapPin size={12} style={{ color: 'var(--accent-600)' }} />
              <span style={{ color: 'var(--text-primary)' }}>{site.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ 
                background: getSiteStatusColor(site.status) + '20', 
                color: getSiteStatusColor(site.status) 
              }}>
                {getSiteStatusLabel(site.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SiteDetails({ data }: { data: any }) {
  const statusColor = getSiteStatusColor(data.status);
  const statusLabel = getSiteStatusLabel(data.status);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: statusColor + '20', color: statusColor }}>
            {statusLabel}
          </span>
        </div>
      </div>

      <DetailRow label="Project" value={data.projectName} />
      <DetailRow label="Site Manager" value={data.siteManagerName} />
      <DetailRow label="Address" value={data.address} />
      <DetailRow label="State" value={data.stateCode} />
      <DetailRow label="Timezone" value={data.timezone} />
      <DetailRow label="Coordinates" value={`${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`} />
      
      {data.hasGeofence && (
        <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--success-200)', background: 'var(--success-50)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Navigation size={12} style={{ color: 'var(--success-600)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--success-700)' }}>Geofence Active</span>
          </div>
          <div className="text-[10px]" style={{ color: 'var(--success-600)' }}>
            Type: {data.geofenceType === 'circle' ? `Circle (${data.geofenceRadius}m radius)` : 'Polygon'}
          </div>
        </div>
      )}

      <DetailRow label="Created" value={data.createdAt} />

      {/* Map placeholder */}
      <div className="mt-4">
        <div className="h-48 rounded-lg border flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
          <div className="text-center">
            <MapPin size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Map View</div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchDetails({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <DetailRow label="Type" value={data.type.replace('_', ' ')} />
      <DetailRow label="Address" value={data.address} />
      {data.gstin && <DetailRow label="GSTIN" value={data.gstin} />}
      <DetailRow label="State" value={data.stateCode} />
      {data.latitude && (
        <DetailRow label="Coordinates" value={`${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`} />
      )}
      <DetailRow label="Status" value={data.isActive ? 'Active' : 'Inactive'} />
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
