import React, { useState } from 'react';
import AdminDashboard from './components/mentorComponents/AdminDashboard';
import MentorDashboard from './components/mentorComponents/MentorDashboard' 

function App() {
  const [userRole, setUserRole] = useState<'admin' | 'mentor'>('mentor'); // Default to mentor for demo

  return (
    <div className="min-h-screen bg-gray-50">
      {userRole === 'admin' ? <AdminDashboard /> : <MentorDashboard />}
      
      {/* Role Switcher for Demo */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setUserRole(userRole === 'admin' ? 'mentor' : 'admin')}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-500 transition-colors duration-200"
        >
          Switch to {userRole === 'admin' ? 'Mentor' : 'Admin'} View
        </button>
      </div>
    </div>
  );
}

export default App;

