import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import DashboardContent from './DashboardContent';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-900">
      <TopNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="p-6">
        <DashboardContent activeSection={activeSection} />
      </main>
    </div>
  );
};

export default AdminDashboard;