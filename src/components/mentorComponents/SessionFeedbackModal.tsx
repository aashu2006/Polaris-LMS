import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useApi } from '../../services/api';

interface SessionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
  mentorId: string;
}

const SessionFeedbackModal: React.FC<SessionFeedbackModalProps> = ({ isOpen, onClose, session, mentorId }) => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    performance_rating: 5,
    overall_performance: '',
    strengh: '',
    area_for_improvement: '',
    homework: '',
    assignments: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Extract sessionId from session object (handle various possible field names)
      const rawSessionId = session.id || session.session_id || session.sessionId || session.live_session_id;
      // Ensure session_id is a number
      const sessionId = typeof rawSessionId === 'number' ? rawSessionId : Number(rawSessionId);
      
      // Convert performance_rating from string to number (select dropdown returns string)
      const performanceRating = Number(formData.performance_rating);
      
      // Build payload exactly as backend expects (no fallback values)
      const payload = {
        user_id: mentorId,
        session_id: sessionId,
        overall_performance: formData.overall_performance,
        strengh: formData.strengh,
        area_for_improvement: formData.area_for_improvement,
        homework: formData.homework,
        assignments: formData.assignments,
        performance_rating: performanceRating
      };

      console.log('📡 Submitting session feedback:', payload);
      console.log('📡 Payload JSON:', JSON.stringify(payload, null, 2));
      
      const response = await api.lms.mentors.submitFeedback(payload);
      console.log('✅ API Response:', response);
      console.log('✅ Session feedback submitted successfully');
      
      // Close modal and potentially show success message
      onClose();
      alert('Session feedback submitted successfully!');
    } catch (error: any) {
      console.error('❌ Error submitting session feedback:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      alert(`Failed to submit session feedback: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-4">
      <div className="bg-slate-800 text-white rounded-xl shadow-2xl w-full max-w-4xl m-0 sm:m-4 p-3 sm:p-4 md:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start sm:items-center gap-2 mb-4 sm:mb-6 border-b border-slate-700 pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg md:text-xl font-bold flex-1 pr-2 break-words">Add Session Feedback – {session.course_name || session.title || 'Session'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl sm:text-2xl flex-shrink-0">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Left Column: Session Details */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-slate-200">Session Details</h3>
              
              {/* Session ID - Read Only */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1">Session ID</label>
                <input
                  type="text"
                  value={session.id || session.session_id || session.sessionId || session.live_session_id || 'N/A'}
                  readOnly
                  disabled
                  className="w-full bg-slate-600 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-slate-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1">Performance Rating</label>
                <select
                  name="performance_rating"
                  value={formData.performance_rating}
                  onChange={handleChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={5}>5 - Excellent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1">Area for Improvement</label>
                <textarea
                  name="area_for_improvement"
                  value={formData.area_for_improvement}
                  onChange={handleChange}
                  placeholder="What areas need more focus?"
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-yellow-500 placeholder-slate-500 resize-none"
                />
              </div>
            </div>

            {/* Right Column: Feedback & Notes */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-slate-200">Feedback & Notes</h3>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1">Overall Performance</label>
                <textarea
                  name="overall_performance"
                  value={formData.overall_performance}
                  onChange={handleChange}
                  placeholder="Describe the overall session performance..."
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-yellow-500 placeholder-slate-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1">Strengths</label>
                <textarea
                  name="strengh"
                  value={formData.strengh}
                  onChange={handleChange}
                  placeholder="What went well in this session?"
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-yellow-500 placeholder-slate-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1">Homework Status</label>
              <textarea
                name="homework"
                value={formData.homework}
                onChange={handleChange}
                placeholder="Homework completion and status..."
                rows={2}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-yellow-500 placeholder-slate-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-400 mb-1">Assignments</label>
              <textarea
                name="assignments"
                value={formData.assignments}
                onChange={handleChange}
                placeholder="Assignment performance and deadlines..."
                rows={2}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-yellow-500 placeholder-slate-500 resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base text-slate-300 hover:text-white transition-colors rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionFeedbackModal;
