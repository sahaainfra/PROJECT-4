import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Users, Eye } from 'lucide-react';
import { 
  accessReviewCampaigns, 
  accessReviewItems,
  getCampaignItems,
  getCampaignStatusColor,
  getReviewItemStatusColor,
  type AccessReviewCampaign,
  type AccessReviewItem
} from '../data/identitySodData';

// ═══════════════════════════════════════════════════════════
// ACCESS REVIEWS — Part 09
// Route: /admin/idsod/access-reviews
// ═══════════════════════════════════════════════════════════

export function AccessReviews() {
  const [selectedCampaign, setSelectedCampaign] = useState<AccessReviewCampaign | null>(null);
  const [showItems, setShowItems] = useState(false);

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Calendar size={24} style={{ color: 'var(--brand-600)' }} />
              Access Review Campaigns
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Quarterly access certification and review
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Calendar size={16} />
            New Campaign
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!showItems ? (
          /* Campaigns List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessReviewCampaigns.map(campaign => {
              const completionPercent = campaign.totalGrants > 0 
                ? Math.round((campaign.reviewedGrants / campaign.totalGrants) * 100)
                : 0;

              return (
                <div
                  key={campaign.id}
                  onClick={() => { setSelectedCampaign(campaign); setShowItems(true); }}
                  className="p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {campaign.name}
                      </h3>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {campaign.scopeName}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ 
                        background: getCampaignStatusColor(campaign.status) + '20', 
                        color: getCampaignStatusColor(campaign.status) 
                      }}>
                      {campaign.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {campaign.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                        Progress
                      </span>
                      <span className="text-[10px] tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>
                        {completionPercent}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ 
                          width: `${completionPercent}%`,
                          background: completionPercent === 100 ? 'var(--success-600)' : 'var(--brand-600)'
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                      <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                        {campaign.reviewedGrants}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Reviewed
                      </div>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                      <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                        {campaign.pendingGrants}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Pending
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Due: {new Date(campaign.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={10} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {campaign.totalGrants} grants
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : selectedCampaign ? (
          /* Campaign Items */
          <CampaignItems campaign={selectedCampaign} onBack={() => setShowItems(false)} />
        ) : null}
      </div>
    </div>
  );
}

function CampaignItems({ campaign, onBack }: { campaign: AccessReviewCampaign; onBack: () => void }) {
  const items = getCampaignItems(campaign.id);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredItems = items.filter(item => 
    filterStatus === 'ALL' || item.status === filterStatus
  );

  return (
    <div>
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-link)' }}
      >
        ← Back to Campaigns
      </button>

      {/* Campaign Header */}
      <div className="p-4 rounded-xl border mb-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {campaign.name}
            </h2>
            <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {campaign.scopeName} · Due {new Date(campaign.dueDate).toLocaleDateString()}
            </div>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ 
              background: getCampaignStatusColor(campaign.status) + '20', 
              color: getCampaignStatusColor(campaign.status) 
            }}>
            {campaign.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
            <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {campaign.totalGrants}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Total
            </div>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: 'var(--success-50)' }}>
            <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--success-700)' }}>
              {campaign.approvedGrants}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--success-600)' }}>
              Approved
            </div>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: 'var(--error-50)' }}>
            <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--error-700)' }}>
              {campaign.revokedGrants}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--error-600)' }}>
              Revoked
            </div>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ background: 'var(--warning-50)' }}>
            <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--warning-700)' }}>
              {campaign.pendingGrants}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--warning-600)' }}>
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
        >
          <option value="ALL">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="revoked">Revoked</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Items Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>User</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Scope</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Last Used</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Reviewer</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.userName}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {item.userEmail}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                    {item.roleName}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {item.scopeType}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {item.scopeName}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(item.lastUsedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {item.reviewerName || '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ 
                      background: getReviewItemStatusColor(item.status) + '20', 
                      color: getReviewItemStatusColor(item.status) 
                    }}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.status === 'pending' ? (
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 rounded hover:bg-[var(--success-50)]" title="Approve">
                        <CheckCircle size={14} style={{ color: 'var(--success-600)' }} />
                      </button>
                      <button className="p-1 rounded hover:bg-[var(--error-50)]" title="Revoke">
                        <XCircle size={14} style={{ color: 'var(--error-600)' }} />
                      </button>
                    </div>
                  ) : (
                    <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="View">
                      <Eye size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
