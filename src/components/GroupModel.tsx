import React, { useState, useEffect } from 'react';
import { X, Users, MessageCircle, Calendar, BookOpen, Loader2 } from 'lucide-react';
// Assuming your Group type is defined in '../types'
import type { Group } from '../types'; 
// Assuming useApi is imported from '../services/api'
// import { useApi } from '../services/api'; 

// Define the props specific to the Group modal
interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  mode: 'view' | 'edit'; // 'edit' covers both create (when group is null) and actual edit
}

const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose, group, mode }) => {
  
  // State for the data being edited/viewed
  const [editData, setEditData] = useState<Partial<Group>>({
    id: '',
    name: '',
    description: '',
    memberCount: 0,
    status: 'active',
    startDate: '',
    endDate: '',
    assignedMentor: null
  });

  // State initialization and update on prop change
  useEffect(() => {
    if (group) {
      setEditData(group);
    } else {
      setEditData({
        id: '',
        name: '',
        description: '',
        memberCount: 0,
        status: 'active',
        startDate: '',
        endDate: '',
        assignedMentor: null
      });
    }
  }, [group, isOpen]);

  const [showMentorDropdown, setShowMentorDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Mock API usage and data for demonstration (replace with actual api = useApi() if available)
  const api: any = { 
    lms: { 
        adminGroups: { 
            createGroup: async (data: any) => ({ message: 'Group created successfully.' }),
            // Assuming an endpoint for fetching group members would be here
        }
    }
  };
  
  // Mock Mentor Data (similar to ProgramModal)
  const mockMentors = [
    { id: '1', name: 'Dr. Sarah Wilson', status: 'available' },
    { id: '2', name: 'Prof. Michael Chen', status: 'busy' },
    { id: '3', name: 'Ms. Emily Rodriguez', status: 'available' },
    { id: '4', name: 'Dr. James Thompson', status: 'offline' }
  ];

  // Mock Group Members Data (for 'view' mode)
  const mockGroupMembers = [
    { id: 'm1', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'm2', name: 'Bob Williams', email: 'bob@example.com' },
    { id: 'm3', name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 'm4', name: 'Diana Prince', email: 'diana@example.com' },
  ];

  const filteredMentors = mockMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isCreating = mode === 'edit' && !group;

  const handleSave = async () => {
    if (isCreating || mode === 'edit') {
      try {
        setLoading(true);

        const groupData = {
          groupName: editData.name,
          description: editData.description,
          memberCount: editData.memberCount,
          startDate: editData.startDate,
          endDate: editData.endDate,
          mentorId: editData.assignedMentor?.id,
          status: editData.status,
        };

        // Simulate API call for creation/update
        const result = await api.lms.adminGroups.createGroup(groupData); 

        if (result.message.includes('success')) {
          alert(`Group ${isCreating ? 'created' : 'updated'} successfully!`);
          onClose();
        } else {
          alert('Failed to save group: ' + (result.error || 'Unknown error'));
        }
      } catch (error: any) {
        alert('Error saving group: ' + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      onClose();
    }
  };

  const handleMentorSelect = (mentor: any) => {
    setEditData({ ...editData, assignedMentor: mentor });
    setShowMentorDropdown(false);
    setSearchTerm('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Group-specific title logic
  const getModalTitle = () => {
    switch (mode) {
      case 'edit': return group ? 'Edit Group' : 'Add New Group';
      case 'view': return 'Group Details';
      default: return 'Group';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-center min-h-screen px-6 py-8">
        <div className="modal-backdrop" onClick={onClose} />

        <div className="modal-content relative w-full max-w-4xl max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-800">
            <h3 className="text-xl font-bold text-white">{getModalTitle()}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-gray-800/50 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-8 overflow-y-auto max-h-[calc(95vh-120px)]">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
              
              {/* Group Name */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Group Name
                </label>
                {mode === 'view' ? (
                  <div className="h-12 flex items-center px-4 bg-gray-800 rounded-lg text-white">
                    {group?.name || 'N/A'}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full h-12 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                    placeholder="Enter group name"
                    required
                  />
                )}
              </div>

              {/* Group Description */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Description
                </label>
                {mode === 'view' ? (
                  <div className="min-h-[4rem] flex items-center px-4 py-2 bg-gray-800 rounded-lg text-white">
                    {group?.description || 'N/A'}
                  </div>
                ) : (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full min-h-[5rem] px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                    placeholder="Brief description of the group"
                    rows={3}
                    required
                  />
                )}
              </div>

              {/* Form Fields Grid - Assigned Mentor, Member Count, Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Assigned Mentor */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 relative">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Users className="w-4 h-4 inline mr-2" />
                    Assigned Mentor
                  </label>
                  {mode === 'view' ? (
                    <div className="h-12 flex items-center px-4 bg-gray-800 rounded-lg text-white">
                      {group?.assignedMentor?.name || (
                        <span className="text-gray-500 italic">No mentor assigned</span>
                      )}
                    </div>
                  ) : (
                    <div className="relative z-50">
                      <button
                        type="button"
                        onClick={() => setShowMentorDropdown(!showMentorDropdown)}
                        className="w-full h-12 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200 flex items-center justify-between hover:bg-gray-700/50"
                      >
                        <span className={editData.assignedMentor ? 'text-white' : 'text-gray-400'}>
                          {editData.assignedMentor ? editData.assignedMentor.name : 'Select Mentor'}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showMentorDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-56 overflow-y-auto">
                          <div className="p-3 border-b border-gray-700">
                            <input
                              type="text"
                              placeholder="Search mentors..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
                            />
                          </div>
                          {filteredMentors.map((mentor) => (
                            <button
                              key={mentor.id}
                              type="button"
                              onClick={() => handleMentorSelect(mentor)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-colors flex items-center justify-between border-b border-gray-700/50 last:border-b-0"
                            >
                              <div className="flex items-center">
                                <div className={`w-2.5 h-2.5 rounded-full mr-3 ${getStatusColor(mentor.status)}`}></div>
                                <span className="text-white font-medium">{mentor.name}</span>
                              </div>
                              {editData.assignedMentor?.id === mentor.id && (
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Member Count */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Users className="w-4 h-4 inline mr-2" />
                    Member Count
                  </label>
                  {mode === 'view' ? (
                    <div className="h-12 flex items-center px-4 bg-gray-800 rounded-lg">
                      <span className="text-2xl font-bold text-white">{group?.memberCount || 0}</span>
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={editData.memberCount}
                      onChange={(e) => setEditData({ ...editData, memberCount: parseInt(e.target.value) || 0 })}
                      className="w-full h-12 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                      placeholder="0"
                      min="0"
                    />
                  )}
                </div>

                {/* Status */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Status
                  </label>
                  {mode === 'view' ? (
                    <div className="h-12 flex items-center px-4 bg-gray-800 rounded-lg">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${group?.status === 'active' ? 'text-green-400 bg-green-400/10' :
                        group?.status === 'completed' ? 'text-yellow-400 bg-yellow-400/10' :
                          'text-gray-400 bg-gray-400/10'
                        }`}>
                        {group?.status ? group.status.charAt(0).toUpperCase() + group.status.slice(1) : 'N/A'}
                      </span>
                    </div>
                  ) : (
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value as Group['status'] })}
                      className="w-full h-12 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Date Fields - Always 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Start Date
                  </label>
                  {mode === 'view' ? (
                    <div className="h-12 flex items-center px-4 bg-gray-800 rounded-lg text-white">
                      {group?.startDate ? new Date(group.startDate).toLocaleDateString() : 'N/A'}
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={editData.startDate}
                      onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                      className="w-full h-12 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                      required
                    />
                  )}
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    End Date
                  </label>
                  {mode === 'view' ? (
                    <div className="h-12 flex items-center px-4 bg-gray-800 rounded-lg text-white">
                      {group?.endDate ? new Date(group.endDate).toLocaleDateString() : 'N/A'}
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={editData.endDate}
                      onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                      className="w-full h-12 px-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Group Members Section (View Mode) */}
              {mode === 'view' && (
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-yellow-500" />
                      Group Members ({mockGroupMembers.length})
                    </h3>
                    <p className="text-gray-400 text-sm">List of students currently assigned to this group.</p>
                  </div>

                  {/* Members List Table */}
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                            {mockGroupMembers.map((member) => (
                              <tr key={member.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="text-white font-medium">{member.name}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-gray-300 text-sm">{member.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <button className="text-yellow-500 hover:text-yellow-400 flex items-center text-sm">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    Message
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    {mockGroupMembers.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No members found in this group.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {mode !== 'view' && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {group ? 'Saving...' : 'Creating...'}
                      </>
                    ) : (
                      group ? 'Save Changes' : 'Create Group'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;