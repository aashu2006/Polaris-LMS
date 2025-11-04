import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, Shield, ArrowRight } from 'lucide-react';

interface LandingProps {
  onLogin: (user: any, token: string) => void;
}

const Landing: React.FC<LandingProps> = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage the entire learning management system and user accounts',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      hoverBg: 'hover:bg-blue-500/20',
      route: '/admin/login'
    },
    {
      id: 'student',
      title: 'Student',
      description: 'Access your courses, assignments, and track your learning progress',
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      hoverBg: 'hover:bg-green-500/20',
      route: '/student/login'
    },
    {
      id: 'faculty',
      title: 'Faculty / Mentor',
      description: 'Manage your courses, students, and create engaging learning experiences',
      icon: Users,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      hoverBg: 'hover:bg-yellow-500/20',
      route: '/faculty/login'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-9 h-9 text-black" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Polaris LMS
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Empowering education through technology. Choose your role to continue.
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => navigate(type.route)}
                className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border ${type.borderColor} ${type.hoverBg} transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-white mb-3">
                  {type.title}
                </h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {type.description}
                </p>

                {/* Arrow */}
                <div className={`flex items-center justify-center ${type.textColor} font-semibold group-hover:translate-x-2 transition-transform duration-300`}>
                  <span className="mr-2">Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
