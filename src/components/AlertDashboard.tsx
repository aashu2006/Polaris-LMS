import React from 'react';
import { Bell, AlertTriangle, AlertCircle, Settings } from 'lucide-react';

const AlertSummaryDashboard: React.FC = () => {
  const alerts = [
    {
      id: 1,
      icon: Bell,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      hoverNumberColor: 'group-hover:text-blue-400',
      count: 5,
      label: 'Total Alerts',
      borderColor: 'border-blue-500/20',
      hoverShadow: 'hover:shadow-[0_2px_8px_rgba(59,130,246,0.3)]'
    },
    {
      id: 2,
      icon: AlertTriangle,
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400',
      hoverNumberColor: 'group-hover:text-yellow-400',
      count: 3,
      label: 'Unread',
      borderColor: 'border-yellow-500/20',
      hoverShadow: 'hover:shadow-[0_2px_8px_rgba(234,179,8,0.3)]'
    },
    {
      id: 3,
      icon: AlertCircle,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400',
      hoverNumberColor: 'group-hover:text-red-400',
      count: 2,
      label: 'High Priority',
      borderColor: 'border-red-500/20',
      hoverShadow: 'hover:shadow-[0_2px_8px_rgba(248,113,113,0.3)]'
    },
    {
      id: 4,
      icon: Bell,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-400',
      hoverNumberColor: 'group-hover:text-green-400',
      count: 3,
      label: 'Medium/Low',
      borderColor: 'border-green-500/20',
      hoverShadow: 'hover:shadow-[0_2px_8px_rgba(74,222,128,0.3)]'
    }
  ];

  const handleMarkAllRead = () => {
    console.log('Mark all as read');
  };

  const handleSettings = () => {
    console.log('Open settings');
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">System Alerts</h1>
            <p className="text-gray-400 text-lg">Monitor and manage system alerts and notifications</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleMarkAllRead}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Mark All Read
            </button>
            <button
              onClick={handleSettings}
              className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            
            return (
              <div
                key={alert.id}
                className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border ${alert.borderColor} ${alert.hoverShadow} transition-all duration-300 cursor-pointer group`}
              >
                <div className="flex flex-col space-y-4">
                  <div className={`${alert.iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${alert.iconColor}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`text-5xl font-bold text-white ${alert.hoverNumberColor} transition-colors duration-300`}>
                      {alert.count}
                    </div>
                    <div className="text-gray-400 text-sm font-medium">
                      {alert.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertSummaryDashboard;