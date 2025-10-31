import React, { useState } from 'react';
import { Calendar, FileText, Star, Download, Eye, Filter } from 'lucide-react';

interface FeedbackRecord {
  id: number;
  sessionTitle: string;
  sessionDate: string;
  attendance: string;
  performance: string;
  strengths: string;
  areasForImprovement: string;
  homework: string;
  nextSessionGoals: string;
  rating: number;
  documents: string[];
  mentorName: string;
}

interface StudentFeedbackHistoryProps {
  studentId: number;
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
}

const StudentFeedbackHistory: React.FC<StudentFeedbackHistoryProps> = ({ 
  studentId, 
  studentName, 
  isOpen, 
  onClose 
}) => {
  const [filterDate, setFilterDate] = useState('all');

  // Sample feedback data - in real app, this would come from API
  const feedbackHistory: FeedbackRecord[] = [
    {
      id: 1,
      sessionTitle: 'React Components & Props',
      sessionDate: '2024-01-15',
      attendance: 'present',
      performance: 'Excellent understanding of component structure and props passing. Completed all exercises successfully.',
      strengths: 'Quick to grasp concepts, asks thoughtful questions, good problem-solving approach.',
      areasForImprovement: 'Could work on code organization and commenting practices.',
      homework: 'Build a todo app using React components and props',
      nextSessionGoals: 'Introduction to React State and Event Handling',
      rating: 5,
      documents: ['react-components-notes.pdf', 'homework-assignment.pdf'],
      mentorName: 'Dr. Sarah Johnson'
    },
    {
      id: 2,
      sessionTitle: 'JavaScript ES6+ Features',
      sessionDate: '2024-01-12',
      attendance: 'present',
      performance: 'Good grasp of arrow functions and destructuring. Struggled slightly with async/await concepts.',
      strengths: 'Strong foundation in basic JavaScript, eager to learn new concepts.',
      areasForImprovement: 'Needs more practice with asynchronous programming concepts.',
      homework: 'Complete async/await exercises and read MDN documentation',
      nextSessionGoals: 'Deep dive into Promises and async patterns',
      rating: 4,
      documents: ['es6-cheatsheet.pdf'],
      mentorName: 'Dr. Sarah Johnson'
    }
  ];

  const getAttendanceColor = (attendance: string) => {
    switch (attendance) {
      case 'present': return 'text-green-400';
      case 'late': return 'text-yellow-400';
      case 'absent': return 'text-red-400';
      case 'excused': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-[#FFC540] fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            Feedback History - {studentName}
          </h2>
          <div className="flex items-center space-x-3">
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {feedbackHistory.map((feedback) => (
              <div key={feedback.id} className="bg-gray-700 rounded-xl border border-gray-600 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feedback.sessionTitle}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(feedback.sessionDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Attendance:</span>
                        <span className={`font-medium ${getAttendanceColor(feedback.attendance)}`}>
                          {feedback.attendance.charAt(0).toUpperCase() + feedback.attendance.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Rating:</span>
                        <div className="flex space-x-1">
                          {getRatingStars(feedback.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">by {feedback.mentorName}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Performance</h4>
                    <p className="text-gray-300 text-sm">{feedback.performance}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Strengths</h4>
                    <p className="text-gray-300 text-sm">{feedback.strengths}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Areas for Improvement</h4>
                    <p className="text-gray-300 text-sm">{feedback.areasForImprovement}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Next Session Goals</h4>
                    <p className="text-gray-300 text-sm">{feedback.nextSessionGoals}</p>
                  </div>
                </div>

                {feedback.homework && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-white mb-2">Homework/Assignments</h4>
                    <p className="text-gray-300 text-sm">{feedback.homework}</p>
                  </div>
                )}

                {feedback.documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {feedback.documents.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-600 rounded-lg px-3 py-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-white">{doc}</span>
                          <button className="text-gray-400 hover:text-white transition-colors duration-200">
                            <Download className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {feedbackHistory.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No feedback records found</h3>
              <p className="text-gray-400">Feedback will appear here after sessions are completed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFeedbackHistory;