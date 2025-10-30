import React, { useState } from 'react';
import { Search, Filter, Eye, CreditCard as Edit, MoreHorizontal } from 'lucide-react';

const ProgramTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const programs = [
    {
      id: 1,
      name: 'Full Stack Development',
      cohort: 'Cohort 2024-A',
      mentors: 8,
      sessions: 24,
      status: 'Active',
      students: 45
    },
    {
      id: 2,
      name: 'Data Science Bootcamp',
      cohort: 'Cohort 2024-B',
      mentors: 6,
      sessions: 18,
      status: 'Active',
      students: 32
    },
    {
      id: 3,
      name: 'UI/UX Design Track',
      cohort: 'Cohort 2024-A',
      mentors: 4,
      sessions: 16,
      status: 'Completed',
      students: 28
    },
    {
      id: 4,
      name: 'Mobile Development',
      cohort: 'Cohort 2024-C',
      mentors: 5,
      sessions: 20,
      status: 'Active',
      students: 38
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Programs Overview</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm text-white placeholder-gray-400"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-gray-300">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filter</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-750">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Program Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Cohort
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Mentors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Sessions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {programs.map((program) => (
              <tr key={program.id} className="hover:bg-gray-750 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-white">{program.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{program.cohort}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{program.mentors}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{program.sessions}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{program.students}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    program.status === 'Active'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {program.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-white transition-colors duration-200">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors duration-200">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors duration-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramTable;