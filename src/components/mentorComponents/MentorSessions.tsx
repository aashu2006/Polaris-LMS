import React, { useState } from 'react';
import { Video, Users, Clock, Play, Square, Settings, Mic, MicOff, Camera, CameraOff } from 'lucide-react';

const MentorSessions: React.FC = () => {
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      title: 'React Fundamentals - Components & Props',
      program: 'Full Stack Development',
      cohort: '2024-A',
      startTime: '2:00 PM',
      duration: '45 minutes elapsed',
      participants: 8,
      maxParticipants: 8,
      status: 'live',
      recording: true
    }
  ]);

  const [upcomingSessions] = useState([
    {
      id: 2,
      title: 'State Management with Redux',
      program: 'Full Stack Development',
      cohort: '2024-A',
      startTime: '4:00 PM',
      duration: '2 hours',
      participants: 8,
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'API Integration Workshop',
      program: 'Full Stack Development',
      cohort: '2024-B',
      startTime: '6:00 PM',
      duration: '1.5 hours',
      participants: 6,
      status: 'scheduled'
    }
  ]);

  const [sessionControls, setSessionControls] = useState({
    mic: true,
    camera: true,
    recording: true
  });

  const toggleControl = (control: keyof typeof sessionControls) => {
    setSessionControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
  };

  const startSession = (sessionId: number) => {
    // Logic to start a session
    console.log(`Starting session ${sessionId}`);
  };

  const endSession = (sessionId: number) => {
    // Logic to end a session
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Sessions</h1>
          <p className="text-gray-600 mt-1">Manage your active and upcoming live sessions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
            <Video className="h-4 w-4" />
            <span>Start Quick Session</span>
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              Active Sessions
            </h2>
          </div>
          
          <div className="p-6">
            {activeSessions.map((session) => (
              <div key={session.id} className="border-2 border-red-200 bg-red-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{session.title}</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Started at {session.startTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>{session.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{session.participants}/{session.maxParticipants} joined</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{session.program}</span> • {session.cohort}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Session Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-red-200">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleControl('mic')}
                      className={`p-3 rounded-full transition-colors duration-200 ${
                        sessionControls.mic 
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {sessionControls.mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => toggleControl('camera')}
                      className={`p-3 rounded-full transition-colors duration-200 ${
                        sessionControls.camera 
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {sessionControls.camera ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                    </button>
                    <button className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200">
                      <Settings className="h-5 w-5" />
                    </button>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${session.recording ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                      <span>{session.recording ? 'Recording' : 'Not Recording'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                      <Video className="h-4 w-4" />
                      <span>Join Session</span>
                    </button>
                    <button 
                      onClick={() => endSession(session.id)}
                      className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      <Square className="h-4 w-4" />
                      <span>End Session</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{session.title}</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Starts at {session.startTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>{session.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{session.participants} students</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{session.program}</span> • {session.cohort}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => startSession(session.id)}
                      className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Session</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions Today</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Video className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900">22</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Session Hours</p>
              <p className="text-3xl font-bold text-gray-900">6.5</p>
            </div>
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSessions;