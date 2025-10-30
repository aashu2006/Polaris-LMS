import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from 'lucide-react';

const MentorAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('attendance');

  const analyticsData = {
    attendance: {
      current: 94,
      previous: 87,
      trend: 'up',
      data: [85, 88, 92, 89, 94, 96, 94]
    },
    engagement: {
      current: 78,
      previous: 72,
      trend: 'up',
      data: [70, 72, 75, 78, 76, 80, 78]
    },
    completion: {
      current: 89,
      previous: 85,
      trend: 'up',
      data: [82, 85, 87, 89, 88, 91, 89]
    }
  };

  const studentPerformance = [
    { name: 'Alice Johnson', attendance: 98, engagement: 92, completion: 95, githubPRs: 23 },
    { name: 'Bob Smith', attendance: 85, engagement: 78, completion: 82, githubPRs: 15 },
    { name: 'Carol Davis', attendance: 100, engagement: 95, completion: 98, githubPRs: 31 },
    { name: 'David Wilson', attendance: 75, engagement: 65, completion: 70, githubPRs: 8 },
    { name: 'Eva Martinez', attendance: 92, engagement: 88, completion: 90, githubPRs: 19 },
    { name: 'Frank Chen', attendance: 88, engagement: 82, completion: 85, githubPRs: 12 }
  ];

  const sessionStats = [
    { date: '2024-01-15', title: 'React Fundamentals', attendance: 8, duration: '2h 15m', engagement: 92 },
    { date: '2024-01-14', title: 'State Management', attendance: 7, duration: '1h 45m', engagement: 88 },
    { date: '2024-01-13', title: 'JavaScript ES6+', attendance: 6, duration: '2h 30m', engagement: 95 },
    { date: '2024-01-12', title: 'API Integration', attendance: 7, duration: '1h 30m', engagement: 85 }
  ];

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 75) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-1">Track your teaching performance and student progress.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <button className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(analyticsData).map(([key, data]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 capitalize">{key}</h3>
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">{data.current}%</span>
              <div className={`flex items-center space-x-1 text-sm ${
                data.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-4 w-4" />
                <span>+{data.current - data.previous}%</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">vs previous period</div>
          </div>
        ))}
      </div>

      {/* Student Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Student Performance</h2>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GitHub PRs
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentPerformance.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-yellow-400 font-bold text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(student.attendance)}`}
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(student.attendance)}`}>
                        {student.attendance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(student.engagement)}`}
                          style={{ width: `${student.engagement}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(student.engagement)}`}>
                        {student.engagement}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(student.completion)}`}
                          style={{ width: `${student.completion}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(student.completion)}`}>
                        {student.completion}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{student.githubPRs}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Session Analytics</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {sessionStats.map((session, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{session.title}</h3>
                  <span className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString()}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Attendance:</span>
                    <p className="font-medium">{session.attendance}/8 students</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{session.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Engagement:</span>
                    <p className={`font-medium ${getPerformanceColor(session.engagement)}`}>
                      {session.engagement}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAnalytics;