// src/renderer/pages/notifications/hooks/useNotificationView.ts
import { useState } from 'react';
import { showError } from '../../../utils/notification';
import notificationAPI, { type Notification} from '@/api/core/notification';

export const useNotificationView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await notificationAPI.get(id);
      // Transform snake_case API response to camelCase component format
      setNotification({
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.type,
        is_read: data.is_read,
        user: data.user,
        created_at: data.created_at,
        updated_at: data.updated_at,
        metadata: data.metadata,
      });
    } catch (err: any) {
      showError(err.message || 'Failed to load notification');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setNotification(null);
  };

  return {
    isOpen,
    loading,
    notification,
    open,
    close,
  };
};