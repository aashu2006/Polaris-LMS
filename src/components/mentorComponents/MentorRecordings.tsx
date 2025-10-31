import React, { useState } from 'react';
import { Search, Filter, Play, Download, Calendar, Clock, Users, Eye } from 'lucide-react';

const MentorRecordings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const recordings = [
    {
      id: 1,
      title: 'React Fundamentals - Components & Props',
      program: 'Full Stack Development',
      cohort: '2024-A',
      date: '2024-01-15',
      duration: '2h 15m',
      participants: 8,
      views: 24,
      size: '1.2 GB',
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      status: 'processed'
    },
    {
      id: 2,
      title: 'State Management with Redux',
      program: 'Full Stack Development',
      cohort: '2024-A',
      date: '2024-01-14',
      duration: '1h 45m',
      participants: 8,
      views: 18,
      size: '950 MB',
      thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      status: 'processed'
    },
    {
      id: 3,
      title: 'JavaScript ES6+ Features Deep Dive',
      program: 'Full Stack Development',
      cohort: '2024-B',
      date: '2024-01-13',
      duration: '2h 30m',
      participants: 6,
      views: 31,
      size: '1.4 GB',
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      status: 'processed'
    },
    {
      id: 4,
      title: 'API Integration Workshop',
      program: 'Full Stack Development',
      cohort: '2024-A',
      date: '2024-01-12',
      duration: '1h 30m',
      participants: 7,
      views: 15,
      size: '800 MB',
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      status: 'processing'
    }
  ];

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = filterProgram === 'all' || recording.program === filterProgram;
    const matchesDate = filterDate === 'all' || 
      (filterDate === 'week' && new Date(recording.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterDate === 'month' && new Date(recording.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesProgram && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session Recordings</h1>
          <p className="text-gray-600 mt-1">Access and manage your recorded sessions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
            <Download className="h-4 w-4" />
            <span>Bulk Download</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search recordings by title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
            >
              <option value="all">All Programs</option>
              <option value="Full Stack Development">Full Stack Development</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecordings.map((recording) => (
          <div key={recording.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative">
              <img 
                src={recording.thumbnail} 
                alt={recording.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <button className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Play className="h-4 w-4" />
                  <span>Play</span>
                </button>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(recording.status)}`}>
                  {recording.status}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {recording.duration}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recording.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{recording.program}</span>
                  <span>Cohort {recording.cohort}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(recording.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{recording.participants}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{recording.views} views</span>
                  </div>
                  <span className="text-xs text-gray-500">{recording.size}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
                  <Play className="h-4 w-4" />
                  <span>Watch</span>
                </button>
                <button className="flex items-center space-x-2 text-sm bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recording Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Recordings</p>
              <p className="text-2xl font-bold text-gray-900">{recordings.length}</p>
            </div>
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Play className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{recordings.reduce((sum, r) => sum + r.views, 0)}</p>
            </div>
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Duration</p>
              <p className="text-2xl font-bold text-gray-900">8h 20m</p>
            </div>
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">4.3 GB</p>
            </div>
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Download className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorRecordings;