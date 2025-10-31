import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../services/api';


interface ApiSession {
  id: number;
  section_id: number;
  session_datetime: string;
  duration: number;
  venue: string;
  status: string;
  attendance_token: string;
  token_expires_at: string;
  session_type: string;
  actual_faculty_id: string;
  created_at: string;
  session_location_coordinates: unknown | null;
  is_live: boolean;
  rescheduled_date_time: string | null;
  rescheduled_count: number | null;
  course_id: number;
  course_code: string;
  course_name: string;
}

interface UiSession {
  id: number;
  title: string;
  instructor: string;
  subject: string;
  date: string;
  time: string;
  status: 'live' | 'rescheduled' | string;
  action: 'Join Now' | 'Calendar' | string;
  note?: string;
}

const UpcomingSessions: React.FC = () => {
  const api = useApi();
  const { user, token } = useAuth();
  const [sessions, setSessions] = useState<UiSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = useMemo(() => {
    // Prefer env if set; otherwise expect caller to configure
    return (import.meta as any).env?.VITE_SCHEDULE_BASE_URL || '<<base_url>>';
  }, []);

  const getNameFromToken = (t?: string | null): string | null => {
    if (!t) return null;
    try {
      const parts = t.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const decoded = JSON.parse(decodeURIComponent(escape(atob(payload))));
      return (
        decoded.name ||
        decoded.username ||
        decoded.preferred_username ||
        decoded.email ||
        null
      );
    } catch {
      return null;
    }
  };

  const displayName = useMemo(() => {
    return user?.name || getNameFromToken(token) || '';
  }, [user, token]);

  useEffect(() => {
    let isMounted = true;
    async function fetchSessions() {
      if (!user || !user.id || !token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        // Derive faculty id: prefer context user.id, else decode from token claims
        const getFacultyIdFromToken = (t?: string | null): string | null => {
          if (!t) return null;
          try {
            const parts = t.split('.');
            if (parts.length < 2) return null;
            const payload = parts[1]
              .replace(/-/g, '+')
              .replace(/_/g, '/');
            const decoded = JSON.parse(decodeURIComponent(escape(atob(payload))));
            return (
              decoded.faculty_id ||
              decoded.facultyId ||
              decoded.userId ||
              decoded.sub ||
              decoded.id ||
              null
            );
          } catch {
            return null;
          }
        };

        const facultyId = user?.id || getFacultyIdFromToken(token);
        if (!facultyId) {
          throw new Error('Missing faculty id');
        }

        const url = await api.lms.mentors.getAllSessions(facultyId);

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        
        const json = await api.lms.mentors.getAllSessions(facultyId);
        const data: ApiSession[] = json?.data ?? [];

        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const filtered = data.filter((s) => {
          const dt = new Date(s.session_datetime);
          const sessionDate = new Date(dt);
          sessionDate.setHours(0, 0, 0, 0);
          
          // For live: is_live must be true AND session_datetime must be today
          const isLive = !!s.is_live && sessionDate.getTime() === today.getTime();
          
          // For rescheduled: status must be "postponed" AND session_datetime must be greater than now
          const apiStatus = (s.status || '').toLowerCase();
          const isRescheduled = apiStatus === 'postponed' && dt > now;
          
          return isLive || isRescheduled;
        });

        const mapped: UiSession[] = filtered.map((s) => {
          const dt = new Date(s.session_datetime);
          const todayForDisplay = new Date();
          const isToday = dt.toDateString() === todayForDisplay.toDateString();
          const tomorrow = new Date(todayForDisplay);
          tomorrow.setDate(todayForDisplay.getDate() + 1);
          const isTomorrow = dt.toDateString() === tomorrow.toDateString();
          const date = isToday
            ? 'Today'
            : (isTomorrow
              ? 'Tomorrow'
              : dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
          const time = dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

          // Determine status: only 'live' or 'rescheduled'
          const sessionDate = new Date(dt);
          sessionDate.setHours(0, 0, 0, 0);
          const apiStatus = (s.status || '').toLowerCase();
          
          let displayStatus: string;
          // For live: is_live must be true AND session_datetime must be today
          if (!!s.is_live && sessionDate.getTime() === today.getTime()) {
            displayStatus = 'live';
          } 
          // For rescheduled: status must be "postponed" AND session_datetime must be greater than now
          else if (apiStatus === 'postponed' && dt > now) {
            displayStatus = 'rescheduled';
          } else {
            // Should not reach here due to filter, but fallback
            displayStatus = 'rescheduled';
          }

          return {
            id: s.id,
            title: s.course_name,
            instructor: '', // API does not include instructor name; leave blank or map if available
            subject: s.course_name,
            date,
            time,
            status: displayStatus,
            action: displayStatus === 'live' ? 'Join Now' : 'Calendar',
            note: displayStatus === 'rescheduled' ? 'Rescheduled' : undefined,
          };
        });

        if (isMounted) {
          setSessions(mapped);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message || 'Failed to fetch sessions');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSessions();
    return () => {
      isMounted = false;
    };
  }, [BASE_URL, token, user]);

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

  const formatStatusDisplay = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'rescheduled') {
      return 'RESCHEDULED';
    }
    if (statusLower === 'live') {
      return 'LIVE';
    }
    return status.toUpperCase();
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
        {loading && (
          <div className="text-gray-400">Loading sessions...</div>
        )}
        {error && (
          <div className="text-red-400">{error}</div>
        )}
        {!loading && !error && (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-white">{session.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(session.status)}`}>
                        {formatStatusDisplay(session.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{session.instructor || displayName || '—'}</span>
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
            {sessions.length === 0 && (
              <div className="text-gray-400">No sessions found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingSessions;