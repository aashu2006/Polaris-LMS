// src/components/mentorComponents/UpcomingSessions.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../services/api';
import LiveClassRoom from './LiveClassRoom';
import type { UiSession } from '../../types/sessions';
import type { ClassSessionWithDetails } from '../../lib/supabase';
import { TutorSessionService } from '../../services/tutorSessionService';

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
  const [sessionMap, setSessionMap] = useState<Map<number, ClassSessionWithDetails>>(new Map());

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

        const sessionsData = await TutorSessionService.getSessionsForFaculty(String(facultyId));

        const now = new Date();
        const pastLimit = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
        const futureLimit = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const withinWindow = sessionsData.filter((session) => {
          const dt = session.session_datetime ? new Date(session.session_datetime) : null;
          if (!dt) return false;
          return dt >= pastLimit && dt <= futureLimit;
        });

        const relevantSessions = withinWindow.filter((session) => {
          const dt = session.session_datetime ? new Date(session.session_datetime) : null;
          if (!dt) return false;

          const durationMinutes =
            Number(session.duration) && Number(session.duration) > 0 ? Number(session.duration) : 60;
          const end = new Date(dt.getTime() + durationMinutes * 60000);

          const status = (session.status || '').toLowerCase();
          if (now > end) {
            return false;
          }

          if (['cancelled'].includes(status)) {
            return false;
          }

          if (status === 'postponed') {
            return true;
          }

          if (now <= dt) {
            return true;
          }

          return now >= dt && now <= end;
        });

        const sessionMapLocal = new Map<number, ClassSessionWithDetails>();
        const mapped: UiSession[] = relevantSessions.map((session) => {
          const sessionId = Number(session.id);
          if (Number.isFinite(sessionId)) {
            sessionMapLocal.set(sessionId, session);
          }

          const dt = new Date(session.session_datetime);
          const today = new Date();
          const isToday = dt.toDateString() === today.toDateString();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const isTomorrow = dt.toDateString() === tomorrow.toDateString();

          const date = isToday
            ? 'Today'
            : (isTomorrow
              ? 'Tomorrow'
              : dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
          const time = dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

          const durationMinutes = Number(session.duration) && Number(session.duration) > 0 ? Number(session.duration) : 60;
          const end = new Date(dt.getTime() + durationMinutes * 60000);
          const nowInner = new Date();

          const apiStatus = (session.status || '').toLowerCase();
          const isCurrentlyLive = nowInner >= dt && nowInner <= end;

          if (nowInner > end) {
            return {
              id: sessionId,
              title: session.course_name || session.title || `Session ${session.id}`,
              instructor: session.faculty_name || '',
              subject: session.course_name || '',
              date,
              time,
              status: 'completed',
              action: 'Calendar',
            };
          }

          if (apiStatus === 'postponed') {
            return {
              id: sessionId,
              title: session.course_name || session.title || `Session ${session.id}`,
              instructor: session.faculty_name || '',
              subject: session.course_name || '',
              date,
              time,
              status: 'rescheduled',
              action: 'Calendar',
              note: 'Rescheduled',
            };
          }

          if (isCurrentlyLive) {
            return {
              id: sessionId,
              title: session.course_name || session.title || `Session ${session.id}`,
              instructor: session.faculty_name || '',
              subject: session.course_name || '',
              date,
              time,
              status: 'live',
              action: 'Join Now',
            };
          }

          if (dt > nowInner || apiStatus === 'upcoming' || apiStatus === 'scheduled' || apiStatus === 'created') {
            return {
              id: sessionId,
              title: session.course_name || session.title || `Session ${session.id}`,
              instructor: session.faculty_name || '',
              subject: session.course_name || '',
              date,
              time,
              status: 'upcoming',
              action: 'Go Live',
            };
          }

          return {
            id: sessionId,
            title: session.course_name || session.title || `Session ${session.id}`,
            instructor: session.faculty_name || '',
            subject: session.course_name || '',
            date,
            time,
            status: 'completed',
            action: 'Calendar',
          };
        });

        const upcomingOnly = mapped
          .filter((session) => session.status === 'upcoming' || session.status === 'live')
          .sort((a, b) => {
            const originalA = sessionMapLocal.get(a.id);
            const originalB = sessionMapLocal.get(b.id);
            const dtA = originalA?.session_datetime ? new Date(originalA.session_datetime).getTime() : 0;
            const dtB = originalB?.session_datetime ? new Date(originalB.session_datetime).getTime() : 0;
            return dtA - dtB;
          });

        const completedSessions = mapped
          .filter((session) => session.status === 'completed')
          .sort((a, b) => {
            const originalA = sessionMapLocal.get(a.id);
            const originalB = sessionMapLocal.get(b.id);
            const dtA = originalA?.session_datetime ? new Date(originalA.session_datetime).getTime() : 0;
            const dtB = originalB?.session_datetime ? new Date(originalB.session_datetime).getTime() : 0;
            return dtB - dtA;
          });

        const upcomingMap = new Map<number, ClassSessionWithDetails>();
        upcomingOnly.forEach((session) => {
          const original = sessionMapLocal.get(session.id);
          if (original) {
            upcomingMap.set(session.id, original);
          }
        });

        if (isMounted) {
          setSessions(upcomingOnly);
          setSessionMap(upcomingMap);
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
  }, [token, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-900 text-red-300';
      case 'upcoming':
        return 'bg-blue-900 text-blue-200';
      case 'rescheduled':
        return 'bg-[#FFC540] text-black';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getActionColor = (status: UiSession['status']) => {
    if (status === 'live') {
      return 'bg-[#FFC540] text-black hover:bg-[#e6b139]';
    }
    if (status === 'upcoming') {
      return 'bg-green-500 text-white hover:bg-green-600';
    }
    if (status === 'rescheduled') {
      return 'bg-[#FFC540] text-black hover:bg-[#e6b139]';
    }
    return 'bg-gray-700 text-white hover:bg-gray-600';
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

      const batchName =
        originalSession?.batch?.batch_name ||
        (originalSession as any)?.batch_name ||
        (originalSession as any)?.cohort ||
        session.title;

      let batchId: number | undefined;
      const sessionBatchId = (originalSession as any)?.batch_id;

      if (Number.isFinite(originalSession?.batch?.id)) {
        batchId = Number(originalSession?.batch?.id);
      }

      if ((!Number.isFinite(batchId) || (batchId ?? 0) <= 0) && Number.isFinite(originalSession?.section?.batch_id)) {
        batchId = Number(originalSession?.section?.batch_id);
      }

      if ((!Number.isFinite(batchId) || (batchId ?? 0) <= 0) && Number.isFinite(sessionBatchId)) {
        batchId = Number(sessionBatchId);
      }

      if (!Number.isFinite(batchId) || (batchId ?? 0) <= 0) {
        console.error('❌ BatchId extraction failed:', {
          session_batch_id: sessionBatchId,
          supabase_batch_id: originalSession?.batch?.id,
          section_batch_id: originalSession?.section?.batch_id,
          batch_name: batchName,
        });
        throw new Error('Missing batch/section ID - API must provide batch_id in session response');
      }

      const facultyName =
        displayName ||
        user?.name ||
        originalSession?.faculty_name ||
        originalSession?.profiles?.name ||
        'Faculty';

      const response = await api.multimedia.sessions.startSession(session.id, facultyId, Number(batchId), facultyName);

      const startSuccess =
        response?.success ??
        response?.data?.success ??
        (typeof response?.status === 'string' ? response.status.toLowerCase() === 'success' : undefined);

      if (startSuccess === false) {
        const serverMessage =
          response?.message ||
          response?.error ||
          response?.data?.message ||
          response?.data?.error ||
          'Failed to start session';
        throw new Error(serverMessage);
      }
      
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

      const detectedRoomId =
        responseData?.hms?.roomId ||
        responseData?.hms?.room_id ||
        responseData?.roomId ||
        responseData?.room_id ||
        response?.roomId ||
        response?.room_id;

      setSessionData({
        sessionId: session.id,
        facultyId: facultyId,
        batchId,
        facultyName,
        batchName,
        courseName: session.subject,
        hms: {
          authToken: authToken,
        },
        roomId: detectedRoomId,
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

  const closeLive = (options?: { sessionId?: number }) => {
    if (options?.sessionId !== undefined) {
      const endedId = options.sessionId;
      setSessions((prev) => prev.filter((session) => session.id !== endedId));
      setSessionMap((prev) => {
        const next = new Map(prev);
        next.delete(endedId);
        return next;
      });
    }
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
                          if (session.status === 'live' || session.status === 'upcoming') {
                            openLive(session);
                          }
                        }}
                        disabled={startingSession}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${getActionColor(session.status)} ${startingSession ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {session.status === 'live' && <Video className="h-4 w-4" />}
                        {session.status !== 'live' && <Video className="h-4 w-4" />}
                        <span>
                          {startingSession
                            ? 'Starting...'
                            : session.status === 'live'
                              ? 'Join Now'
                              : session.status === 'upcoming'
                                ? 'Go Live'
                                : 'Calendar'}
                        </span>
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
