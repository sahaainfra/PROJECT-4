import React, { useState } from 'react';
import {
  Code2,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  Search,
  ChevronRight,
  Tag,
  AlertCircle,
} from 'lucide-react';
import {
  apiEndpoints,
  apiVersions,
  getEndpointsByVersion,
  getEndpointsByTag,
  getVersionsByApi,
  getHttpMethodColor,
  type ApiEndpoint,
} from '../data/apiPlatformData';

// ═══════════════════════════════════════════════════════════
// DEVELOPER PORTAL — Part 18
// Route: /_tech/devapi/portal
// ═══════════════════════════════════════════════════════════

export function DeveloperPortal() {
  const [selectedVersion, setSelectedVersion] = useState<string>('v1');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const versions = Array.from(new Set(apiEndpoints.map(e => e.version)));
  const tags = Array.from(new Set(apiEndpoints.flatMap(e => e.tags)));

  let filteredEndpoints = getEndpointsByVersion(selectedVersion);
  
  if (selectedTag !== 'ALL') {
    filteredEndpoints = filteredEndpoints.filter(e => e.tags.includes(selectedTag));
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredEndpoints = filteredEndpoints.filter(e =>
      e.path.toLowerCase().includes(query) ||
      e.summary.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query)
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <BookOpen size={24} style={{ color: 'var(--brand-600)' }} />
              Developer Portal
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              API documentation, schemas, and integration guides
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <Download size={12} />
              OpenAPI Spec
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <ExternalLink size={12} />
              Postman Collection
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            {versions.map(v => (
              <option key={v} value={v}>Version {v}</option>
            ))}
          </select>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Endpoint List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {filteredEndpoints.map(endpoint => (
              <EndpointCard
                key={endpoint.id}
                endpoint={endpoint}
                isSelected={selectedEndpoint?.id === endpoint.id}
                onClick={() => setSelectedEndpoint(endpoint)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedEndpoint && (
          <div className="w-[500px] border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <EndpointDetail endpoint={selectedEndpoint} onClose={() => setSelectedEndpoint(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ENDPOINT CARD
// ═══════════════════════════════════════════════════════════

function EndpointCard({
  endpoint,
  isSelected,
  onClick,
}: {
  endpoint: ApiEndpoint;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[var(--brand-500)]' : 'hover:shadow-md'
      }`}
      style={{
        background: 'var(--card-bg)',
        borderColor: isSelected ? 'var(--brand-500)' : 'var(--card-border)',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-1 rounded"
            style={{
              background: getHttpMethodColor(endpoint.method) + '20',
              color: getHttpMethodColor(endpoint.method),
            }}
          >
            {endpoint.method}
          </span>
          <code className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
            {endpoint.path}
          </code>
        </div>
        {endpoint.deprecated && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--warning-50)', color: 'var(--warning-700)' }}>
            Deprecated
          </span>
        )}
      </div>

      <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
        {endpoint.summary}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {endpoint.tags.map(tag => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
            {tag}
          </span>
        ))}
        <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
          {endpoint.required_scopes.join(', ')}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ENDPOINT DETAIL
// ═══════════════════════════════════════════════════════════

function EndpointDetail({ endpoint, onClose }: { endpoint: ApiEndpoint; onClose: () => void }) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Endpoint Details
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-2 py-1 rounded"
              style={{
                background: getHttpMethodColor(endpoint.method) + '20',
                color: getHttpMethodColor(endpoint.method),
              }}
            >
              {endpoint.method}
            </span>
            <code className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
              {endpoint.path}
            </code>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Deprecation Warning */}
      {endpoint.deprecated && (
        <div className="p-3 rounded-lg mb-6" style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-200)' }}>
          <div className="flex items-start gap-2">
            <AlertCircle size={16} style={{ color: 'var(--warning-700)' }} />
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--warning-800)' }}>
                Deprecated
              </div>
              <div className="text-xs" style={{ color: 'var(--warning-700)' }}>
                {endpoint.deprecated_message || 'This endpoint is deprecated. Please use the latest version.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Summary
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {endpoint.summary}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Description
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {endpoint.description}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Required Scopes
          </div>
          <div className="flex flex-wrap gap-1">
            {endpoint.required_scopes.map(scope => (
              <span key={scope} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                {scope}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Tags
          </div>
          <div className="flex flex-wrap gap-1">
            {endpoint.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Version
            </div>
            <div className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <Tag size={12} />
              {endpoint.version}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Rate Limit
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {endpoint.rate_limit_group}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Idempotency Required
          </div>
          <div className="text-sm" style={{ color: endpoint.idempotency_required ? 'var(--success-600)' : 'var(--text-muted)' }}>
            {endpoint.idempotency_required ? 'Yes' : 'No'}
          </div>
        </div>

        {/* Example Request */}
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Example Request
          </div>
          <div className="p-3 rounded-lg text-xs font-mono overflow-x-auto" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
            <pre>{`curl -X ${endpoint.method} \\
  https://api.example.com${endpoint.path} \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json"`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
