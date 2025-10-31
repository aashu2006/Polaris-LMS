import React from 'react';
import { BookOpen, Users, Calendar, TrendingUp } from 'lucide-react';

const SummaryCards: React.FC = () => {
  const cards = [
    {
      title: 'Total Programs',
      value: '24',
      change: '12%',
      changeType: 'positive' as const,
      icon: BookOpen,
      description: 'Active learning programs'
    },
    {
      title: 'Active Mentors',
      value: '156',
      change: '8%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Currently teaching'
    },
    {
      title: 'Scheduled Sessions',
      value: '342',
      change: '3%',
      changeType: 'negative' as const,
      icon: Calendar,
      description: 'This week'
    },
    {
      title: 'Avg Attendance',
      value: '87%',
      change: '5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Last 30 days'
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
                card.changeType === 'positive' ? 'text-[#FFC540]' : 'text-red-400'
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

export default SummaryCards;