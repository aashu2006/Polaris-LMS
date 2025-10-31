import React from 'react';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';

const MentorSummaryCards: React.FC = () => {
  const cards = [
    {
      title: 'Total Classes',
      value: '24',
      change: '12%',
      changeType: 'positive' as const,
      icon: BookOpen,
      description: 'Active learners'
    },
    {
      title: 'Active Programs',
      value: '4',
      change: '8%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Currently teaching'
    },
    {
      title: 'GitHub Contributions',
      value: '45',
      change: '5%',
      changeType: 'positive' as const,
      icon: Calendar,
      description: 'This week'
    },
    {
      title: 'Avg Attendance',
      value: '92%',
      change: '2%',
      changeType: 'positive' as const,
      icon: Award,
      description: 'Student engagement'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <Icon className="h-6 w-6 text-gray-400" />
              <div className={`flex items-center text-sm font-medium ${
                card.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
                <span className="mr-1">{card.changeType === 'positive' ? '↗' : '↘'}</span>
                <span>{card.change}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-white">{card.value}</p>
              <p className="text-sm text-gray-400">{card.title}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MentorSummaryCards;