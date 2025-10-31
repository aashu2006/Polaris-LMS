import React, { useState } from 'react';
import { X, Search, Users, UserCheck, UserX } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  program: string;
  currentMentor?: string;
}

interface Mentor {
  id: number;
  name: string;
  email: string;
  expertise: string[];
  currentStudents: number;
  maxStudents: number;
}

interface StudentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentAssignmentModal: React.FC<StudentAssignmentModalProps> = ({ isOpen, onClose }) => {
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const mentors: Mentor[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@email.com',
      expertise: ['React', 'Node.js', 'TypeScript'],
      currentStudents: 8,
      maxStudents: 12
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      expertise: ['Python', 'Machine Learning', 'Data Science'],
      currentStudents: 6,
      maxStudents: 10
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      expertise: ['UI/UX', 'Figma', 'Design Systems'],
      currentStudents: 4,
      maxStudents: 8
    }
  ];

  const students: Student[] = [
    {
      id: 1,
      name: 'Alice Smith',
      email: 'alice.smith@email.com',
      program: 'Full Stack Development',
      currentMentor: 'Dr. Sarah Johnson'
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob.wilson@email.com',
      program: 'Data Science Bootcamp'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      program: 'UI/UX Design Track',
      currentMentor: 'Emily Rodriguez'
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david.brown@email.com',
      program: 'Full Stack Development'
    },
    {
      id: 5,
      name: 'Eva Martinez',
      email: 'eva.martinez@email.com',
      program: 'Data Science Bootcamp'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignStudents = () => {
    if (selectedMentor && selectedStudents.length > 0) {
      const mentor = mentors.find(m => m.id === selectedMentor);
      console.log(`Assigning ${selectedStudents.length} students to ${mentor?.name}`);
      // Here you would make the API call to assign students
      onClose();
      setSelectedStudents([]);
      setSelectedMentor(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-jakarta">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Assign Students to Mentor</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Mentor Selection Panel */}
          <div className="w-1/3 border-r border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Select Mentor</h3>
            <div className="space-y-3">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedMentor === mentor.id
                      ? 'border-[#FFC540] bg-gray-700'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedMentor(mentor.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{mentor.name}</h4>
                    <div className="text-xs text-gray-400">
                      {mentor.currentStudents}/{mentor.maxStudents}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{mentor.email}</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          mentor.currentStudents >= mentor.maxStudents
                            ? 'bg-red-500'
                            : mentor.currentStudents / mentor.maxStudents > 0.8
                            ? 'bg-[#FFC540]'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(mentor.currentStudents / mentor.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Selection Panel */}
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Select Students</h3>
              <div className="text-sm text-gray-400">
                {selectedStudents.length} selected
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent w-full text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(100%-120px)]">
              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedStudents.includes(student.id)
                        ? 'border-[#FFC540] bg-gray-700'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => handleStudentToggle(student.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#FFC540] rounded-full flex items-center justify-center text-black font-bold text-sm">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{student.name}</h4>
                            <p className="text-sm text-gray-400">{student.email}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-400">{student.program}</span>
                          {student.currentMentor && (
                            <div className="flex items-center text-xs text-gray-400">
                              <Users className="h-3 w-3 mr-1" />
                              Current: {student.currentMentor}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {selectedStudents.includes(student.id) ? (
                          <UserCheck className="h-5 w-5 text-[#FFC540]" />
                        ) : (
                          <UserX className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {selectedMentor && selectedStudents.length > 0 && (
                <span>
                  Assigning {selectedStudents.length} student(s) to{' '}
                  {mentors.find(m => m.id === selectedMentor)?.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignStudents}
                disabled={!selectedMentor || selectedStudents.length === 0}
                className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                  selectedMentor && selectedStudents.length > 0
                    ? 'bg-[#FFC540] text-black hover:bg-[#e6b139]'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Assign Students
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentModal;