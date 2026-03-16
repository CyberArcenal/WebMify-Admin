import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { dialogs } from "../../utils/dialogs";
import notificationAPI, {
  type Notification as APINotification,
} from "@/api/core/notification"; // <-- updated import
import { useNotificationView } from "@/pages/notifications/hooks/useNotificationView";
import NotificationViewDialog from "@/pages/notifications/components/NotificationViewDialog";


// Local interface matching what the component expects (camelCase)
interface Notification {
  id: number;
  title: string;
  message: string;
  type: APINotification["type"];
  isRead: boolean;
  metadata: Record<string, any> | null;
  createdAt: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const pageSize = 15;

  const notificationView = useNotificationView();

  // Helper to convert API notification to component format
  const toComponentNotification = (apiNotif: APINotification): Notification => ({
    id: apiNotif.id,
    title: apiNotif.title,
    message: apiNotif.message,
    type: apiNotif.type,
    isRead: apiNotif.is_read,
    metadata: apiNotif.metadata,
    createdAt: apiNotif.created_at,
  });

  // Reset when drawer opens
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setNotifications([]);
      fetchUnreadCount();
    }
  }, [isOpen]);

  // Fetch notifications on page change
  useEffect(() => {
    if (!isOpen) return;
    fetchNotifications(page === 1);
  }, [page, isOpen]);

  const fetchNotifications = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationAPI.list({
        page,
        page_size: pageSize,
      });
      // response is PaginatedResponse<APINotification> with results array
      const apiNotifs = response.results;
      const newItems = apiNotifs.map(toComponentNotification);
      setNotifications((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(apiNotifs.length === pageSize);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      // We don't have a dedicated unread count endpoint in the new API.
      // We'll fetch the first page and count unread locally, or add a custom endpoint later.
      // For now, we'll just set it to 0 to avoid breaking the UI.
      // TODO: add a backend endpoint for unread count and use it here.
      setUnreadCount(0);
      onUnreadCountChange?.(0);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const updated = await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: updated.is_read } : n
        )
      );
      const newUnreadCount = Math.max(0, unreadCount - 1);
      setUnreadCount(newUnreadCount);
      onUnreadCountChange?.(newUnreadCount);
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleMarkAllAsRead = async () => {
    // The new API doesn't have a bulk mark-as-read endpoint.
    // We'll show a message and optionally implement individual calls later.
    dialogs.alert({
      title: "Not Implemented",
      message: "Mark all as read is not yet available.",
    });
  };

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
    });
    if (!confirmed) return;

    try {
      await notificationAPI.delete(id);
      const wasUnread =
        notifications.find((n) => n.id === id)?.isRead === false;
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) {
        const newUnreadCount = Math.max(0, unreadCount - 1);
        setUnreadCount(newUnreadCount);
        onUnreadCountChange?.(newUnreadCount);
      }
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isLongMessage = (message: string) => message.length > 100;

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return (
          <div className="w-2 h-2 rounded-full bg-[var(--accent-green)]" />
        );
      case "warning":
        return (
          <div className="w-2 h-2 rounded-full bg-[var(--accent-amber)]" />
        );
      case "error":
        return <div className="w-2 h-2 rounded-full bg-[var(--accent-red)]" />;
      case "info":
        return <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" />;
      case "project":
      case "product":
      case "skill":
      case "message":
      case "portfolio":
        return (
          <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)]" />
        );
      default:
        return (
          <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)]" />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--card-bg)] border-l border-[var(--border-color)] shadow-xl transform transition-transform duration-300 ease-in-out windows-fade-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[var(--accent-blue)]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-[var(--accent-blue)]">
                    ({unreadCount} unread)
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
            >
              <X className="w-5 h-5 text-[var(--text-tertiary)]" />
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-end gap-2 p-2 border-b border-[var(--border-color)]">
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--accent-blue)] hover:bg-[var(--accent-blue-light)] rounded transition-colors"
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-blue)]" />
              </div>
            ) : error ? (
              <div className="text-center p-6">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-[var(--accent-red)]" />
                <p className="text-sm text-[var(--text-primary)]">{error}</p>
                <button
                  onClick={() => {
                    setPage(1);
                    setNotifications([]);
                    fetchNotifications(true);
                  }}
                  className="mt-3 px-4 py-2 bg-[var(--accent-blue)] text-white rounded text-sm"
                >
                  Retry
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-6">
                <Bell className="w-10 h-10 mx-auto mb-2 text-[var(--text-tertiary)]" />
                <p className="text-sm text-[var(--text-primary)]">
                  No notifications yet
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                  When you get notifications, they'll appear here.
                </p>
              </div>
            ) : (
              <>
                {notifications.map((notification) => {
                  const expanded = expandedIds.has(notification.id);
                  const longMessage = isLongMessage(notification.message);

                  return (
                    <div
                      key={notification.id}
                      onClick={() => {
                        if (!notification.isRead) {
                          handleMarkAsRead(notification.id);
                        }
                        notificationView.open(notification.id);
                      }}
                      className={`group relative p-3 rounded-lg border cursor-pointer ${
                        notification.isRead
                          ? "border-[var(--border-color)] bg-[var(--card-secondary-bg)]"
                          : "border-[var(--accent-blue)] bg-[var(--accent-blue-light)]"
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              notification.isRead
                                ? "text-[var(--text-secondary)]"
                                : "text-[var(--text-primary)]"
                            }`}
                          >
                            {notification.title}
                          </p>

                          {/* Message with expand/collapse */}
                          <div className="mt-1">
                            <p
                              className={`text-xs text-[var(--text-tertiary)] ${
                                !expanded ? "line-clamp-2" : ""
                              }`}
                            >
                              {notification.message}
                            </p>
                            {longMessage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpanded(notification.id);
                                }}
                                className="mt-1 text-xs text-[var(--accent-blue)] hover:underline flex items-center gap-1"
                              >
                                {expanded ? (
                                  <>
                                    Show less <ChevronUp className="w-3 h-3" />
                                  </>
                                ) : (
                                  <>
                                    Read more{" "}
                                    <ChevronDown className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-[var(--text-tertiary)] mt-2">
                            {format(
                              new Date(notification.createdAt),
                              "MMM dd, yyyy • hh:mm a"
                            )}
                          </p>

                          {/* Metadata - only show when expanded */}
                          {notification.metadata && expanded && (
                            <div className="mt-2 text-xs text-[var(--text-tertiary)] bg-[var(--card-bg)] p-2 rounded border border-[var(--border-color)]">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(notification.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                              title="Mark as read"
                            >
                              <CheckCheck className="w-4 h-4 text-[var(--accent-blue)]" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-[var(--accent-red)]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Load more */}
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full py-2 text-sm text-[var(--accent-blue)] hover:bg-[var(--accent-blue-light)] rounded transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      "Load more"
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <NotificationViewDialog
        isOpen={notificationView.isOpen}
        notification={notificationView.notification}
        loading={notificationView.loading}
        onClose={notificationView.close}
      />
    </div>
  );
};