import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

interface TopNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Programs' },
    { id: 'mentors', label: 'Mentors' },
    { id: 'students', label: 'Students' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">P</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">Polarislabs</span>
                <span className="text-[#FFC540] text-sm ml-1">2.0</span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id || (activeSection === 'programs' && item.id === 'dashboard')
                      ? 'bg-[#FFC540] text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white placeholder-gray-400 w-64"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#FFC540] text-black text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white font-medium">Admin</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;