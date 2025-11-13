import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useHMSActions,
  useHMSStore,
  selectPeers,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
} from '@100mslive/react-sdk';
import {
  GraduationCap,
  Mic,
  MicOff,
  Pin,
  ScreenShare,
  Users,
  Video,
  VideoOff,
} from 'lucide-react';
import '../mentorComponents/LiveClassRoom.css';

interface StoredSessionData {
  sessionId: number;
  facultyName?: string;
  courseName?: string;
  batchName?: string;
  hms?: {
    authToken?: string;
  };
  [key: string]: any;
}

const StudentLiveRoom: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const hmsActions = useHMSActions();

  const peers = useHMSStore(selectPeers);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);

  const [isJoining, setIsJoining] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<StoredSessionData | null>(null);
  const [hasAttemptedJoin, setHasAttemptedJoin] = useState(false);
  const [pinnedPeerId, setPinnedPeerId] = useState<string | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);

  const sessionToken = useMemo(() => {
    return localStorage.getItem('live_class_token');
  }, []);

  const visiblePeers = useMemo(
    () => peers.filter((peer) => !peer.isAuxiliary),
    [peers]
  );

  const remotePeers = useMemo(
    () => visiblePeers.filter((peer) => !peer.isLocal),
    [visiblePeers]
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem('liveSessionData');
      if (stored) {
        const parsed: StoredSessionData = JSON.parse(stored);
        if (!sessionId || Number(sessionId) === Number(parsed.sessionId)) {
          setSessionData(parsed);
        }
      } else {
        setError('Session data not found. Please return to dashboard.');
      }
    } catch (err) {
      console.error('Failed to parse live session data:', err);
      setError('Failed to load session data. Please return to dashboard.');
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionData) {
      return;
    }

    if (!pinnedPeerId && visiblePeers.length > 0) {
      const tutorPeer = remotePeers.find((peer) => peer.roleName?.toLowerCase() === 'tutor' && peer.videoTrack);
      const peerWithVideo =
        tutorPeer ||
        remotePeers.find((peer) => peer.videoTrack) ||
        visiblePeers.find((peer) => peer.videoTrack);
      if (peerWithVideo) {
        setPinnedPeerId(peerWithVideo.id);
      } else {
        setPinnedPeerId((remotePeers[0] || visiblePeers[0])?.id ?? null);
      }
    }

    const token =
      sessionData?.hms?.token ||
      sessionData?.hms?.authToken ||
      sessionToken ||
      sessionData?.token;

    if (!token) {
      setError('Live session token missing or expired.');
      setIsJoining(false);
      return;
    }

    if (!hasAttemptedJoin) {
      setHasAttemptedJoin(true);
      joinRoom(token);
    }
  }, [sessionData, sessionToken, hasAttemptedJoin]);

  useEffect(() => {
    return () => {
      hmsActions.leave().catch((err) => {
        console.error('Student cleanup leave failed:', err);
      });
    };
  }, [hmsActions]);

  const joinRoom = async (authToken: string) => {
    try {
      setIsJoining(true);
      await hmsActions.join({
        authToken,
        userName: sessionData?.studentName || sessionData?.student || 'Student',
        settings: {
          isAudioMuted: true,
          isVideoMuted: true,
        },
      });
      setIsJoining(false);
    } catch (err: any) {
      console.error('Failed to join student room:', err);
      setError(err?.message || 'Failed to join live class. Please try again.');
      setIsJoining(false);
      setHasAttemptedJoin(false);
    }
  };

  const handleLeave = async () => {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      await hmsActions.leave();
    } catch (err) {
      console.error('Failed to leave room:', err);
    } finally {
      setIsLeaving(false);
      navigate('/student/dashboard');
    }
  };

  if (error) {
    return (
      <div className="live-class-error student-live">
        <div className="error-card">
          <h2>Unable to join live class</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="btn btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isJoining || !sessionData) {
    return (
      <div className="live-class-loading student-live">
        <div className="loading-spinner" />
        <p>Joining live class...</p>
      </div>
    );
  }

  const facultyLabel = sessionData?.facultyName || 'Instructor';
  const title = sessionData?.courseName || sessionData?.batchName || 'Live Class';

  return (
    <div className="live-class-room student-live">
      <div className="room-header">
        <div className="room-info">
          <h2>{title}</h2>
          <span className="live-badge">● LIVE</span>
        </div>
        <div className="room-stats">
          <span>Faculty: {facultyLabel}</span>
        </div>
      </div>

      <div className="video-container">
        {remotePeers.length === 0 && !visiblePeers.some((peer) => peer.auxiliaryTracks?.length) ? (
          <div className="no-peers">
            <p>Waiting for class to begin...</p>
            <p className="small">
              If this persists, please verify the mentor has started the session.
            </p>
          </div>
        ) : (
          <>
            {visiblePeers
              .filter((peer) => peer.auxiliaryTracks && peer.auxiliaryTracks.length > 0)
              .map((peer) => (
                <div key={`${peer.id}-screen`} className="screen-share-main">
                  <video
                    autoPlay
                    playsInline
                    muted
                    ref={(node) => {
                      if (!node) return;
                      const screenTrack = peer.auxiliaryTracks?.[0];
                      if (screenTrack) {
                        try {
                          hmsActions.attachVideo(screenTrack, node);
                        } catch (err) {
                          console.error('Failed to attach screen share track:', err);
                        }
                      } else {
                        node.srcObject = null;
                      }
                    }}
                  />
                  <div className="screen-share-label icon-text">
                    <ScreenShare size={18} />
                    <span>{peer.name} is sharing their screen</span>
                  </div>
                </div>
              ))}

            <div className="video-grid">
              {visiblePeers.map((peer) => {
                const isLocal = peer.isLocal;
                const isPinned = pinnedPeerId === peer.id;

                const attachTrack = (node: HTMLVideoElement | null, trackId: string | undefined) => {
                  if (!node) return;
                  if (trackId) {
                    try {
                      hmsActions.attachVideo(trackId, node);
                    } catch (err) {
                      console.error('Failed to attach track:', err);
                    }
                  } else {
                    node.srcObject = null;
                  }
                };

                return (
                  <div
                    key={peer.id}
                    className={`video-tile ${isPinned ? 'pinned' : ''}`}
                    onClick={() => setPinnedPeerId(isPinned ? null : peer.id)}
                    title={isPinned ? 'Unpin' : 'Pin to focus'}
                  >
                    <video
                      autoPlay
                      playsInline
                      muted={isLocal}
                      ref={(node) => attachTrack(node, peer.videoTrack)}
                      className="peer-video"
                    />

                    {/* Fallback when mentor camera is off */}
                    {!peer.videoTrack && (
                      <div className="no-video-fallback">
                        <span>{peer.name?.charAt(0)?.toUpperCase() || 'P'}</span>
                      </div>
                    )}

                    <div className="peer-info">
                      <span className="peer-name">
                        {peer.name}
                        {peer.roleName === 'tutor' && (
                          <GraduationCap size={16} className="icon-inline" />
                        )}
                        {peer.roleName === 'student' && peer.isLocal && ' (You)'}
                        {isPinned && <Pin size={16} className="icon-inline" />}
                      </span>
                      <div className="track-debug">
                        <span className="icon-label">
                          {peer.audioTrack ? <Mic size={14} /> : <MicOff size={14} />}
                          <span>{peer.audioTrack ? 'On' : 'Muted'}</span>
                        </span>
                        <span className="icon-label">
                          {peer.videoTrack ? <Video size={14} /> : <VideoOff size={14} />}
                          <span>{peer.videoTrack ? 'On' : 'Off'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="room-controls">
        <button
          className={`control-btn ${isLocalAudioEnabled ? 'active' : 'disabled'}`}
          onClick={() => hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled)}
          title={isLocalAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isLocalAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button
          className={`control-btn ${isLocalVideoEnabled ? 'active' : 'disabled'}`}
          onClick={() => hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled)}
          title={isLocalVideoEnabled ? 'Turn camera off' : 'Turn camera on'}
        >
          {isLocalVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
        </button>
        <button
          className={`control-btn participants-btn ${showParticipants ? 'active' : ''}`}
          onClick={() => setShowParticipants((prev) => !prev)}
          title="Toggle participants list"
        >
          <Users size={24} />
        </button>
        <button
          className="control-btn leave-btn"
          onClick={handleLeave}
          disabled={isLeaving}
        >
          {isLeaving ? 'Leaving...' : 'Leave Class'}
        </button>
      </div>

      <div className="room-footer">
        <p className="recording-notice">
          🔒 Session attendance is being recorded. Please stay connected until the class ends.
        </p>
      </div>

      {showParticipants && (
        <>
          <div className="participants-overlay" onClick={() => setShowParticipants(false)} />
          <aside className="participants-sidebar">
            <div className="participants-header">
              <span>Participants ({visiblePeers.length})</span>
              <button className="close-btn" onClick={() => setShowParticipants(false)}>
                ✕
              </button>
            </div>
            <ul className="participants-list">
              {visiblePeers.map((peer) => (
                <li key={`participant-${peer.id}`}>
                  <span className="participant-name">
                    {peer.name}
                    {peer.roleName === 'tutor' && (
                      <GraduationCap size={16} className="icon-inline" />
                    )}
                    {peer.isLocal && ' (You)'}
                  </span>
                  <span className="participant-status">
                    <span className="icon-label">
                      {peer.audioTrack ? <Mic size={14} /> : <MicOff size={14} />}
                      <span>{peer.audioTrack ? 'On' : 'Muted'}</span>
                    </span>
                    <span className="icon-label">
                      {peer.videoTrack ? <Video size={14} /> : <VideoOff size={14} />}
                      <span>{peer.videoTrack ? 'On' : 'Off'}</span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </>
      )}
    </div>
  );
};

export default StudentLiveRoom;

