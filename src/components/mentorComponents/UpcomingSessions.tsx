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
  const [batches, setBatches] = useState<Record<number, any>>({});
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

        const [batchesResp, sessionsResp] = await Promise.all([
          api.lms.mentors.getBatches().catch(() => ({ batches: [] })),
          api.lms.mentors.getAllSessions(facultyId),
        ]);

        // Console log the sessions API response
        console.log('📡 GET Sessions API Response:', {
          full_response: sessionsResp,
          sessions_count: sessionsResp?.data?.length || 0,
          first_session_sample: sessionsResp?.data?.[0] || null,
          has_batch_id: sessionsResp?.data?.[0]?.batch_id !== undefined,
        });

        const batchMap: Record<number, any> = {};
        const batchesList = batchesResp?.batches || batchesResp || [];
        if (Array.isArray(batchesList)) {
          batchesList.forEach((batch: any) => {
            const id = Number(batch?.id);
            if (Number.isFinite(id)) {
              batchMap[id] = batch;
            }
          });
        }

        const data: ApiSession[] = sessionsResp?.data ?? [];

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
          const sessionId = Number(s.id);
          if (Number.isFinite(sessionId)) {
            sessionMapLocal.set(sessionId, s);
          }

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
              id: sessionId,
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
              id: sessionId,
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
            id: sessionId,
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
          setBatches(batchMap);
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
      if (!facultyId) {
        throw new Error('Missing faculty id');
      }

      const originalSession = sessionMap.get(session.id);
      if (!originalSession) {
        throw new Error('Session data not found');
      }

      console.log('📋 Session data (for batchId debug):', {
        id: originalSession?.id,
        batch_id: originalSession?.batch_id,
        section_id: originalSession?.section_id,
        course_id: originalSession?.course_id,
        course_sections: originalSession?.course_sections,
      });

      const batchName = (originalSession as any)?.batch_name || (originalSession as any)?.cohort;

      let batchId: number | undefined;

      // Priority 1: Direct batch_id from API response
      if (Number.isFinite(originalSession?.batch_id) && (originalSession?.batch_id ?? 0) > 0) {
        batchId = Number(originalSession.batch_id);
        console.log('✅ Using batch_id directly from API response:', batchId);
      }
      
      // Priority 2: Match by batch_name with fetched batches
      if ((!Number.isFinite(batchId) || (batchId ?? 0) <= 0) && batchName && Object.keys(batches).length > 0) {
        const matched = Object.entries(batches).find(([_, batch]) => {
          const name = (batch as any)?.batch_name || (batch as any)?.name;
          return typeof name === 'string' && name.trim().toLowerCase() === String(batchName).trim().toLowerCase();
        });
        if (matched) {
          batchId = Number(matched[0]);
          console.log('✅ Using batch_id from batch name match:', batchId);
        }
      }

      // Priority 3: Error if no batch_id found
      if (!Number.isFinite(batchId) || (batchId ?? 0) <= 0) {
        console.error('❌ BatchId extraction failed:', {
          batch_id: originalSession?.batch_id,
          batch_name: batchName,
          batches_available: Object.keys(batches).length,
        });
        throw new Error('Missing batch/section ID - API must provide batch_id in session response');
      }

      const facultyName = displayName || user?.name || originalSession?.faculty_name || 'Faculty';

      const response = await api.multimedia.sessions.startSession(session.id, facultyId, Number(batchId), facultyName);
      
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

      if (!authToken) {
        throw new Error('No auth token received from server. Please check API response.');
      }

      setSessionData({
        sessionId: session.id,
        facultyId: facultyId,
        batchId,
        facultyName,
        batchName: session.title,
        courseName: session.subject,
        hms: {
          authToken: authToken,
        },
      });
      setLiveOpen(true);
    } catch (e: any) {
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
