import React, { useState } from 'react';
import { Plus, Search, Filter, Users, Star, Mail, Phone } from 'lucide-react';

interface MentorsViewProps {
  onOpenAssignmentModal: () => void;
}

const MentorsView: React.FC<MentorsViewProps> = ({ onOpenAssignmentModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');

  const mentors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@polarislabs.com',
      phone: '+1 (555) 123-4567',
      expertise: ['Full Stack Development', 'React', 'Node.js'],
      programs: ['Full Stack Development'],
      students: 12,
      maxStudents: 15,
      rating: 4.9,
      status: 'active',
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@polarislabs.com',
      phone: '+1 (555) 234-5678',
      expertise: ['Data Science', 'Python', 'Machine Learning'],
      programs: ['Data Science Bootcamp'],
      students: 8,
      maxStudents: 12,
      rating: 4.8,
      status: 'active',
      joinDate: '2023-03-20'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@polarislabs.com',
      phone: '+1 (555) 345-6789',
      expertise: ['UI/UX Design', 'Figma', 'Design Systems'],
      programs: ['UI/UX Design Track'],
      students: 10,
      maxStudents: 14,
      rating: 4.7,
      status: 'active',
      joinDate: '2023-02-10'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@polarislabs.com',
      phone: '+1 (555) 456-7890',
      expertise: ['DevOps', 'AWS', 'Docker'],
      programs: ['Full Stack Development'],
      students: 6,
      maxStudents: 10,
      rating: 4.6,
      status: 'inactive',
      joinDate: '2023-04-05'
    }
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProgram = filterProgram === 'all' || mentor.programs.includes(filterProgram);
    return matchesSearch && matchesProgram;
  });

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mentors</h1>
          <p className="text-gray-400 mt-1">Manage mentors and their student assignments.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onOpenAssignmentModal}
            className="flex items-center space-x-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <Users className="h-4 w-4" />
            <span>Assign Students</span>
          </button>
          <button className="flex items-center space-x-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Add Mentor</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search mentors by name or expertise..."
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
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:bg-gray-750 transition-colors duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{mentor.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="h-4 w-4 text-[#FFC540] fill-current" />
                  <span className="text-sm text-gray-400">{mentor.rating}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    mentor.status === 'active' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {mentor.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>{mentor.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{mentor.phone}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-white mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-1">
                {mentor.expertise.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Students</span>
                <span className="font-medium text-white">{mentor.students}/{mentor.maxStudents}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-[#FFC540] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(mentor.students / mentor.maxStudents) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                View Profile
              </button>
              <button className="text-sm bg-[#FFC540] text-black px-3 py-1 rounded-lg hover:bg-[#e6b139] transition-colors duration-200">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No mentors found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or add a new mentor.</p>
        </div>
      )}
    </div>
  );
};

export default MentorsView;