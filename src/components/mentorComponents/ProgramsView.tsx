import React, { useState } from 'react';
import { Search, Filter, Eye, MessageSquare, MoreHorizontal } from 'lucide-react';

const ProgramsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const programs = [
    {
      id: 1,
      name: 'Data Science Bootcamp',
      cohort: 'Cohort 2024-B',
      mentors: 6,
      sessions: 38,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Full Stack Development',
      cohort: 'Cohort 2024-A',
      mentors: 8,
      sessions: 45,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Machine Learning Advanced',
      cohort: 'Cohort 2024-D',
      mentors: 10,
      sessions: 42,
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'UI/UX Design Fundamentals',
      cohort: 'Cohort 2024-C',
      mentors: 4,
      sessions: 32,
      status: 'Completed'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-900 text-green-300';
      case 'Inactive':
        return 'bg-gray-700 text-gray-300';
      case 'Completed':
        return 'bg-yellow-900 text-yellow-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Programs</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white placeholder-gray-400 w-80"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Programs Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                  PROGRAM ↕
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                  COHORT ↕
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                  MENTORS
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                  SESSIONS
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                  ACTIONS
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
                    <div className="text-gray-300">{program.cohort}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-white">{program.mentors}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-white">{program.sessions}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(program.status)}`}>
                      {program.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-white transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white transition-colors duration-200">
                        <MessageSquare className="h-4 w-4" />
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

      {/* Reports & Analytics Section */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded"></div>
            </div>
            <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200">
              <span>CSV</span>
            </button>
            <button className="flex items-center space-x-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200">
              <span>PDF</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Program</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option>All Programs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Cohort</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFC540]">
              <option>All Cohorts</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mentor</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFC540]">
              <option>All Mentors</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FFC540]">
              <option>Last 30 days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsView;