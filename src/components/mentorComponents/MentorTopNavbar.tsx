import React, { useState } from 'react';
import { Search, Bell, Settings, User, Calendar, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MentorTopNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MentorTopNavbar: React.FC<MentorTopNavbarProps> = ({ activeSection, setActiveSection }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

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
            
            <button className="flex items-center space-x-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200">
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
    </header>
  );
};

export default MentorTopNavbar;