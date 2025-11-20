import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Filter, Loader2 } from 'lucide-react';
import { useApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const MentorAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { user } = useAuth();
  const userId = user?.id;

  const [analyticsData, setAnalyticsData] = useState({
    attendance: {
      current: 0,
      previous: 0,
      trend: 'up' as 'up' | 'down',
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    engagement: {
      current: 0,
      previous: 0,
      trend: 'up' as 'up' | 'down',
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    completion: {
      current: 0,
      previous: 0,
      trend: 'up' as 'up' | 'down',
      data: [0, 0, 0, 0, 0, 0, 0]
    }
  });

  const [studentPerformance, setStudentPerformance] = useState<any[]>([]);
  const [sessionStats, setSessionStats] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      fetchAnalyticsData();
    }
  }, [userId, dateRange]);

  const fetchAnalyticsData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Fetch mentor stats and sessions
      const [avgAttendanceResponse, sessionsResponse] = await Promise.all([
        api.lms.mentors.getAvgAttendance(),
        api.lms.adminSchedule.getFacultySessions(userId)
      ]);

      const avgAttendance = Number(avgAttendanceResponse?.average_attendance || 0);
      const sessions = sessionsResponse?.data || [];

      // Calculate date range
      const now = new Date();
      const daysBack = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      
      // Filter sessions by date range
      const filteredSessions = sessions.filter((s: any) => {
        const sessionDate = new Date(s.session_datetime);
        return sessionDate >= startDate && sessionDate <= now;
      });

      // Fetch session stats using getSessionAnalytics API
      const sessionStatsPromises = filteredSessions.slice(0, 4).map(async (session: any) => {
        const sessionId = session.id || session.session_id;
        
        // Default values if API fails
        let sessionData = {
          date: session.session_datetime,
          title: session.course_name || 'Session',
          attendance: 0,
          totalStudents: session?.students?.length || session?.student_count || 0,
          duration: session.duration ? `${Math.floor(session.duration / 60)}h ${session.duration % 60}m` : '0m',
          engagement: 0,
          attendancePercentage: 0,
          averageEngagementTime: 0,
          students: [] // Store student data for performance table
        };

        try {
          if (sessionId) {
            // Use getSessionAnalytics API for detailed analytics
            const analyticsResponse = await api.multimedia.attendance.getSessionAnalytics(sessionId);
            
            if (analyticsResponse?.data) {
              const analytics = analyticsResponse.data;
              
              // Format duration from seconds to hours and minutes
              const durationSeconds = analytics.duration || 0;
              const hours = Math.floor(durationSeconds / 3600);
              const minutes = Math.floor((durationSeconds % 3600) / 60);
              const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

              // Format average engagement time
              const avgEngagementSeconds = analytics.averageEngagementTime || 0;
              const engagementMinutes = Math.floor(avgEngagementSeconds / 60);
              
              sessionData = {
                date: new Date(analytics.startTime || session.session_datetime).toISOString(),
                title: analytics.sessionTitle || session.course_name || 'Session',
                attendance: analytics.studentsPresent || 0,
                totalStudents: analytics.totalStudents || 0,
                duration: durationStr,
                engagement: analytics.attendancePercentage || 0, // Use attendance percentage as engagement
                attendancePercentage: analytics.attendancePercentage || 0,
                averageEngagementTime: engagementMinutes,
                students: analytics.students || [] // Store student data
              };
            }
          }
        } catch (err) {
          console.error('Error fetching session analytics:', err);
          // Fallback to basic session data if API fails
        }

        return sessionData;
      });

      const sessionStatsData = await Promise.all(sessionStatsPromises);
      setSessionStats(sessionStatsData);

      // Aggregate student performance data from all sessions
      const studentMap = new Map<string, any>();
      
      sessionStatsData.forEach(session => {
        if (session.students && session.students.length > 0) {
          session.students.forEach((student: any) => {
            const studentId = student.studentId;
            if (!studentMap.has(studentId)) {
              studentMap.set(studentId, {
                name: student.studentName,
                studentId: studentId,
                totalSessions: 0,
                presentSessions: 0,
                totalAttendancePercentage: 0,
                githubPRs: 0 // Placeholder
              });
            }
            
            const studentData = studentMap.get(studentId);
            studentData.totalSessions += 1;
            if (student.isPresent) {
              studentData.presentSessions += 1;
            }
            studentData.totalAttendancePercentage += student.attendancePercentage || 0;
          });
        }
      });

      // Calculate engagement and completion (use attendance percentage) for each student
      const studentPerformanceData = Array.from(studentMap.values()).map(student => {
        const attendancePercentage = student.totalSessions > 0
          ? Math.round((student.presentSessions / student.totalSessions) * 100)
          : 0;
        const avgAttendancePercentage = student.totalSessions > 0
          ? Math.round(student.totalAttendancePercentage / student.totalSessions)
          : 0;

        return {
          name: student.name,
          engagement: avgAttendancePercentage, // Use attendance percentage as engagement
          completion: attendancePercentage, // Use attendance percentage as completion
          githubPRs: student.githubPRs
        };
      });

      setStudentPerformance(studentPerformanceData);

      // Calculate engagement and completion from session analytics (use attendance percentage)
      const sessionAttendancePercentages = sessionStatsData
        .map(s => s.attendancePercentage || s.engagement || 0)
        .filter(p => p > 0);
      
      const calculatedEngagement = sessionAttendancePercentages.length > 0
        ? Math.round(sessionAttendancePercentages.reduce((sum, p) => sum + p, 0) / sessionAttendancePercentages.length)
        : avgAttendance;
      
      const calculatedCompletion = sessionAttendancePercentages.length > 0
        ? Math.round(sessionAttendancePercentages.reduce((sum, p) => sum + p, 0) / sessionAttendancePercentages.length)
        : avgAttendance;

      // Update analytics data - use attendance data for engagement and completion
      setAnalyticsData({
        attendance: {
          current: avgAttendance,
          previous: avgAttendance - 5, // Placeholder - can be calculated from historical data
          trend: 'up',
          data: Array.from({ length: 7 }, () => avgAttendance) // Simplified - can be calculated per day
        },
        engagement: {
          current: calculatedEngagement, // Use attendance percentage from session analytics
          previous: calculatedEngagement - 5,
          trend: 'up',
          data: Array.from({ length: 7 }, () => calculatedEngagement)
        },
        completion: {
          current: calculatedCompletion, // Use attendance percentage from session analytics
          previous: calculatedCompletion - 5,
          trend: 'up',
          data: Array.from({ length: 7 }, () => calculatedCompletion)
        }
      });

    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

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
              {studentPerformance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No student performance data available
                  </td>
                </tr>
              ) : (
                studentPerformance.map((student, index) => (
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
                ))
              )}
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
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Attendance:</span>
                    <p className="font-medium">
                      {session.attendance}
                      {session.totalStudents ? `/${session.totalStudents}` : ''} students
                    </p>
                    {session.attendancePercentage !== undefined && (
                      <p className={`text-xs mt-1 ${getPerformanceColor(session.attendancePercentage)}`}>
                        ({session.attendancePercentage.toFixed(1)}%)
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{session.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Attendance %:</span>
                    <p className={`font-medium ${getPerformanceColor(session.attendancePercentage || session.engagement)}`}>
                      {(session.attendancePercentage || session.engagement).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Engagement:</span>
                    <p className="font-medium">
                      {session.averageEngagementTime > 0 
                        ? `${session.averageEngagementTime} min` 
                        : 'N/A'}
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