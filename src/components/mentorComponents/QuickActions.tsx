import React from 'react';
import { UserPlus, BookOpen, Upload, Calendar } from 'lucide-react';

interface QuickActionsProps {
  onOpenAssignmentModal: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onOpenAssignmentModal }) => {
  const actions = [
    {
      title: 'Invite Mentor',
      description: 'Add new mentors to programs',
      icon: UserPlus,
      color: 'bg-[#FFC540]',
      textColor: 'text-black'
    },
    {
      title: 'Create Program',
      description: 'Start a new learning program',
      icon: BookOpen,
      color: 'bg-gray-800',
      textColor: 'text-white'
    },
    {
      title: 'Bulk Upload Students',
      description: 'Import student data via CSV',
      icon: Upload,
      color: 'bg-gray-800',
      textColor: 'text-white'
    }
  ];

  return (
    <>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={index}
              className={`${action.color} rounded-xl p-6 hover:scale-105 transition-all duration-200 cursor-pointer relative overflow-hidden border ${
                action.color === 'bg-yellow-400' ? 'border-yellow-400' : 'border-gray-700'
              }`}
              onClick={() => {
                if (action.title === 'Invite Mentor') {
                  onOpenAssignmentModal();
                }
              }}
            >
              <div className="absolute top-4 right-4">
                <div className={`w-2 h-2 rounded-full ${
                  action.color === 'bg-[#FFC540]' ? 'bg-black opacity-20' : 'bg-[#FFC540]'
                }`}></div>
              </div>
              <div className="mb-4">
                <Icon className={`h-8 w-8 ${action.textColor || 'text-white'} mb-4`} />
              </div>
              <div>
                <h3 className={`font-bold text-xl ${action.textColor || 'text-white'} mb-2`}>{action.title}</h3>
                <p className={`text-sm ${action.textColor === 'text-black' ? 'text-gray-800' : 'text-gray-400'}`}>{action.description}</p>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default QuickActions;