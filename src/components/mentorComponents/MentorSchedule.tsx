import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Users, Video, CreditCard as Edit, Trash2, RotateCcw, X, MapPin, Loader2 } from 'lucide-react';
import { useApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const LMS_BASE_URL = 'https://live-class-lms1-672553132888.asia-south1.run.app';

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
  const [scheduleModal, setScheduleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState({
    section_id: '',
    session_type: 'theory',
    start_date: '',
    class_time: '',
    duration: 60,
    venue: '',
    session_title: '',
    program: '',
    cohort: '',
    location: ''
  });

  // Fetch batches and programs on modal open
  useEffect(() => {
    if (scheduleModal) {
      fetchBatches();
      fetchPrograms();
    }
  }, [scheduleModal]);

  // Fetch sections when batch is selected
  useEffect(() => {
    if (selectedBatchId) {
      fetchSections(selectedBatchId);
    }
  }, [selectedBatchId]);

  const fetchBatches = async () => {
    try {
      const response = await fetch(`${LMS_BASE_URL}/api/v1/mentor/cards/batches`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      setBatches(data.batches || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${LMS_BASE_URL}/api/v1/admin/mentors/getAllCourses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      setPrograms(data.courses || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchSections = async (batchId: string) => {
    try {
      const response = await fetch(`${LMS_BASE_URL}/api/v1/mentor/cards/sections/${batchId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      // API returns array directly, not wrapped in object
      setSections(Array.isArray(data) ? data : data.sections || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    setSections([]);
    setSessionData({...sessionData, section_id: ''}); // Reset section when batch changes
  };

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

  const openScheduleModal = () => {
    setScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setScheduleModal(false);
    setSelectedBatchId('');
    setSections([]);
    setPrograms([]);
    setSessionData({
      section_id: '',
      session_type: 'theory',
      start_date: '',
      class_time: '',
      duration: 60,
      venue: '',
      session_title: '',
      program: '',
      cohort: '',
      location: ''
    });
  };

  const handleScheduleSession = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${LMS_BASE_URL}/api/v1/mentor/cards/Addsessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          section_id: parseInt(sessionData.section_id),
          faculty_id: user?.id,
          session_type: sessionData.session_type,
          start_date: sessionData.start_date,
          class_time: sessionData.class_time,
          duration: sessionData.duration,
          venue: sessionData.venue
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to schedule session');
      }

      alert('Session scheduled successfully!');
      closeScheduleModal();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
          <button 
            onClick={openScheduleModal}
            className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200"
          >
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

      {/* Schedule New Session Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">Schedule New Session</h3>
              <button
                onClick={closeScheduleModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Batch Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => handleBatchChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batch_name} {batch.academic_year && batch.semester ? `(${batch.academic_year} - Sem ${batch.semester})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Selection (shows after batch is selected) */}
              {selectedBatchId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course/Section <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={sessionData.section_id}
                    onChange={(e) => setSessionData({...sessionData, section_id: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                    required
                  >
                    <option value="">Select Course/Section</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.course_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={sessionData.session_type}
                  onChange={(e) => setSessionData({...sessionData, session_type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                  required
                >
                  <option value="theory">Theory</option>
                  <option value="practical">Practical</option>
                  <option value="lab">Lab</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue <span className="text-red-500">*</span>
                </label>
                <select
                  value={sessionData.venue}
                  onChange={(e) => setSessionData({...sessionData, venue: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                  required
                >
                  <option value="">Select Venue</option>
                  <option value="Room 101">Room 101</option>
                  <option value="Room 102">Room 102</option>
                  <option value="Room 203">Room 203</option>
                  <option value="Lab A">Lab A</option>
                  <option value="Lab B">Lab B</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              {/* Session Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={sessionData.session_title}
                  onChange={(e) => setSessionData({...sessionData, session_title: e.target.value})}
                  placeholder="e.g., React Fundamentals"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={sessionData.start_date}
                  onChange={(e) => setSessionData({...sessionData, start_date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={sessionData.class_time}
                  onChange={(e) => setSessionData({...sessionData, class_time: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <select
                  value={sessionData.duration}
                  onChange={(e) => setSessionData({...sessionData, duration: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                  required
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                  <option value="150">150 minutes</option>
                  <option value="180">180 minutes</option>
                </select>
              </div>

              {/* Program */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                <select
                  value={sessionData.program}
                  onChange={(e) => setSessionData({...sessionData, program: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                >
                  <option value="">Select Program (Optional)</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.course_name || program.name}>
                      {program.course_name || program.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cohort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cohort</label>
                <input
                  type="text"
                  value={sessionData.cohort}
                  onChange={(e) => setSessionData({...sessionData, cohort: e.target.value})}
                  placeholder="e.g., 2024-A"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={sessionData.location}
                  onChange={(e) => setSessionData({...sessionData, location: e.target.value})}
                  placeholder="Physical location or coordinates"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeScheduleModal}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSession}
                disabled={loading || !sessionData.section_id || !sessionData.start_date || !sessionData.class_time || !sessionData.venue}
                className="flex items-center space-x-2 bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Schedule Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSchedule;