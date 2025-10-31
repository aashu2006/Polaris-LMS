import React from 'react';
import { useState } from 'react';
import DashboardOverview from './DashboardOverview';
import ProgramsView from './ProgramsView';
import MentorsView from './MentorsView';
import StudentsView from './StudentsView';
import ReportsView from './ReportsView';
import NotificationsView from './NotificationsView';
import StudentAssignmentModal from './StudentAssignmentModal';

interface DashboardContentProps {
  activeSection: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeSection }) => {
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
      case 'programs':
        return <DashboardOverview onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)} />;
      case 'mentors':
        return <MentorsView onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)} />;
      case 'students':
        return <StudentsView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return <DashboardOverview onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)} />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
      <StudentAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
      />
    </div>
  );
};

export default DashboardContent;