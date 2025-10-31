import React from 'react';
import { Calendar, Clock, Users, Video, CreditCard as Edit } from 'lucide-react';

const UpcomingSessions: React.FC = () => {
  const sessions = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      instructor: 'Sarah Mitchell',
      subject: 'React.js',
      date: 'Today',
      time: '2:00 PM',
      status: 'live',
      action: 'Join Now'
    },
    {
      id: 2,
      title: 'Node.js Microservices',
      instructor: 'James Cooper',
      subject: 'Node.js',
      date: 'Tomorrow',
      time: '10:00 AM',
      status: 'rescheduled',
      action: 'Calendar',
      note: 'Originally scheduled for Today'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-900 text-red-300';
      case 'rescheduled':
        return 'bg-[#FFC540] text-black';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Join Now':
        return 'bg-[#FFC540] text-black hover:bg-[#e6b139]';
      case 'Calendar':
        return 'bg-[#FFC540] text-black hover:bg-[#e6b139]';
      default:
        return 'bg-gray-700 text-white hover:bg-gray-600';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-white" />
            <h2 className="text-xl font-bold text-white">Upcoming Classes</h2>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-white">{session.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(session.status)}`}>
                      {session.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{session.instructor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-600 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded"></div>
                      </div>
                      <span>{session.subject}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{session.time}</span>
                    </div>
                  </div>

                  {session.note && (
                    <div className="text-xs text-[#FFC540] mb-2">
                      {session.note}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${getActionColor(session.action)}`}>
                    {session.action === 'Join Now' && <Video className="h-4 w-4" />}
                    {session.action === 'Calendar' && <Calendar className="h-4 w-4" />}
                    <span>{session.action}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingSessions;