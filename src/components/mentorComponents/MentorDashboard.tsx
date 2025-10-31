import React, { useState } from 'react';
import MentorTopNavbar from './MentorTopNavbar';
import MentorDashboardContent from './MentorDashboardContent';

const MentorDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-900">
      <MentorTopNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="p-6">
        <MentorDashboardContent activeSection={activeSection} />
      </main>
    </div>
  );
};

export default MentorDashboard;