import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../services/api';

const MentorSummaryCards: React.FC = () => {
  const api = useApi();
  const { token } = useAuth();
  const [totals, setTotals] = useState({
    totalClasses: 0,
    totalCourses: 0,
    avgAttendance: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const [classesJson, coursesJson, attendanceJson] = await Promise.all([
          api.lms.mentors.getTotalClasses(),
          api.lms.mentors.getTotalCourses(),
          api.lms.mentors.getAvgAttendance(),
        ]);

        const next = {
          totalClasses: Number(classesJson?.data?.total_classes ?? 0),
          totalCourses: Number(coursesJson?.data?.total_programs ?? 0),
          avgAttendance: Number(attendanceJson?.average_attendance ?? 0),
        };
        if (isMounted) setTotals(next);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load cards');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [api, token]);

  const cards = [
    {
      title: 'Total Classess',
      value: loading ? '—' : String(totals.totalClasses),
      change: '12',
      changeType: 'positive' as const,
      icon: BookOpen,
      description: 'Active learners'
    },
    {
      title: 'Active Programs',
      value: loading ? '—' : String(totals.totalCourses),
      change: '8',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Currently teaching'
    },
    {
      title: 'GitHub Contributions',
      value: '0',
      change: '0%',
      changeType: 'positive' as const,
      icon: Calendar,
      description: 'This week'
    },
    {
      title: 'Avg Attendance',
      value: loading ? '—' : `${totals.avgAttendance}%`,
      change: '2',
      changeType: 'positive' as const,
      icon: Award,
      description: 'Student engagement'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {error && (
        <div className="md:col-span-2 lg:col-span-4 text-red-400 text-sm">{error}</div>
      )}
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-6 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <Icon className="h-6 w-6 text-gray-400" />
              <div className={`flex items-center text-sm font-medium ${
                card.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
                {/* <span className="mr-1">{card.changeType === 'positive' ? '↗' : '↘'}</span> */}
                {/* <span>{card.change}</span> */}
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

export default MentorSummaryCards;