import React, { useState } from 'react';
import { Plus, Search, Filter, Users, Mail, Phone, Calendar, BookOpen } from 'lucide-react';

const StudentsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      program: 'Full Stack Development',
      cohort: '2024-A',
      mentor: 'Dr. Sarah Johnson',
      status: 'active',
      progress: 75,
      enrollmentDate: '2024-01-15',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 234-5678',
      program: 'Data Science Bootcamp',
      cohort: '2024-B',
      mentor: 'Michael Chen',
      status: 'active',
      progress: 60,
      enrollmentDate: '2024-02-01',
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 345-6789',
      program: 'UI/UX Design Track',
      cohort: '2024-A',
      mentor: 'Emily Rodriguez',
      status: 'completed',
      progress: 100,
      enrollmentDate: '2024-01-10',
      lastActivity: '1 week ago'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 456-7890',
      program: 'Full Stack Development',
      cohort: '2024-B',
      mentor: 'Dr. Sarah Johnson',
      status: 'inactive',
      progress: 30,
      enrollmentDate: '2024-03-01',
      lastActivity: '2 weeks ago'
    },
    {
      id: 5,
      name: 'Mike Brown',
      email: 'mike.brown@email.com',
      phone: '+1 (555) 567-8901',
      program: 'Data Science Bootcamp',
      cohort: '2024-C',
      mentor: 'Michael Chen',
      status: 'active',
      progress: 45,
      enrollmentDate: '2024-03-15',
      lastActivity: '3 hours ago'
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-300';
      case 'completed':
        return 'bg-blue-900 text-blue-300';
      case 'inactive':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-[#FFC540]';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Students</h1>
          <p className="text-gray-400 mt-1">Manage student enrollments and track their progress.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200">
            <Users className="h-4 w-4" />
            <span>Bulk Upload</span>
          </button>
          <button className="flex items-center space-x-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white"
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
            >
              <option value="all">All Programs</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Data Science Bootcamp">Data Science Bootcamp</option>
              <option value="UI/UX Design Track">UI/UX Design Track</option>
            </select>
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-400 uppercase tracking-wider text-sm">Student</th>
                <th className="text-left py-4 px-6 font-medium text-gray-400 uppercase tracking-wider text-sm">Program</th>
                <th className="text-left py-4 px-6 font-medium text-gray-400 uppercase tracking-wider text-sm">Mentor</th>
                <th className="text-left py-4 px-6 font-medium text-gray-400 uppercase tracking-wider text-sm">Progress</th>
                <th className="text-left py-4 px-6 font-medium text-gray-400 uppercase tracking-wider text-sm">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-400 uppercase tracking-wider text-sm">Last Activity</th>
                <th className="text-left py-4 px-6 font-medium text-gray-400 uppercase tracking-wider text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-750 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-white">{student.name}</div>
                      <div className="text-sm text-gray-400 flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{student.email}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{student.phone}</span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-white">{student.program}</div>
                      <div className="text-sm text-gray-400">Cohort {student.cohort}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-white">{student.mentor}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(student.progress)}`}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-white">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-400">{student.lastActivity}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                        View
                      </button>
                      <button className="text-sm text-[#FFC540] hover:text-[#e6b139] transition-colors duration-200">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No students found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or add a new student.</p>
        </div>
      )}
    </div>
  );
};

export default StudentsView;