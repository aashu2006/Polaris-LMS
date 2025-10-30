import React from 'react';
import { Users, User } from 'lucide-react';

const StudentProgress: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-white" />
          <h3 className="text-lg font-bold text-white">Mentor Info</h3>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
          <img 
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" 
            alt="Sarah Mitchell"
            className="w-full h-full object-cover"
          />
        </div>
        
        <h4 className="text-xl font-bold text-white mb-1">Sarah Mitchell</h4>
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <div className="w-4 h-4 bg-gray-600 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-400 rounded"></div>
          </div>
          <span>Frontend Development</span>
        </div>
        
        <p className="text-sm text-gray-400 leading-relaxed">
          Experienced React developer with 8+ years in the industry. Passionate about teaching modern web development techniques and best practices.
        </p>
      </div>
    </div>
  );
};

export default StudentProgress;