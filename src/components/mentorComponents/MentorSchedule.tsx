import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Plus, Clock, Users, Video, CreditCard as Edit, Trash2, RotateCcw, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../services/api';

const MentorSchedule: React.FC = () => {
  const api = useApi();
  const { user, token } = useAuth();
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

  type UiSession = {
    id: number;
    title: string;
    date: string; // ISO yyyy-mm-dd
    time: string; // HH:mm
    duration: number;
    students: number;
    program: string;
    cohort: string;
    status: string;
    recurring: 'none' | 'weekly';
    dateTime: Date; // original datetime for filtering
  };

  const [sessions, setSessions] = useState<UiSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = useMemo(() => {
    return (import.meta as any).env?.VITE_LMS_BASE_URL || '<<base_url>>';
  }, []);

  const getFacultyIdFromToken = (t?: string | null): string | null => {
    if (!t) return null;
    try {
      const parts = t.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(decodeURIComponent(escape(atob(payload))));
      return decoded.faculty_id || decoded.facultyId || decoded.userId || decoded.sub || decoded.id || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
  
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        setError(null);
  
        const resp = await api.lms.mentors.getFacultyStudents();
        const data = Array.isArray(resp) ? resp : (resp?.data ?? []);
  
        // Map to UiSession
        const mapped: UiSession[] = (data as any[]).map((s: any) => {
          const rawDt = s.session_datetime ?? s.sessionDate ?? s.dateTime ?? s.datetime;
          const dt = rawDt ? new Date(rawDt) : new Date();
  
          const yyyy = dt.getFullYear();
          const mm = String(dt.getMonth() + 1).padStart(2, '0');
          const dd = String(dt.getDate()).padStart(2, '0');
          const hh = String(dt.getHours()).padStart(2, '0');
          const mi = String(dt.getMinutes()).padStart(2, '0');
  
          const rawStatus = (s.status ?? 'scheduled').toString().toLowerCase();
          const uiStatus = rawStatus === 'upcoming' ? 'scheduled' : rawStatus;
  
          return {
            id: Number(s.session_id ?? s.id ?? Date.now()),
            title: s.course_name ?? s.title ?? 'Session',
            date: `${yyyy}-${mm}-${dd}`,
            time: `${hh}:${mi}`,
            duration: Number(s.duration ?? s.length ?? 60),
            students: Number(s.student_count ?? s.students ?? 0),
            program: s.course_name ?? s.program ?? '',
            cohort: s.course_code ?? s.cohort ?? '',
            status: uiStatus,
            recurring: (s.recurring === 'weekly') ? 'weekly' : 'none',
            dateTime: dt,
          } as UiSession;
        });
  
        if (isMounted) setSessions(mapped);
      } catch (err: any) {
        if (isMounted) setError(err?.message ?? 'Failed to load sessions');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
  
    load();
    return () => { isMounted = false; };
  }, [api, token, user]); 
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Week/Month filters based on selectedDate and session_datetime
  const startOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = (date.getDay() + 6) % 7; // Mon=0 ... Sun=6
    date.setHours(0,0,0,0);
    date.setDate(date.getDate() - day);
    return date;
  };
  const endOfWeek = (d: Date) => {
    const start = startOfWeek(d);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return end;
  };
  const startOfMonth = (d: Date) => {
    const date = new Date(d.getFullYear(), d.getMonth(), 1);
    date.setHours(0,0,0,0);
    return date;
  };
  const endOfMonth = (d: Date) => {
    const date = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    date.setHours(0,0,0,0);
    return date;
  };

  const visibleSessions = useMemo(() => {
    if (!sessions.length) return [] as UiSession[];
    if (viewMode === 'week') {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      return sessions.filter(s => s.dateTime >= start && s.dateTime < end);
    } else {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      return sessions.filter(s => s.dateTime >= start && s.dateTime < end);
    }
  }, [sessions, viewMode, selectedDate]);

  const handleReschedule = (sessionId: number) => {
    setRescheduleModal({ isOpen: true, sessionId });
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
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'postponed':
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-900 border-yellow-200';
      case 'live':
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
          <h2 className="text-xl font-bold text-gray-900">{selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {loading && (
            <div className="text-gray-500">Loading sessions...</div>
          )}
          {error && (
            <div className="text-red-600">{error}</div>
          )}
          {!loading && !error && visibleSessions.map((session) => (
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
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
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