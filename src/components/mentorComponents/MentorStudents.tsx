import React, { useState } from 'react';
import { Search, Filter, Mail, Phone, Calendar, BarChart3, MessageCircle, Clock, Users, Plus, FileText } from 'lucide-react';

const MentorStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean; sessionId: number | null; studentId: number | null }>({
    isOpen: false,
    sessionId: null,
    studentId: null
  });
  const [feedbackData, setFeedbackData] = useState({
    sessionTitle: '',
    sessionDate: '',
    attendance: 'present',
    performance: '',
    strengths: '',
    areasForImprovement: '',
    homework: '',
    nextSessionGoals: '',
    rating: 5,
    documents: [] as File[]
  });

  // Previous sessions data
  const previousSessions = [
    {
      id: 1,
      title: 'React Components & Props',
      date: '2024-01-15',
      duration: '2h 15m',
      studentsAttended: 6,
      totalStudents: 8,
      program: 'Full Stack Development',
      cohort: '2024-A',
      status: 'completed'
    },
    {
      id: 2,
      title: 'State Management with Redux',
      date: '2024-01-14',
      duration: '1h 45m',
      studentsAttended: 7,
      totalStudents: 8,
      program: 'Full Stack Development',
      cohort: '2024-A',
      status: 'completed'
    },
    {
      id: 3,
      title: 'JavaScript ES6+ Features',
      date: '2024-01-13',
      duration: '2h 30m',
      studentsAttended: 8,
      totalStudents: 8,
      program: 'Full Stack Development',
      cohort: '2024-A',
      status: 'completed'
    }
  ];

  const students = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 (555) 123-4567',
      program: 'Full Stack Development',
      cohort: '2024-A',
      progress: 85,
      attendance: 95,
      lastSession: '2 hours ago',
      githubContributions: 23,
      status: 'active'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1 (555) 234-5678',
      program: 'Full Stack Development',
      cohort: '2024-A',
      progress: 72,
      attendance: 88,
      lastSession: '1 day ago',
      githubContributions: 15,
      status: 'active'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1 (555) 345-6789',
      program: 'Full Stack Development',
      cohort: '2024-B',
      progress: 91,
      attendance: 100,
      lastSession: '2 hours ago',
      githubContributions: 31,
      status: 'active'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890',
      program: 'Full Stack Development',
      cohort: '2024-A',
      progress: 58,
      attendance: 75,
      lastSession: '3 days ago',
      githubContributions: 8,
      status: 'needs-attention'
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-[#FFC540]';
    return 'bg-red-500';
  };

  const openFeedbackModal = (sessionId: number, studentId?: number) => {
    setFeedbackModal({ isOpen: true, sessionId, studentId: studentId || null });
    // Pre-fill with current date
    setFeedbackData(prev => ({
      ...prev,
      sessionDate: new Date().toISOString().split('T')[0]
    }));
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ isOpen: false, sessionId: null, studentId: null });
    setFeedbackData({
      sessionTitle: '',
      sessionDate: '',
      attendance: 'present',
      performance: '',
      strengths: '',
      areasForImprovement: '',
      homework: '',
      nextSessionGoals: '',
      rating: 5,
      documents: []
    });
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

  const submitFeedback = () => {
    const session = previousSessions.find(s => s.id === feedbackModal.sessionId);
    const student = students.find(s => s.id === feedbackModal.studentId);
    console.log('Submitting feedback for session:', session?.title, 'student:', student?.name, feedbackData);
    // Here you would make the API call to save the feedback
    closeFeedbackModal();
  };

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
        <h2 className="text-xl font-bold text-white mb-4">Previous Sessions</h2>
        <div className="space-y-4">
          {previousSessions.map((session) => (
            <div key={session.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{session.title}</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{session.studentsAttended}/{session.totalStudents} attended</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{session.program}</span> • {session.cohort}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => openFeedbackModal(session.id)}
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
      </div>

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <StudentSelectionModal
          isOpen={feedbackModal.isOpen}
          sessionId={feedbackModal.sessionId}
          onClose={closeFeedbackModal}
          students={students}
          previousSessions={previousSessions}
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
  students: any[];
  previousSessions: any[];
}

const StudentSelectionModal: React.FC<StudentSelectionModalProps> = ({ 
  isOpen, 
  sessionId, 
  onClose, 
  students, 
  previousSessions 
}) => {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    sessionTitle: '',
    sessionDate: '',
    attendance: 'present',
    performance: '',
    strengths: '',
    areasForImprovement: '',
    homework: '',
    nextSessionGoals: '',
    rating: 5,
    documents: [] as File[]
  });

  const session = previousSessions.find(s => s.id === sessionId);

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudent(studentId);
    setShowFeedbackForm(true);
    // Pre-fill session data
    if (session) {
      setFeedbackData(prev => ({
        ...prev,
        sessionTitle: session.title,
        sessionDate: session.date
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

  const submitFeedback = () => {
    const student = students.find(s => s.id === selectedStudent);
    console.log('Submitting feedback for session:', session?.title, 'student:', student?.name, feedbackData);
    // Reset and close
    setShowFeedbackForm(false);
    setSelectedStudent(null);
    setFeedbackData({
      sessionTitle: '',
      sessionDate: '',
      attendance: 'present',
      performance: '',
      strengths: '',
      areasForImprovement: '',
      homework: '',
      nextSessionGoals: '',
      rating: 5,
      documents: []
    });
    onClose();
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
              ? `Add Feedback - ${session?.title} - ${students.find(s => s.id === selectedStudent)?.name}`
              : `Select Student - ${session?.title}`
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
            // Student Selection View
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Select a student to add feedback for:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentSelect(student.id)}
                    className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FFC540] rounded-full flex items-center justify-center text-black font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-medium text-white">{student.name}</h5>
                        <p className="text-sm text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Feedback Form View
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
                {/* Session Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Session Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Session Title</label>
                    <input
                      type="text"
                      value={feedbackData.sessionTitle}
                      onChange={(e) => setFeedbackData({...feedbackData, sessionTitle: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Session Date</label>
                    <input
                      type="date"
                      value={feedbackData.sessionDate}
                      onChange={(e) => setFeedbackData({...feedbackData, sessionDate: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Attendance</label>
                    <select
                      value={feedbackData.attendance}
                      onChange={(e) => setFeedbackData({...feedbackData, attendance: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent"
                    >
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                      <option value="excused">Excused Absence</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Performance Rating</label>
                    <select
                      value={feedbackData.rating}
                      onChange={(e) => setFeedbackData({...feedbackData, rating: parseInt(e.target.value)})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Needs Improvement</option>
                    </select>
                  </div>
                </div>
                
                {/* Feedback Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Feedback & Notes</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Overall Performance</label>
                    <textarea
                      value={feedbackData.performance}
                      onChange={(e) => setFeedbackData({...feedbackData, performance: e.target.value})}
                      placeholder="Describe the student's overall performance in this session..."
                      rows={3}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Strengths</label>
                    <textarea
                      value={feedbackData.strengths}
                      onChange={(e) => setFeedbackData({...feedbackData, strengths: e.target.value})}
                      placeholder="What did the student do well?"
                      rows={2}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Areas for Improvement</label>
                    <textarea
                      value={feedbackData.areasForImprovement}
                      onChange={(e) => setFeedbackData({...feedbackData, areasForImprovement: e.target.value})}
                      placeholder="What areas need more focus?"
                      rows={2}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
              
              {/* Full Width Sections */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Homework/Assignments Given</label>
                  <textarea
                    value={feedbackData.homework}
                    onChange={(e) => setFeedbackData({...feedbackData, homework: e.target.value})}
                    placeholder="List any homework or assignments given to the student..."
                    rows={2}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Goals for Next Session</label>
                  <textarea
                    value={feedbackData.nextSessionGoals}
                    onChange={(e) => setFeedbackData({...feedbackData, nextSessionGoals: e.target.value})}
                    placeholder="What should be the focus for the next session?"
                    rows={2}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent resize-none"
                  />
                </div>
                
                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Upload Documents</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="document-upload"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    />
                    <label
                      htmlFor="document-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-400">Click to upload documents</span>
                      <span className="text-xs text-gray-500 mt-1">PDF, DOC, TXT, Images (Max 10MB each)</span>
                    </label>
                  </div>
                  
                  {/* Uploaded Files */}
                  {feedbackData.documents.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {feedbackData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-white">{file.name}</span>
                            <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            onClick={() => removeDocument(index)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
              className="flex items-center space-x-2 bg-[#FFC540] text-black px-6 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200"
            >
              <FileText className="h-4 w-4" />
              <span>Save Feedback</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default MentorStudents;