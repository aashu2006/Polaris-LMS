import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, User, Calendar, ChevronDown, LogOut, X, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../services/api';

interface MentorTopNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MentorTopNavbar: React.FC<MentorTopNavbarProps> = ({ activeSection: _activeSection, setActiveSection: _setActiveSection }) => {
  const { user, logout } = useAuth();
  const api = useApi();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState({
    section_id: '',
    session_type: 'theory',
    start_date: '',
    class_time: '',
    duration: 60,
    venue: '',
    session_title: '',
    program: '',
    cohort: '',
    location: ''
  });

  // Fetch batches and programs on modal open
  useEffect(() => {
    if (scheduleModal) {
      fetchBatches();
      fetchPrograms();
    }
  }, [scheduleModal]);

  // Fetch sections when batch is selected
  useEffect(() => {
    if (selectedBatchId) {
      fetchSections(selectedBatchId);
    }
  }, [selectedBatchId]);

  const fetchBatches = async () => {
    try {
      const data = await api.lms.mentors.getBatches();
      setBatches(data.batches || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const data = await api.lms.adminMentors.getAllCourses();
      setPrograms(data.courses || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchSections = async (batchId: string) => {
    try {
      const data = await api.lms.mentors.getSections(batchId);
      setSections(Array.isArray(data) ? data : data.sections || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    setSections([]);
    setSessionData({ ...sessionData, section_id: '' });
  };

  const openScheduleModal = () => {
    setScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setScheduleModal(false);
    setSelectedBatchId('');
    setSections([]);
    setPrograms([]);
    setSessionData({
      section_id: '',
      session_type: 'theory',
      start_date: '',
      class_time: '',
      duration: 60,
      venue: '',
      session_title: '',
      program: '',
      cohort: '',
      location: ''
    });
  };

  const handleScheduleSession = async () => {
    try {
      setLoading(true);

      const sessionPayload = {
        section_id: parseInt(sessionData.section_id),
        faculty_id: user?.id,
        session_type: sessionData.session_type,
        start_date: sessionData.start_date,
        class_time: sessionData.class_time,
        duration: sessionData.duration,
        venue: sessionData.venue
      };

      await api.lms.mentors.addSession(sessionPayload);

      alert('Session scheduled successfully!');
      closeScheduleModal();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div>
              <h1 className="text-xl font-bold text-[#FFC540]">Polaris Labs</h1>
              <p className="text-gray-400 text-sm">Mentor Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search students, sessions, recordings..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white placeholder-gray-400 w-64"
              />
            </div>

            <button
              onClick={openScheduleModal}
              className="flex items-center space-x-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule Session</span>
            </button>

            <button className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 hover:bg-gray-700 rounded-lg px-2 py-1 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-[#FFC540] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-black" />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />

                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-semibold text-white">{user?.name || 'Mentor'}</p>
                      <p className="text-xs text-gray-400">{user?.email || ''}</p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule New Session Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">Schedule New Session</h3>
              <button
                onClick={closeScheduleModal}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Batch Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => handleBatchChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batch_name} {batch.academic_year && batch.semester ? `(${batch.academic_year} - Sem ${batch.semester})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Selection (shows after batch is selected) */}
              {selectedBatchId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course/Section <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={sessionData.section_id}
                    onChange={(e) => setSessionData({ ...sessionData, section_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                    required
                  >
                    <option value="">Select Course/Section</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.course_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={sessionData.session_type}
                  onChange={(e) => setSessionData({ ...sessionData, session_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                  required
                >
                  <option value="theory">Theory</option>
                  <option value="practical">Practical</option>
                </select>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue <span className="text-red-500">*</span>
                </label>
                <select
                  value={sessionData.venue}
                  onChange={(e) => setSessionData({ ...sessionData, venue: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                  required
                >
                  <option value="">Select Venue</option>
                  <option value="Room 101">Room 101</option>
                  <option value="Room 102">Room 102</option>
                  <option value="Room 203">Room 203</option>
                  <option value="Lab A">Lab A</option>
                  <option value="Lab B">Lab B</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              {/* Session Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={sessionData.session_title}
                  onChange={(e) => setSessionData({ ...sessionData, session_title: e.target.value })}
                  placeholder="e.g., React Fundamentals"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={sessionData.start_date}
                  onChange={(e) => setSessionData({ ...sessionData, start_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={sessionData.class_time}
                  onChange={(e) => setSessionData({ ...sessionData, class_time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <select
                  value={sessionData.duration}
                  onChange={(e) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                  required
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                  <option value="150">150 minutes</option>
                  <option value="180">180 minutes</option>
                </select>
              </div>

              {/* Program */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                <select
                  value={sessionData.program}
                  onChange={(e) => setSessionData({ ...sessionData, program: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
                >
                  <option value="">Select Program (Optional)</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.course_name || program.name}>
                      {program.course_name || program.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cohort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cohort</label>
                <input
                  type="text"
                  value={sessionData.cohort}
                  onChange={(e) => setSessionData({ ...sessionData, cohort: e.target.value })}
                  placeholder="e.g., 2024-A"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={sessionData.location}
                  onChange={(e) => setSessionData({ ...sessionData, location: e.target.value })}
                  placeholder="Physical location or coordinates"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeScheduleModal}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSession}
                disabled={loading || !sessionData.section_id || !sessionData.start_date || !sessionData.class_time || !sessionData.venue}
                className="flex items-center space-x-2 bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Schedule Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MentorTopNavbar;