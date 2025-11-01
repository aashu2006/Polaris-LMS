import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, Calendar, BarChart3, MessageCircle, Clock, Users, Plus, FileText } from 'lucide-react';
import { useApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface SessionStudent {
  enrollment_id: number;
  student_id: string;
  student_name: string;
  student_email: string | null;
  batch_id: number;
  section_id: number;
  enrollment_date: string;
  attendance_status: string;
  has_feedback: boolean;
}

interface SessionData {
  session_id: number;
  session_datetime: string;
  duration: number;
  venue: string;
  status: string;
  course_id: number;
  course_name: string;
  course_code: string;
  student_count: number;
  students: SessionStudent[];
  has_more: boolean;
}

const MentorStudents: React.FC = () => {
  const [previousSessions, setPreviousSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean; sessionId: number | null }>({
    isOpen: false,
    sessionId: null
  });
  
  const [feedbackData, setFeedbackData] = useState({
    sessionTitle: '',
    sessionDate: '',
    attendance: 'present',
    performance: '',
    strengths: '',
    areasForImprovement: '',
    homework: '',
    assignments: '',
    rating: 5,
    documents: [] as File[]
  });

  const { user } = useAuth();
  const userId = user?.id;
  const api = useApi();

  useEffect(() => {
    console.log('MentorStudents mounted');
    console.log('User:', user);
    console.log('UserId:', userId);
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.lms.adminSchedule.getFacultySessions(userId);
      
      const sessions = response.data || [];
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const lastWeekSessions = sessions.filter((session: SessionData) => {
        const sessionDate = new Date(session.session_datetime);
        return sessionDate >= sevenDaysAgo && sessionDate <= now;
      });

      setPreviousSessions(lastWeekSessions.sort((a: SessionData, b: SessionData) => 
        new Date(b.session_datetime).getTime() - new Date(a.session_datetime).getTime()
      ));
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const openFeedbackModal = (sessionId: number) => {
    console.log('=== openFeedbackModal called ===');
    console.log('sessionId received:', sessionId);
    console.log('previousSessions:', previousSessions);
    
    // Try both session_id and id properties
    const session = previousSessions.find(s => (s as any).session_id === sessionId || (s as any).id === sessionId);
    console.log('Found session:', session);
    
    if (session) {
      console.log('Session course name:', (session as any).course_name);
      console.log('Session students:', (session as any).students);
      console.log('Number of students:', (session as any).students?.length);
      
      setFeedbackModal({ isOpen: true, sessionId });
      setFeedbackData(prev => ({
        ...prev,
        sessionTitle: (session as any).course_name,
        sessionDate: new Date((session as any).session_datetime).toISOString().split('T')[0]
      }));
    } else {
      console.log('Session not found!');
    }
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ isOpen: false, sessionId: null });
    resetFeedbackData();
  };

  const resetFeedbackData = () => {
    setFeedbackData({
      sessionTitle: '',
      sessionDate: '',
      attendance: 'present',
      performance: '',
      strengths: '',
      areasForImprovement: '',
      homework: '',
      assignments: '',
      rating: 5,
      documents: []
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Users className="h-8 w-8 text-blue-500 mx-auto" />
          </div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Session Feedback</h1>
          <p className="text-gray-400 mt-1">Add feedback for students after each completed session.</p>
        </div>
      </div>

      {/* Previous Sessions */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Previous Sessions (Last 7 Days)</h2>
        {previousSessions.length === 0 ? (
          <p className="text-gray-400">No sessions in the last 7 days</p>
        ) : (
          <div className="space-y-4">
            {previousSessions.map((session, index) => (
              <div key={`session-${session.session_id}-${index}`} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{session.course_name}</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(session.session_datetime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{session.duration} minutes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{session.student_count} students</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{session.course_code}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        console.log('Button clicked, session object:', session);
                        console.log('Session ID to pass:', session.session_id || session.id);
                        openFeedbackModal(session.session_id || session.id);
                      }}
                      className="flex items-center space-x-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Feedback</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <StudentSelectionModal
          isOpen={feedbackModal.isOpen}
          sessionId={feedbackModal.sessionId}
          onClose={closeFeedbackModal}
          sessions={previousSessions}
          userId={userId}
          api={api}
        />
      )}
    </div>
  );
};

// Student Selection Modal Component
interface StudentSelectionModalProps {
  isOpen: boolean;
  sessionId: number | null;
  onClose: () => void;
  sessions: SessionData[];
  userId: string;
  api: any;
}

const StudentSelectionModal: React.FC<StudentSelectionModalProps> = ({ 
  isOpen, 
  sessionId, 
  onClose, 
  sessions,
  userId,
  api
}) => {
  const [selectedStudent, setSelectedStudent] = useState<SessionStudent | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionStudents, setSessionStudents] = useState<SessionStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  
  const [feedbackData, setFeedbackData] = useState({
    sessionTitle: '',
    sessionDate: '',
    attendance: 'present',
    overall_performance: '',
    strengh: '',
    area_for_improvement: '',
    homework: '',
    assignments: '',
    performance_rating: 5,
    documents: [] as File[]
  });

  const session = sessions.find(s => s.session_id === sessionId);

  // Fetch students when modal opens
  useEffect(() => {
    if (isOpen && sessionId) {
      fetchStudents();
    }
  }, [isOpen, sessionId]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      console.log('Fetching students for userId:', userId);
      
      const response = await api.lms.mentors.getFacultyStudents(userId);
      console.log('API Response:', response);
      console.log('Session ID looking for:', sessionId);
      
      const sessionsData = response.data || [];
      console.log('Sessions data:', sessionsData);
      
      const currentSession = sessionsData.find((s: any) => s.session_id === sessionId);
      console.log('Current session found:', currentSession);
      
      if (currentSession && currentSession.students) {
        console.log('Setting students:', currentSession.students);
        setSessionStudents(currentSession.students);
      } else {
        console.log('No students found for this session');
        setSessionStudents([]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setSessionStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleStudentSelect = (student: SessionStudent) => {
    setSelectedStudent(student);
    setShowFeedbackForm(true);
    if (session) {
      setFeedbackData(prev => ({
        ...prev,
        sessionTitle: session.course_name,
        sessionDate: new Date(session.session_datetime).toISOString().split('T')[0]
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFeedbackData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeDocument = (index: number) => {
    setFeedbackData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const submitFeedback = async () => {
    if (!selectedStudent || !sessionId) return;

    try {
      setSubmitting(true);

      // Prepare payload
      const payload = {
        user_id: selectedStudent.student_id,
        session_id: sessionId,
        overall_performance: feedbackData.overall_performance,
        strengh: feedbackData.strengh,
        area_for_improvement: feedbackData.area_for_improvement,
        homework: feedbackData.homework,
        assignments: feedbackData.assignments,
        performance_rating: feedbackData.performance_rating
      };

      console.log('Submitting feedback:', payload);

      // Make API call to submit feedback using API service
      const result = await api.lms.mentors.submitFeedback(payload);
      console.log('Feedback submitted successfully:', result);

      // Reset and close
      setShowFeedbackForm(false);
      setSelectedStudent(null);
      setFeedbackData({
        sessionTitle: '',
        sessionDate: '',
        attendance: 'present',
        overall_performance: '',
        strengh: '',
        area_for_improvement: '',
        homework: '',
        assignments: '',
        performance_rating: 5,
        documents: []
      });
      onClose();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    setShowFeedbackForm(false);
    setSelectedStudent(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">
            {showFeedbackForm 
              ? `Add Feedback - ${session?.course_name} - ${selectedStudent?.student_name}`
              : `Select Student - ${session?.course_name}`
            }
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {!showFeedbackForm ? (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Select a student to add feedback for:</h4>
              {loadingStudents ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Loading students...</p>
                </div>
              ) : sessionStudents.length === 0 ? (
                <p className="text-gray-400">No students available for this session</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionStudents.map((student, index) => (
                    <div
                      key={`student-${student.enrollment_id}-${index}`}
                      key={student.enrollment_id}
                      onClick={() => handleStudentSelect(student)}
                      className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#FFC540] rounded-full flex items-center justify-center text-black font-bold">
                          {student.student_name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-medium text-white">{student.student_name}</h5>
                          <p className="text-sm text-gray-400">{student.student_email || 'No email'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goBack}
                  className="text-[#FFC540] hover:text-[#e6b139] transition-colors duration-200"
                >
                  ← Back to student selection
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Session Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Session Title</label>
                    <input
                      type="text"
                      value={feedbackData.sessionTitle}
                      readOnly
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Session Date</label>
                    <input
                      type="date"
                      value={feedbackData.sessionDate}
                      readOnly
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Performance Rating</label>
                    <select
                      value={feedbackData.performance_rating}
                      onChange={(e) => setFeedbackData({...feedbackData, performance_rating: parseInt(e.target.value)})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFC540]"
                    >
                      <option value={1}>1 - Needs Improvement</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={3}>3 - Average</option>
                      <option value={4}>4 - Good</option>
                      <option value={5}>5 - Excellent</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={10}>10 - Outstanding</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Feedback & Notes</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Overall Performance</label>
                    <textarea
                      value={feedbackData.overall_performance}
                      onChange={(e) => setFeedbackData({...feedbackData, overall_performance: e.target.value})}
                      placeholder="Describe the student's overall performance..."
                      rows={3}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Strengths</label>
                    <textarea
                      value={feedbackData.strengh}
                      onChange={(e) => setFeedbackData({...feedbackData, strengh: e.target.value})}
                      placeholder="What did the student do well?"
                      rows={2}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] resize-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Area for Improvement</label>
                  <textarea
                    value={feedbackData.area_for_improvement}
                    onChange={(e) => setFeedbackData({...feedbackData, area_for_improvement: e.target.value})}
                    placeholder="What areas need more focus?"
                    rows={2}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Homework Status</label>
                  <textarea
                    value={feedbackData.homework}
                    onChange={(e) => setFeedbackData({...feedbackData, homework: e.target.value})}
                    placeholder="Homework completion and status..."
                    rows={2}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Assignments & Projects</label>
                  <textarea
                    value={feedbackData.assignments}
                    onChange={(e) => setFeedbackData({...feedbackData, assignments: e.target.value})}
                    placeholder="Feedback on assignments and projects..."
                    rows={2}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            Cancel
          </button>
          {showFeedbackForm && (
            <button
              onClick={submitFeedback}
              disabled={submitting}
              className="flex items-center space-x-2 bg-[#FFC540] text-black px-6 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200 disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              <span>{submitting ? 'Saving...' : 'Save Feedback'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorStudents;