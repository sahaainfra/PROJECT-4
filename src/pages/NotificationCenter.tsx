import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  Archive,
  Filter,
  Search,
  Eye,
  Mail,
  MailOpen,
  Trash2,
} from 'lucide-react';
import {
  notifications,
  notificationCategories,
  getNotificationsByUser,
  getUnreadNotifications,
  getNotificationsByCategory,
  getPriorityColor,
  type Notification,
} from '../data/notificationData';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  archiveNotification,
} from '../core/NotificationService';

// ═══════════════════════════════════════════════════════════
// NOTIFICATION CENTER — Part 16
// Route: /home/rt
// ═══════════════════════════════════════════════════════════

export function NotificationCenter() {
  // Current user (in production, this would come from auth context)
  const currentUserId = 'user-010';

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Get notifications for current user
  let userNotifications = getNotificationsByUser(currentUserId);

  // Apply filters
  if (filterCategory !== 'ALL') {
    userNotifications = userNotifications.filter(n => n.category === filterCategory);
  }
  if (filterPriority !== 'ALL') {
    userNotifications = userNotifications.filter(n => n.priority === filterPriority);
  }
  if (filterRead === 'unread') {
    userNotifications = userNotifications.filter(n => !n.read_at);
  } else if (filterRead === 'read') {
    userNotifications = userNotifications.filter(n => n.read_at);
  }
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    userNotifications = userNotifications.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.body.toLowerCase().includes(query)
    );
  }

  // Sort by created_at (newest first)
  userNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const unreadCount = getUnreadNotifications(currentUserId).length;

  const handleMarkAsRead = (notificationId: string) => {
    try {
      markNotificationAsRead(notificationId, currentUserId);
      // Refresh would happen via state update in production
      alert('Notification marked as read');
    } catch (error) {
      console.error('Failed to mark as read:', error);
      alert(`Failed to mark as read: ${(error as Error).message}`);
    }
  };

  const handleMarkAllAsRead = () => {
    try {
      const count = markAllNotificationsAsRead(currentUserId);
      alert(`Marked ${count} notifications as read`);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      alert(`Failed to mark all as read: ${(error as Error).message}`);
    }
  };

  const handleArchive = (notificationId: string) => {
    try {
      archiveNotification(notificationId, currentUserId);
      alert('Notification archived');
    } catch (error) {
      console.error('Failed to archive:', error);
      alert(`Failed to archive: ${(error as Error).message}`);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Bell size={24} style={{ color: 'var(--brand-600)' }} />
              Notification Center
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
              style={{ background: 'var(--brand-600)', color: '#fff' }}
            >
              <CheckCircle size={14} />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Categories</option>
            {notificationCategories.map(cat => (
              <option key={cat.code} value={cat.code}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as any)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {userNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Bell size={48} className="mb-4" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                No Notifications
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {filterRead === 'unread' ? 'You\'re all caught up!' : 'No notifications match your filters'}
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {userNotifications.map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  isSelected={selectedNotification?.id === notification.id}
                  onClick={() => {
                    setSelectedNotification(notification);
                    if (!notification.read_at) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                  onArchive={() => handleArchive(notification.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedNotification && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <NotificationDetail
              notification={selectedNotification}
              onClose={() => setSelectedNotification(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATION CARD
// ═══════════════════════════════════════════════════════════

function NotificationCard({
  notification,
  isSelected,
  onClick,
  onArchive,
}: {
  notification: Notification;
  isSelected: boolean;
  onClick: () => void;
  onArchive: () => void;
}) {
  const category = notificationCategories.find(c => c.code === notification.category);

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all ${
        isSelected ? 'bg-[var(--nav-active-bg)]' : 'hover:bg-[var(--nav-hover)]'
      } ${!notification.read_at ? 'border-l-4' : ''}`}
      style={{
        borderLeftColor: !notification.read_at ? getPriorityColor(notification.priority) : undefined,
        borderLeftWidth: !notification.read_at ? '4px' : undefined,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">
            {notification.read_at ? (
              <MailOpen size={16} style={{ color: 'var(--text-muted)' }} />
            ) : (
              <Mail size={16} style={{ color: getPriorityColor(notification.priority) }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {notification.title}
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                {category?.name || notification.category}
              </span>
            </div>
            <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {notification.body}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onArchive();
          }}
          className="p-1 rounded hover:bg-[var(--nav-hover)] flex-shrink-0"
          title="Archive"
        >
          <Archive size={14} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
      <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
        <span>{new Date(notification.created_at).toLocaleString()}</span>
        <span className="px-1.5 py-0.5 rounded" style={{ background: getPriorityColor(notification.priority) + '20', color: getPriorityColor(notification.priority) }}>
          {notification.priority}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATION DETAIL
// ═══════════════════════════════════════════════════════════

function NotificationDetail({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const category = notificationCategories.find(c => c.code === notification.category);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bell size={20} style={{ color: getPriorityColor(notification.priority) }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {notification.title}
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {category?.name || notification.category}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Priority Badge */}
      <div className="mb-4">
        <span className="text-xs px-2 py-1 rounded-full font-medium"
          style={{
            background: getPriorityColor(notification.priority) + '20',
            color: getPriorityColor(notification.priority),
          }}>
          {notification.priority.toUpperCase()} PRIORITY
        </span>
      </div>

      {/* Body */}
      <div className="mb-6">
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {notification.body}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <DetailRow label="Created" value={new Date(notification.created_at).toLocaleString()} />
        {notification.read_at && (
          <DetailRow label="Read" value={new Date(notification.read_at).toLocaleString()} />
        )}
        {notification.entity_type && (
          <DetailRow label="Entity" value={`${notification.entity_type} ${notification.entity_id}`} />
        )}
        {notification.event_id && (
          <DetailRow label="Event ID" value={notification.event_id} />
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {notification.link && (
          <a
            href={notification.link}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            <Eye size={14} />
            View Details
          </a>
        )}
        {!notification.read_at && (
          <button
            onClick={() => {
              markNotificationAsRead(notification.id, notification.user_id);
              alert('Marked as read');
            }}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <CheckCircle size={14} />
            Mark as Read
          </button>
        )}
        <button
          onClick={() => {
            archiveNotification(notification.id, notification.user_id);
            alert('Archived');
            onClose();
          }}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
        >
          <Archive size={14} />
          Archive
        </button>
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
