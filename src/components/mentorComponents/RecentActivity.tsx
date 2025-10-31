import React from 'react';
import { Clock } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      action: 'New mentor added',
      details: 'Sarah Johnson joined Full Stack Development',
      time: '2 hours ago',
      type: 'mentor'
    },
    {
      action: 'Program completed',
      details: 'UI/UX Design Track finished successfully',
      time: '5 hours ago',
      type: 'program'
    },
    {
      action: 'Bulk upload completed',
      details: '45 students added to Data Science Bootcamp',
      time: '1 day ago',
      type: 'students'
    },
    {
      action: 'Session scheduled',
      details: 'React Fundamentals - Tomorrow at 2 PM',
      time: '2 days ago',
      type: 'session'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-[#FFC540] rounded-full mt-2"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{activity.action}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.details}</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-gray-400 hover:text-white transition-colors duration-200">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivity;