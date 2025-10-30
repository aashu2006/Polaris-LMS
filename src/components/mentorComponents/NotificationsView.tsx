import React, { useState } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle } from 'lucide-react';

const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'New Student Enrollment',
      message: 'John Doe has enrolled in Full Stack Development program',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Attendance Alert',
      message: 'Data Science Bootcamp - Cohort 2024-B has 65% attendance this week',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Program Completed',
      message: 'UI/UX Design Track - Cohort 2024-A has successfully completed',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'error',
      title: 'Payment Failed',
      message: 'Payment processing failed for student Sarah Wilson',
      time: '5 hours ago',
      read: false
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-[#FFC540]" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">
            Stay updated with important alerts and system messages.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">
            {unreadCount} unread notifications
          </span>
          <button 
            onClick={markAllAsRead}
            className="flex items-center space-x-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200"
          >
            <Check className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-gray-800 rounded-xl border border-gray-700 p-6 transition-all duration-200 ${
              !notification.read ? 'border-l-4 border-l-[#FFC540]' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-[#FFC540] rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 text-gray-400 hover:text-[#FFC540] transition-colors duration-200"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                  title="Delete notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
          <p className="text-gray-400">You're all caught up! Check back later for updates.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsView;