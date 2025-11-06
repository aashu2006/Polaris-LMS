// src/components/mentorComponents/UpcomingSessions.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../services/api';
import LiveClassRoom from './LiveClassRoom';
import type { ApiSession, UiSession } from '../../types/sessions';

const UpcomingSessions: React.FC = () => {
  const api = useApi();
  const { user, token } = useAuth();

  const [sessions, setSessions] = useState<UiSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [liveOpen, setLiveOpen] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [startingSession, setStartingSession] = useState<boolean>(false);
  const [sessionMap, setSessionMap] = useState<Map<number, ApiSession>>(new Map());

  const BASE_URL = useMemo(() => {
    return (import.meta as any).env?.VITE_SCHEDULE_BASE_URL || '<<base_url>>';
  }, []);

  const getNameFromToken = (t?: string | null): string | null => {
    if (!t) return null;
    try {
      const parts = t.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(decodeURIComponent(escape(atob(payload))));
      return decoded.name || decoded.username || decoded.preferred_username || decoded.email || null;
    } catch {
      return null;
    }
  };

  const displayName = useMemo(() => user?.name || getNameFromToken(token) || '', [user, token]);

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

        const getFacultyIdFromToken = (t?: string | null): string | null => {
          if (!t) return null;
          try {
            const parts = t.split('.');
            if (parts.length < 2) return null;
            const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
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

        const json = await api.lms.mentors.getAllSessions(facultyId);
        const data: ApiSession[] = json?.data ?? [];

        const now = new Date();

        const filtered = data.filter((s) => {
          const dt = new Date(s.session_datetime);
          const durationMinutes = Number(s.duration) || 0;
          const end = new Date(dt.getTime() + durationMinutes * 60000);

          const isLive = !!s.is_live && now >= dt && now <= end;

          const apiStatus = (s.status || '').toLowerCase();
          const isRescheduled = apiStatus === 'postponed' && dt > now;

          return isLive || isRescheduled;
        });

        const sessionMapLocal = new Map<number, ApiSession>();
        const mapped: UiSession[] = filtered.map((s) => {
          // Store original session data for later use
          sessionMapLocal.set(s.id, s);

          const dt = new Date(s.session_datetime);
          const today = new Date();
          const isToday = dt.toDateString() === today.toDateString();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const isTomorrow = dt.toDateString() === tomorrow.toDateString();

          const date = isToday
            ? 'Today'
            : (isTomorrow ? 'Tomorrow' : dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
          const time = dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

          const durationMinutes = Number(s.duration) || 0;
          const end = new Date(dt.getTime() + durationMinutes * 60000);
          const nowInner = new Date();

          if (!!s.is_live && nowInner >= dt && nowInner <= end) {
            return {
              id: s.id,
              title: s.course_name || `Session ${s.id}`,
              instructor: '', // can map if API provides instructor later
              subject: s.course_name || '',
              date,
              time,
              status: 'live',
              action: 'Join Now',
            };
          }

          const apiStatus = (s.status || '').toLowerCase();
          if (apiStatus === 'postponed' && dt > nowInner) {
            return {
              id: s.id,
              title: s.course_name || `Session ${s.id}`,
              instructor: '',
              subject: s.course_name || '',
              date,
              time,
              status: 'rescheduled',
              action: 'Calendar',
              note: 'Rescheduled',
            };
          }

          return {
            id: s.id,
            title: s.course_name || `Session ${s.id}`,
            instructor: '',
            subject: s.course_name || '',
            date,
            time,
            status: 'rescheduled',
            action: 'Calendar',
            note: 'Rescheduled',
          };
        });

        if (isMounted) {
          setSessions(mapped);
          setSessionMap(sessionMapLocal);
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to fetch sessions');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSessions();
    return () => {
      isMounted = false;
    };
  }, [BASE_URL, token, user, api]);

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
    if (statusLower === 'rescheduled') return 'RESCHEDULED';
    if (statusLower === 'live') return 'LIVE';
    return status.toUpperCase();
  };

  // open modal with session passed as prop and start the session
  const openLive = async (session: UiSession) => {
    console.log('🚀 Opening live session:', session);
    setStartingSession(true);
    setError(null);

    try {
      const getFacultyIdFromToken = (t?: string | null): string | null => {
        if (!t) return null;
        try {
          const parts = t.split('.');
          if (parts.length < 2) return null;
          const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
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
      console.log('👤 Faculty ID:', facultyId);
      if (!facultyId) {
        throw new Error('Missing faculty id');
      }

      const originalSession = sessionMap.get(session.id);
      console.log('📋 Original session:', originalSession);
      if (!originalSession) {
        throw new Error('Session data not found');
      }

      // Start the session via API
      console.log('📡 Calling startSession API with:', { sessionId: session.id, facultyId });
      const response = await api.multimedia.sessions.startSession(session.id, facultyId);
      console.log('✅ API Response:', response);
      
      // Handle different response structures
      let authToken = null;
      let responseData = null;

      if (response?.success && response?.data) {
        responseData = response.data;
        authToken = responseData.hms?.authToken || responseData.authToken || responseData.token;
      } else if (response?.data) {
        // Response might have data directly
        responseData = response.data;
        authToken = responseData.hms?.authToken || responseData.authToken || responseData.token;
      } else if (response?.hms?.authToken) {
        // Response might have hms directly
        authToken = response.hms.authToken;
        responseData = response;
      } else if (response?.authToken) {
        // Response might have authToken directly
        authToken = response.authToken;
        responseData = response;
      }

      console.log('🔑 Extracted auth token:', authToken ? 'Found' : 'Not found');

      if (!authToken) {
        console.error('❌ No auth token found in response:', response);
        throw new Error('No auth token received from server. Please check API response.');
      }

      setSessionData({
        sessionId: session.id,
        facultyId: facultyId,
        batchName: session.title,
        courseName: session.subject,
        hms: {
          authToken: authToken,
        },
      });
      console.log('✅ Session data set, opening modal');
      setLiveOpen(true);
    } catch (e: any) {
      console.error('❌ Error starting session:', e);
      const errorMessage = e?.response?.data?.message || e?.message || 'Failed to start session. Please try again.';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`); // Temporary alert for debugging
    } finally {
      setStartingSession(false);
    }
  };

  const closeLive = () => {
    setSessionData(null);
    setLiveOpen(false);
  };

  return (
    <>
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
          {loading && <div className="text-gray-400">Loading sessions...</div>}
          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <div className="text-red-400 font-semibold mb-1">Error</div>
              <div className="text-red-300 text-sm">{error}</div>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-400 hover:text-red-300 text-xs underline"
              >
                Dismiss
              </button>
            </div>
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
                            <div className="w-2 h-2 bg-gray-400 rounded" />
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

                      {session.note && <div className="text-xs text-[#FFC540] mb-2">{session.note}</div>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🔘 Button clicked for session:', session);
                          if (session.action === 'Join Now') {
                            openLive(session);
                          }
                        }}
                        disabled={startingSession}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${getActionColor(session.action)} ${startingSession ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {session.action === 'Join Now' && <Video className="h-4 w-4" />}
                        {session.action === 'Calendar' && <Calendar className="h-4 w-4" />}
                        <span>{startingSession ? 'Starting...' : session.action}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {sessions.length === 0 && <div className="text-gray-400">No sessions found.</div>}
            </div>
          )}
        </div>
      </div>

      {startingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-[#FFC540] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white font-semibold">Starting session...</p>
              <p className="text-gray-400 text-sm">Please wait</p>
            </div>
          </div>
        </div>
      )}

      {liveOpen && sessionData && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <HMSRoomProvider>
            <LiveClassRoom sessionData={sessionData} onClose={closeLive} />
          </HMSRoomProvider>
        </div>
      )}
    </>
  );
};

export default UpcomingSessions;
