import React, { useState } from 'react';
import { Calendar, Plus, Clock, Users, Video, CreditCard as Edit, Trash2, RotateCcw, X } from 'lucide-react';

const MentorSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [rescheduleModal, setRescheduleModal] = useState<{ isOpen: boolean; sessionId: number | null }>({
    isOpen: false,
    sessionId: null
  });
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  const sessions = [
    {
      id: 1,
      title: 'React Fundamentals - Components & Props',
      date: '2024-01-15',
      time: '14:00',
      duration: 120,
      students: 8,
      program: 'Full Stack Development',
      cohort: '2024-A',
      status: 'scheduled',
      recurring: 'weekly'
    },
    {
      id: 2,
      title: 'State Management with Redux',
      date: '2024-01-16',
      time: '10:00',
      duration: 120,
      students: 8,
      program: 'Full Stack Development',
      cohort: '2024-A',
      status: 'scheduled',
      recurring: 'none'
    },
    {
      id: 3,
      title: 'API Integration & Async Programming',
      date: '2024-01-17',
      time: '15:00',
      duration: 120,
      students: 6,
      program: 'Full Stack Development',
      cohort: '2024-B',
      status: 'scheduled',
      recurring: 'none'
    }
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleReschedule = (sessionId: number) => {
    setRescheduleModal({ isOpen: true, sessionId });
    // Pre-fill with current session data
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setRescheduleData({
        date: session.date,
        time: session.time,
        reason: ''
      });
    }
  };

  const submitReschedule = () => {
    // Here you would make the API call to reschedule the session
    console.log('Rescheduling session:', rescheduleModal.sessionId, rescheduleData);
    setRescheduleModal({ isOpen: false, sessionId: null });
    setRescheduleData({ date: '', time: '', reason: '' });
  };

  const closeRescheduleModal = () => {
    setRescheduleModal({ isOpen: false, sessionId: null });
    setRescheduleData({ date: '', time: '', reason: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">Manage your sessions and create new ones.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Month
            </button>
          </div>
          <button className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">January 2024</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{session.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                    {session.recurring !== 'none' && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        Recurring {session.recurring}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(session.time)} ({session.duration}min)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{session.students} students</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{session.program}</span> • {session.cohort}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200">
                    <Video className="h-4 w-4" />
                    <span>Start</span>
                  </button>
                  <button 
                    onClick={() => handleReschedule(session.id)}
                    className="p-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                    title="Reschedule session"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Schedule Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
            <input
              type="text"
              placeholder="Enter session title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
              <option value="180">180 minutes</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end mt-4">
          <button className="flex items-center space-x-2 bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Reschedule Session</h3>
              <button
                onClick={closeRescheduleModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                <input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                <input
                  type="time"
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rescheduling</label>
                <textarea
                  value={rescheduleData.reason}
                  onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                  placeholder="Optional: Explain why you're rescheduling this session..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Students will be automatically notified of the schedule change via email and in-app notifications.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeRescheduleModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitReschedule}
                className="flex items-center space-x-2 bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reschedule Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSchedule;