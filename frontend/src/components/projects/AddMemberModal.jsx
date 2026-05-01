import { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AddMemberModal({ projectId, existingMembers, onClose, onMemberAdded }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [role, setRole] = useState('member');

  const existingIds = existingMembers.map((m) => m.user?._id || m.user);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const { data } = await api.get(`/users?search=${encodeURIComponent(search)}`);
      setResults(data.filter((u) => !existingIds.includes(u._id)));
    } catch {
      toast.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (userId) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/members`, {
        userId,
        role,
      });
      toast.success('Member added');
      onMemberAdded(data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Add Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input-field pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="btn-primary" disabled={searching}>
              Search
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {searching && <p className="text-sm text-gray-400 text-center py-4">Searching...</p>}
            {!searching && results.length === 0 && search && (
              <p className="text-sm text-gray-400 text-center py-4">No users found</p>
            )}
            {results.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-700">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(user._id)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
