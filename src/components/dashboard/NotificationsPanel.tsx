import React from 'react';
import { X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { format } from 'date-fns';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, loading } = useNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-600">{unreadCount} unread</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-6 py-2 text-sm text-primary hover:underline"
          >
            Mark all as read
          </button>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-600">Loading notifications...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-gray-600">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 rounded-lg ${
                    notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className={`mt-1 w-2 h-2 rounded-full ${
                        notification.isRead ? 'bg-gray-400' : 'bg-blue-600'
                      }`} 
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{notification.title}</div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;