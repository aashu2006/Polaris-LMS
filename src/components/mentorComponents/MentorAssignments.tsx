import React, { useState } from 'react';

interface UploadAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadAssignmentModal: React.FC<UploadAssignmentModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [batch, setBatch] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const onUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Wire actual API later
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upload Assignment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={onUpload} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Assignment Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., React Hooks Assignment" className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Batch *</label>
            <select value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent">
              <option value="" disabled>Select Batch</option>
              <option value="React.js">React.js</option>
              <option value="Node.js">Node.js</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., React" className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief description of the assignment" className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Instructions</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} placeholder="Additional instructions" className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC540] focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File *</label>
            <div className="flex items-center justify-between gap-3">
              <input type="file" onChange={onFileChange} className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FFC540] file:text-black hover:file:bg-[#e6b139]" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-300">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-[#FFC540] text-black font-semibold hover:bg-[#e6b139]">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MentorAssignments: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Assignments</h2>
          <p className="text-gray-400 mt-1">Create and manage assignments for your students.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#FFC540] text-black px-4 py-2 rounded-lg hover:bg-[#e6b139] transition-colors duration-200">
          <span>＋</span>
          <span>Upload Assignment</span>
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">All Assignments</h3>
        <div className="h-64 bg-white/95 rounded-xl flex flex-col items-center justify-center text-gray-500">
          <div className="text-5xl mb-3">📄</div>
          <p className="font-medium">No assignments yet. Create your first assignment!</p>
        </div>
      </div>

      <UploadAssignmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MentorAssignments;


