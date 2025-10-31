import React from 'react';
import SummaryCards from './SummaryCards';
import ProgramTable from './ProgramTable';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';

interface DashboardOverviewProps {
  onOpenAssignmentModal: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onOpenAssignmentModal }) => {
  return (
    <div className="space-y-8 font-jakarta">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, Admin</h1>
        <p className="text-gray-400">Here's what's happening with your learning programs today.</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1">
        <button className="bg-[#FFC540] text-black px-4 py-2 rounded-lg font-medium">
          Programs
        </button>
        <button className="text-gray-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
          Students
        </button>
        <button className="text-gray-400 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
          Mentors
        </button>
      </div>
      
      <SummaryCards />
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          <button className="flex items-center space-x-2 bg-[#FFC540] text-black px-6 py-3 rounded-lg hover:bg-[#e6b139] transition-colors duration-200 font-medium">
            <span>+</span>
            <span>More Actions</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActions onOpenAssignmentModal={onOpenAssignmentModal} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;