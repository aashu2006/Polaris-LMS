// src/components/mentorComponents/LiveSession.tsx
import React, { useEffect } from "react";
import { MicOff, PhoneOff, MonitorUp, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UiSession } from "../../types/sessions";

interface LiveSessionProps {
  session?: UiSession;
  onClose?: () => void;
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "danger" | "ghost"; className?: string; }> = ({ variant = "primary", className = "", children, ...props }) => {
  const base = "inline-flex items-center justify-center rounded-full font-semibold transition";
  const variantClass =
    variant === "primary"
      ? "bg-[#FFC540] text-black hover:bg-[#e6b139]"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-gray-700 text-white hover:bg-gray-600";

  return (
    <button className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

const LiveSession: React.FC<LiveSessionProps> = ({ session, onClose }) => {
  useEffect(() => {
    console.log('[LiveSession] mounted', session);
    return () => console.log('[LiveSession] unmounted');
  }, [session]);

  // defensive: if session missing, show message and allow close
  if (!session) {
    return (
      <div className="flex flex-col h-full bg-[#111827] text-white">
        <header className="flex justify-between items-center px-6 py-3 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-semibold">Live Session</h1>
            <span className="bg-yellow-500 text-xs px-2 py-1 rounded-full font-semibold">NO DATA</span>
          </div>
          <div>
            <button onClick={onClose} className="bg-gray-700 px-3 py-1 rounded-md">Close</button>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center">
          <div className="text-center text-gray-300">
            <p className="mb-2">No session data provided.</p>
            <p className="text-sm">Close and try again.</p>
          </div>
        </main>
      </div>
    );
  }

  const isLive = session.status === 'live';
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) return onClose();
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-3 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold">{session.title}</h1>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${isLive ? 'bg-red-600' : 'bg-[#FFC540] text-black'}`}>
            {isLive ? 'LIVE' : 'NOT LIVE'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-300 mr-3">
            <div>{session.date}</div>
            <div>{session.time}</div>
          </div>
          <button onClick={handleClose} className="flex items-center space-x-1 bg-gray-700 px-3 py-1 rounded-md">
            <X size={14} />
            <span className="text-sm">Close</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col justify-center items-center text-gray-300 px-6">
        <Users size={48} className="text-gray-500 mb-3" />
        {!isLive ? (
          <div className="text-center">
            <p className="text-lg mb-2">This session isn't live right now.</p>
            <p className="text-sm text-gray-400">Scheduled: {session.date} • {session.time}</p>
          </div>
        ) : (
          <>
            <p className="text-lg">Waiting for students to join...</p>
            <p className="text-sm text-gray-400 mt-2">You can present, mute participants or end the session.</p>
          </>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="flex flex-col items-center pb-4">
        <div className="flex space-x-4 mb-2">
          <Button className="bg-red-600 hover:bg-red-700 rounded-full p-4" aria-label="mute">
            <MicOff />
          </Button>

          <Button className="bg-red-600 hover:bg-red-700 rounded-full p-4" aria-label="hangup">
            <PhoneOff />
          </Button>

          <Button className="bg-gray-700 hover:bg-gray-600 rounded-full p-4" aria-label="present">
            <MonitorUp />
          </Button>

          <Button variant="danger" className="rounded-full px-6 py-4 text-sm font-semibold">
            End Session
          </Button>
        </div>

        <p className="text-xs text-gray-400">● This session is being recorded</p>
      </footer>
    </div>
  );
};

export default LiveSession;
