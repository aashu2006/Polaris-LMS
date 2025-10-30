import React, { useState } from 'react';
import { Download, Calendar, Filter, BarChart3, TrendingUp } from 'lucide-react';

const ReportsView: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    program: 'all',
    cohort: 'all',
    mentor: 'all',
    dateRange: '30days'
  });

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 mt-1">Generate comprehensive reports and export data.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200">
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Custom Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Program</label>
            <select 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white"
              value={selectedFilters.program}
              onChange={(e) => setSelectedFilters({...selectedFilters, program: e.target.value})}
            >
              <option value="all">All Programs</option>
              <option value="fullstack">Full Stack Development</option>
              <option value="datascience">Data Science Bootcamp</option>
              <option value="uiux">UI/UX Design Track</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Cohort</label>
            <select 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white"
              value={selectedFilters.cohort}
              onChange={(e) => setSelectedFilters({...selectedFilters, cohort: e.target.value})}
            >
              <option value="all">All Cohorts</option>
              <option value="2024-a">Cohort 2024-A</option>
              <option value="2024-b">Cohort 2024-B</option>
              <option value="2024-c">Cohort 2024-C</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mentor</label>
            <select 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white"
              value={selectedFilters.mentor}
              onChange={(e) => setSelectedFilters({...selectedFilters, mentor: e.target.value})}
            >
              <option value="all">All Mentors</option>
              <option value="sarah">Dr. Sarah Johnson</option>
              <option value="michael">Michael Chen</option>
              <option value="emily">Emily Rodriguez</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
            <select 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent text-white"
              value={selectedFilters.dateRange}
              onChange={(e) => setSelectedFilters({...selectedFilters, dateRange: e.target.value})}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4">
          <button className="flex items-center space-x-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200">
            <Filter className="h-4 w-4" />
            <span>Apply Filters</span>
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Report */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Attendance Report</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Overall Attendance</span>
              <span className="font-semibold text-white">87%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
            <div className="text-xs text-gray-500">Based on last 30 days</div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Full Stack Development</span>
              <span className="font-medium text-white">92%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Data Science Bootcamp</span>
              <span className="font-medium text-white">85%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">UI/UX Design Track</span>
              <span className="font-medium text-white">89%</span>
            </div>
          </div>
        </div>

        {/* Performance Report */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Performance Metrics</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Completion Rate</span>
                <span className="font-semibold text-white">78%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Average Grade</span>
                <span className="font-semibold text-white">B+</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-[#FFC540] h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Satisfaction Score</span>
                <span className="font-semibold text-white">4.6/5</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Trends */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Enrollment Trends</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">New Enrollments (This Month)</span>
              <span className="font-semibold text-green-400">+23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Dropouts (This Month)</span>
              <span className="font-semibold text-red-400">-3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Net Growth</span>
              <span className="font-semibold text-white">+20</span>
            </div>
          </div>
        </div>

        {/* Revenue Report */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Revenue Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Monthly Revenue</span>
              <span className="font-semibold text-white">$45,280</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Growth vs Last Month</span>
              <span className="font-semibold text-green-400">+12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Projected Annual</span>
              <span className="font-semibold text-white">$543,360</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;