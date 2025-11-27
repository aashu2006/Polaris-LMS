import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import MentorSummaryCards from './MentorSummaryCards';
import UpcomingSessions from './UpcomingSessions';
import StudentProgress from './StudentProgress';
import RecentActivity from './RecentActivity';
import MentorStudents from './MentorStudents';
import MentorSchedule from './MentorSchedule';
import MentorRecordings from './MentorRecordings';
import MentorAssignments from './MentorAssignments';
import MentorAnalytics from './MentorAnalytics';
import StudentFeedbackHistory from './StudentFeedbackHistory';
import { useAuth } from '../../contexts/AuthContext';

interface MentorOverviewProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MentorOverview: React.FC<MentorOverviewProps> = ({ activeSection, setActiveSection }) => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackHistoryModal, setFeedbackHistoryModal] = useState<{ isOpen: boolean; studentId: number | null; studentName: string }>({
    isOpen: false,
    studentId: null,
    studentName: ''
  });

  const displayName = useMemo(() => {
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
    return user?.name || getNameFromToken(token) || '';
  }, [user, token]);

  const tabItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'students', label: 'Feedback' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'recordings', label: 'Recordings' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setActiveSection(tabId);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000); // Visual feedback timeout
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <MentorSummaryCards key={`cards-${refreshKey}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UpcomingSessions key={`sessions-${refreshKey}`} />
              </div>
              <div className="space-y-6">
                <StudentProgress key={`progress-${refreshKey}`} />
                <RecentActivity key={`activity-${refreshKey}`} />
              </div>
            </div>
          </>
        );
      case 'students':
        return <MentorStudents key={`students-${refreshKey}`} />;
      case 'schedule':
        return <MentorSchedule key={`schedule-${refreshKey}`} />;
      case 'recordings':
        return <MentorRecordings key={`recordings-${refreshKey}`} />;
      case 'assignments':
        return <MentorAssignments key={`assignments-${refreshKey}`} />;
      case 'analytics':
        return <MentorAnalytics key={`analytics-${refreshKey}`} />;
      default:
        return (
          <>
            <MentorSummaryCards key={`cards-${refreshKey}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UpcomingSessions key={`sessions-${refreshKey}`} />
              </div>
              <div className="space-y-6">
                <StudentProgress key={`progress-${refreshKey}`} />
                <RecentActivity key={`activity-${refreshKey}`} />
              </div>
            </div>
          </>
        );
    }
  };

  const openFeedbackHistory = (studentId: number, studentName: string) => {
    setFeedbackHistoryModal({ isOpen: true, studentId, studentName });
  };

  const closeFeedbackHistory = () => {
    setFeedbackHistoryModal({ isOpen: false, studentId: null, studentName: '' });
  };

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {displayName || 'Mentor'}!</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your students and sessions.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Refresh Dashboard"
        >
          <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1">
        {tabItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === item.id
              ? 'bg-[#FFC540] text-black'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {renderTabContent()}

      <StudentFeedbackHistory
        studentId={feedbackHistoryModal.studentId || 0}
        studentName={feedbackHistoryModal.studentName}
        isOpen={feedbackHistoryModal.isOpen}
        onClose={closeFeedbackHistory}
      />
    </div>
  );
};

export default MentorOverview;