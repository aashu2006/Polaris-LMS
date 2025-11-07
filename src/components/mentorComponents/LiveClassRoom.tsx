import { useEffect, useState, useRef } from 'react'
import {
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
  selectPeers,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
} from '@100mslive/react-sdk'
import { useApi } from '../../services/api'
import './LiveClassRoom.css'

interface LiveClassRoomProps {
  sessionData: {
    sessionId: number
    facultyId: string
    batchName?: string
    courseName?: string
    hms: {
      authToken: string
    }
  }
  onClose: () => void
}

const LiveClassRoom: React.FC<LiveClassRoomProps> = ({ sessionData, onClose }) => {
  const hmsActions = useHMSActions()
  const api = useApi()

  const isConnected = useHMSStore(selectIsConnectedToRoom)
  const peers = useHMSStore(selectPeers)
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled)
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled)

  const [isJoining, setIsJoining] = useState(true)
  const [error, setError] = useState('')
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [connectionEstablished, setConnectionEstablished] = useState(false)
  
  const joinAttemptedRef = useRef(false)
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fallbackCheckRef = useRef<NodeJS.Timeout | null>(null)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isConnectedRef = useRef(false)
  const uiFallbackRef = useRef<NodeJS.Timeout | null>(null)

  // Monitor connection state and hide loading when connected
  useEffect(() => {
    isConnectedRef.current = isConnected || false
    
    const actuallyConnected = isConnected || connectionEstablished || peers.length > 0
    
    if (actuallyConnected && isJoining) {
      console.log('✅ Successfully connected to room', {
        isConnected,
        connectionEstablished,
        peersCount: peers.length,
        peerNames: peers.map(p => p.name)
      })
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
        connectionTimeoutRef.current = null
      }
      if (fallbackCheckRef.current) {
        clearTimeout(fallbackCheckRef.current)
        fallbackCheckRef.current = null
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
        checkIntervalRef.current = null
      }
      setIsJoining(false)
    }
  }, [isConnected, isJoining, connectionEstablished, peers.length, peers])
  
  useEffect(() => {
    if (peers.length > 0 && isJoining && !connectionEstablished) {
      console.log('🔍 Detected peers but connection not marked - setting connectionEstablished', {
        peersCount: peers.length
      })
      setConnectionEstablished(true)
    }
  }, [peers.length, isJoining, connectionEstablished])

  // Join room when session data is available
  useEffect(() => {
    if (sessionData?.hms?.authToken && !joinAttemptedRef.current) {
      joinAttemptedRef.current = true
      joinRoom(sessionData.hms.authToken)
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
      }
      if (fallbackCheckRef.current) {
        clearTimeout(fallbackCheckRef.current)
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      if (isConnected || connectionEstablished) {
        hmsActions.leave().catch(console.error)
      }
    }
  }, [sessionData?.hms?.authToken])

  const joinRoom = async (authToken: string) => {
    try {
      console.log('🚀 Attempting to join room...')
      
      let checkCount = 0
      const maxChecks = 5
      checkIntervalRef.current = setInterval(() => {
        checkCount++
        console.log(`🔍 Connection check ${checkCount}/${maxChecks}...`, {
          isConnected,
          peersCount: peers.length,
          connectionEstablished
        })
        
        if (checkCount >= maxChecks) {
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current)
            checkIntervalRef.current = null
          }
          if (fallbackCheckRef.current) {
            clearTimeout(fallbackCheckRef.current)
            fallbackCheckRef.current = null
          }
        }
      }, 2000)
      
      fallbackCheckRef.current = setTimeout(() => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current)
          checkIntervalRef.current = null
        }
        fallbackCheckRef.current = null
      }, 10000)
      
      connectionTimeoutRef.current = setTimeout(() => {
        if (!isConnectedRef.current && !isConnected && !connectionEstablished && peers.length === 0) {
          console.error('❌ Connection timeout - failed to connect within 30 seconds')
          setError('Connection timeout. Please try again or check your network connection.')
          setIsJoining(false)
          joinAttemptedRef.current = false
          hmsActions.leave().catch(console.error)
        }
      }, 30000)

      await hmsActions.join({
        authToken: authToken,
        userName: sessionData?.batchName || 'Tutor'
      })
      
      console.log('📡 Join request sent, waiting for connection...')

      if (uiFallbackRef.current) {
        clearTimeout(uiFallbackRef.current)
      }
      uiFallbackRef.current = setTimeout(() => {
        if (isJoining) {
          console.warn('⏳ UI fallback triggered after 12s; revealing UI while connection finalizes.')
          setIsJoining(false)
        }
      }, 12000)
    } catch (err: any) {
      console.error('❌ Error joining room:', err)
      
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
        connectionTimeoutRef.current = null
      }
      if (fallbackCheckRef.current) {
        clearTimeout(fallbackCheckRef.current)
        fallbackCheckRef.current = null
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
        checkIntervalRef.current = null
      }
      
      setError(err.message || 'Failed to join room. Please try again.')
      setIsJoining(false)
    }
  }

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const results = await Promise.allSettled([
          // @ts-ignore
          navigator.permissions?.query?.({ name: 'camera' as any }),
          // @ts-ignore
          navigator.permissions?.query?.({ name: 'microphone' as any })
        ])
        const states = results
          .map((r: any) => (r?.status === 'fulfilled' ? r.value?.state : undefined))
          .filter(Boolean)
        if (states.includes('denied')) {
          setError('Camera/Microphone permission denied. Please allow permissions and retry.')
          setIsJoining(false)
        }
      } catch (_) {
        // best-effort only
      }
    }
    checkPermissions()
  }, [])

  const toggleAudio = async () => {
    await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled)
  }

  const toggleVideo = async () => {
    await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled)
  }

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await hmsActions.setScreenShareEnabled(false)
        setIsScreenSharing(false)
      } else {
        await hmsActions.setScreenShareEnabled(true)
        setIsScreenSharing(true)
      }
    } catch (err: any) {
      const message: string = String(err?.message || err)
      const name: string = String(err?.name || '')

      const isUserCancel =
        name === 'NotAllowedError' ||
        name === 'AbortError' ||
        /denied|permission|cancel/i.test(message)

      if (isUserCancel) {
        console.warn('Screen share was cancelled/denied by the user.')
        setIsScreenSharing(false)
        return
      }

      console.error('Error toggling screen share:', err)
      setError('Failed to toggle screen sharing')
    }
  }

  const leaveRoom = async () => {
    if (isLeaving) return
    
    setIsLeaving(true)
    
    try {
      console.log('🛑 Ending session via API...')
      await api.multimedia.sessions.endSession(sessionData.sessionId, sessionData.facultyId)
      console.log('✅ Session ended successfully via API')
    } catch (err: any) {
      console.error('❌ Error ending session:', err.response?.data?.message || err.message)
    }
    
    await hmsActions.leave()
    onClose()
  }

  if (error) {
    return (
      <div className="live-class-error">
        <div className="error-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    )
  }

  if (isJoining) {
    return (
      <div className="live-class-loading">
        <div className="loading-spinner"></div>
        <p>Joining live class...</p>
      </div>
    )
  }

  return (
    <div className="live-class-room">
      <div className="room-header">
        <div className="room-info">
          <h2>{sessionData?.batchName || sessionData?.courseName || 'Live Class'}</h2>
          <span className="live-badge">● LIVE</span>
        </div>
        <div className="room-stats">
          <span className="peer-count">👥 {peers.length} participants</span>
        </div>
      </div>

      <div className="video-container">
        {peers.length === 0 ? (
          <div className="no-peers">
            <p>Waiting for students to join...</p>
          </div>
        ) : (
          <div className="video-grid">
            {peers.map((peer) => (
              <div key={peer.id} className="video-tile">
                <video
                  autoPlay
                  muted={peer.isLocal}
                  playsInline
                  ref={(node) => {
                    if (node && peer.videoTrack) {
                      hmsActions.attachVideo(peer.videoTrack, node)
                    }
                  }}
                  className="peer-video"
                />
                <div className="peer-info">
                  <span className="peer-name">{peer.name}</span>
                  {!peer.audioTrack && (
                    <span className="muted-indicator">🔇</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="room-controls">
        <button
          onClick={toggleAudio}
          className={`control-btn ${!isLocalAudioEnabled ? 'disabled' : ''}`}
        >
          {isLocalAudioEnabled ? '🎤' : '🔇'}
        </button>

        <button
          onClick={toggleVideo}
          className={`control-btn ${!isLocalVideoEnabled ? 'disabled' : ''}`}
        >
          {isLocalVideoEnabled ? '📹' : '🚫'}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`control-btn ${isScreenSharing ? 'active' : ''}`}
        >
          {isScreenSharing ? '🖥️' : '📺'}
        </button>

        <button 
          onClick={leaveRoom} 
          className="control-btn leave-btn"
          disabled={isLeaving}
        >
          {isLeaving ? '🛑 Ending...' : '📞 End Session'}
        </button>
      </div>

      <div className="room-footer">
        <p className="recording-notice">
          ⏺ This session is being recorded
        </p>
      </div>
    </div>
  )
}

export default LiveClassRoom

