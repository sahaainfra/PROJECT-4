import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  Save,
} from 'lucide-react';
import {
  notificationCategories,
  notificationPreferences,
  getPreferenceByUserAndCategory,
  type NotificationCategory,
  type NotificationPreference,
} from '../data/notificationData';
import { updatePreference } from '../core/NotificationService';

// ═══════════════════════════════════════════════════════════
// NOTIFICATION PREFERENCES — Part 16
// Route: /home/rt/preferences
// ═══════════════════════════════════════════════════════════

export function NotificationPreferences() {
  // Current user (in production, this would come from auth context)
  const currentUserId = 'user-010';

  const [preferences, setPreferences] = useState<NotificationPreference[]>(
    notificationCategories.map(category => {
      const existing = getPreferenceByUserAndCategory(currentUserId, category.code);
      return existing || {
        id: `pref-new-${category.code}`,
        user_id: currentUserId,
        category: category.code,
        channels_json: category.default_channels,
        digest: 'none' as const,
      };
    })
  );

  const [quietHours, setQuietHours] = useState({
    start: '22:00',
    end: '07:00',
    enabled: false,
  });

  const handleChannelToggle = (categoryCode: string, channel: string) => {
    setPreferences(prev => prev.map(pref => {
      if (pref.category === categoryCode) {
        const category = notificationCategories.find(c => c.code === categoryCode);
        
        // Cannot modify mandatory categories
        if (category?.mandatory) {
          return pref;
        }

        const channels = pref.channels_json.includes(channel)
          ? pref.channels_json.filter(c => c !== channel)
          : [...pref.channels_json, channel];

        return { ...pref, channels_json: channels };
      }
      return pref;
    }));
  };

  const handleDigestChange = (categoryCode: string, digest: 'none' | 'hourly' | 'daily') => {
    setPreferences(prev => prev.map(pref => {
      if (pref.category === categoryCode) {
        return { ...pref, digest };
      }
      return pref;
    }));
  };

  const handleSave = () => {
    try {
      for (const pref of preferences) {
        updatePreference({
          user_id: currentUserId,
          category: pref.category,
          channels: pref.channels_json,
          digest: pref.digest,
          quiet_hours: quietHours.enabled ? quietHours : undefined,
        });
      }
      alert('Preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert(`Failed to save preferences: ${(error as Error).message}`);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Settings size={24} style={{ color: 'var(--brand-600)' }} />
              Notification Preferences
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Configure how and when you receive notifications
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            <Save size={14} />
            Save Preferences
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quiet Hours */}
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: 'var(--brand-600)' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Quiet Hours
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={quietHours.enabled}
                onChange={(e) => setQuietHours({ ...quietHours, enabled: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Enable</span>
            </label>
          </div>
          {quietHours.enabled && (
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Start Time
                </label>
                <input
                  type="time"
                  value={quietHours.start}
                  onChange={(e) => setQuietHours({ ...quietHours, start: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                  style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  End Time
                </label>
                <input
                  type="time"
                  value={quietHours.end}
                  onChange={(e) => setQuietHours({ ...quietHours, end: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                  style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div className="col-span-2 text-xs p-2 rounded" style={{ background: 'var(--info-50)', color: 'var(--info-700)' }}>
                During quiet hours, non-critical notifications will be deferred or sent as digest
              </div>
            </div>
          )}
        </div>

        {/* Category Preferences */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Notification Categories
          </h2>
          {notificationCategories.map(category => {
            const preference = preferences.find(p => p.category === category.code);
            if (!preference) return null;

            return (
              <CategoryPreferenceCard
                key={category.code}
                category={category}
                preference={preference}
                onChannelToggle={handleChannelToggle}
                onDigestChange={handleDigestChange}
                getChannelIcon={getChannelIcon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CATEGORY PREFERENCE CARD
// ═══════════════════════════════════════════════════════════

function CategoryPreferenceCard({
  category,
  preference,
  onChannelToggle,
  onDigestChange,
  getChannelIcon,
}: {
  category: NotificationCategory;
  preference: NotificationPreference;
  onChannelToggle: (categoryCode: string, channel: string) => void;
  onDigestChange: (categoryCode: string, digest: 'none' | 'hourly' | 'daily') => void;
  getChannelIcon: (channel: string) => React.ReactNode;
}) {
  const channels = ['in_app', 'email', 'sms', 'whatsapp', 'push'];

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            {category.name}
            {category.mandatory && (
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
                Mandatory
              </span>
            )}
          </h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {category.description}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Channels */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Delivery Channels
          </label>
          <div className="grid grid-cols-5 gap-2">
            {channels.map(channel => {
              const isEnabled = preference.channels_json.includes(channel);
              const isDisabled = category.mandatory && category.default_channels.includes(channel);

              return (
                <button
                  key={channel}
                  onClick={() => !isDisabled && onChannelToggle(category.code, channel)}
                  disabled={isDisabled}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[var(--nav-hover)]'
                  }`}
                  style={{
                    borderColor: isEnabled ? 'var(--brand-600)' : 'var(--border-subtle)',
                    background: isEnabled ? 'var(--brand-50)' : 'transparent',
                  }}
                >
                  <div style={{ color: isEnabled ? 'var(--brand-600)' : 'var(--text-muted)' }}>
                    {getChannelIcon(channel)}
                  </div>
                  <span className="text-[10px] capitalize" style={{ color: isEnabled ? 'var(--brand-600)' : 'var(--text-muted)' }}>
                    {channel.replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Digest */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Digest Frequency
          </label>
          <div className="flex gap-2">
            {(['none', 'hourly', 'daily'] as const).map(digest => (
              <button
                key={digest}
                onClick={() => onDigestChange(category.code, digest)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  preference.digest === digest ? '' : 'hover:bg-[var(--nav-hover)]'
                }`}
                style={{
                  borderColor: preference.digest === digest ? 'var(--brand-600)' : 'var(--border-subtle)',
                  background: preference.digest === digest ? 'var(--brand-50)' : 'transparent',
                  color: preference.digest === digest ? 'var(--brand-600)' : 'var(--text-secondary)',
                }}
              >
                {digest === 'none' ? 'Immediate' : digest === 'hourly' ? 'Hourly' : 'Daily'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
