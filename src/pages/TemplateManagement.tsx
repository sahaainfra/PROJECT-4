import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Eye,
  Filter,
  Search,
  Mail,
  Bell,
  MessageSquare,
  Smartphone,
} from 'lucide-react';
import {
  notificationTemplates,
  notificationCategories,
  getTemplateByCode,
  type NotificationTemplate,
} from '../data/notificationData';
import { previewTemplate, createTemplate } from '../core/NotificationService';

// ═══════════════════════════════════════════════════════════
// TEMPLATE MANAGEMENT — Part 16
// Route: /admin/rt/templates
// ═══════════════════════════════════════════════════════════

export function TemplateManagement() {
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [filterChannel, setFilterChannel] = useState<string>('ALL');
  const [showPreview, setShowPreview] = useState(false);
  const [previewVariables, setPreviewVariables] = useState<Record<string, any>>({});
  const [previewResult, setPreviewResult] = useState<{ subject: string; body: string } | null>(null);

  const modules = Array.from(new Set(notificationTemplates.map(t => t.module)));
  const channels = ['in_app', 'email', 'sms', 'whatsapp', 'push'];

  const filteredTemplates = notificationTemplates.filter(template => {
    const matchesModule = filterModule === 'ALL' || template.module === filterModule;
    const matchesChannel = filterChannel === 'ALL' || template.channel === filterChannel;
    return matchesModule && matchesChannel;
  });

  const handlePreview = () => {
    if (!selectedTemplate) return;

    try {
      const result = previewTemplate(selectedTemplate.id, previewVariables);
      setPreviewResult(result);
    } catch (error) {
      console.error('Preview failed:', error);
      alert(`Preview failed: ${(error as Error).message}`);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'in_app': return <Bell size={14} />;
      case 'email': return <Mail size={14} />;
      case 'sms': return <MessageSquare size={14} />;
      case 'whatsapp': return <MessageSquare size={14} />;
      case 'push': return <Smartphone size={14} />;
      default: return <Bell size={14} />;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FileText size={24} style={{ color: 'var(--brand-600)' }} />
              Notification Templates
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage notification templates and previews
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={14} />
            New Template
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Modules</option>
            {modules.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Channels</option>
            {channels.map(ch => (
              <option key={ch} value={ch}>{ch.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                onClick={() => setSelectedTemplate(template)}
                getChannelIcon={getChannelIcon}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedTemplate && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <TemplateDetail
              template={selectedTemplate}
              onClose={() => {
                setSelectedTemplate(null);
                setShowPreview(false);
                setPreviewResult(null);
              }}
              onPreview={() => setShowPreview(true)}
              getChannelIcon={getChannelIcon}
            />
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-bg)' }}>
          <div className="w-full max-w-2xl rounded-xl overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Template Preview
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {selectedTemplate.code} - {selectedTemplate.channel}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Variables Input */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Template Variables (JSON)
                </label>
                <textarea
                  value={JSON.stringify(previewVariables, null, 2)}
                  onChange={(e) => {
                    try {
                      setPreviewVariables(JSON.parse(e.target.value));
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  className="w-full h-32 px-3 py-2 rounded-lg text-xs font-mono border outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
                  style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                  placeholder='{"task_name": "Review PO", "entity_type": "PurchaseOrder"}'
                />
                <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  Available variables: {selectedTemplate.variables_json.join(', ')}
                </div>
              </div>

              <button
                onClick={handlePreview}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                style={{ background: 'var(--brand-600)', color: '#fff' }}
              >
                <Eye size={14} />
                Generate Preview
              </button>

              {/* Preview Result */}
              {previewResult && (
                <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      Subject
                    </label>
                    <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)' }}>
                      {previewResult.subject}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                      Body
                    </label>
                    <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)' }}>
                      {previewResult.body}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex items-center justify-end" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewResult(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE CARD
// ═══════════════════════════════════════════════════════════

function TemplateCard({
  template,
  isSelected,
  onClick,
  getChannelIcon,
}: {
  template: NotificationTemplate;
  isSelected: boolean;
  onClick: () => void;
  getChannelIcon: (channel: string) => React.ReactNode;
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
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-50)' }}>
            {getChannelIcon(template.channel)}
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {template.code}
            </h3>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {template.module} · {template.channel}
            </div>
          </div>
        </div>
        {template.is_mandatory_category && (
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
            Mandatory
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          Subject
        </div>
        <div className="text-xs p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)' }}>
          {template.subject}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
        <span>Version: {template.version}</span>
        <span>Locale: {template.locale}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE DETAIL
// ═══════════════════════════════════════════════════════════

function TemplateDetail({
  template,
  onClose,
  onPreview,
  getChannelIcon,
}: {
  template: NotificationTemplate;
  onClose: () => void;
  onPreview: () => void;
  getChannelIcon: (channel: string) => React.ReactNode;
}) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {getChannelIcon(template.channel)}
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {template.code}
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {template.module} · {template.channel} · {template.locale}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Subject
          </label>
          <div className="text-sm p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)' }}>
            {template.subject}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Body
          </label>
          <div className="text-sm p-2 rounded whitespace-pre-wrap" style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)' }}>
            {template.body}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Variables
          </label>
          <div className="flex flex-wrap gap-1">
            {template.variables_json.map(variable => (
              <span key={variable} className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                {`{{${variable}}}`}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Version
            </label>
            <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {template.version}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Mandatory
            </label>
            <div className="text-sm" style={{ color: template.is_mandatory_category ? 'var(--error-600)' : 'var(--text-primary)' }}>
              {template.is_mandatory_category ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Created
            </label>
            <div className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
              {new Date(template.created_at).toLocaleDateString()}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Updated
            </label>
            <div className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
              {new Date(template.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={onPreview}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--brand-600)', color: '#fff' }}
        >
          <Eye size={12} />
          Preview
        </button>
        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Edit2 size={12} />
          Edit
        </button>
      </div>
    </div>
  );
}
