import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import AddMemberModal from '../components/projects/AddMemberModal';
import toast from 'react-hot-toast';
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
      setEditForm({ name: data.name, description: data.description });
    } catch {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const isAdmin = project?.members?.some(
    (m) => (m.user?._id || m.user) === user?._id && m.role === 'admin'
  );

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/projects/${id}`, editForm);
      setProject(data);
      setEditing(false);
      toast.success('Project updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project and all its tasks? This cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      const { data } = await api.delete(`/projects/${id}/members/${userId}`);
      setProject(data);
      toast.success('Member removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div>
      {/* Header */}
      <div className="card mb-6">
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              className="input-field text-xl font-bold"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
            <textarea
              className="input-field"
              rows={2}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{project.description || 'No description'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/projects/${id}/board`}
                  className="btn-primary flex items-center gap-2"
                >
                  <ViewColumnsIcon className="h-4 w-4" />
                  Task Board
                </Link>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Members */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Members ({project.members?.length || 0})
          </h2>
          {isAdmin && (
            <button
              onClick={() => setShowAddMember(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <UserPlusIcon className="h-4 w-4" />
              Add Member
            </button>
          )}
        </div>

        <div className="space-y-3">
          {project.members?.map((member) => {
            const memberUser = member.user;
            const memberId = memberUser?._id || memberUser;
            return (
              <div
                key={memberId}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {memberUser?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {memberUser?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{memberUser?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      member.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {member.role}
                  </span>
                  {isAdmin && memberId !== project.createdBy && memberId !== user._id && (
                    <button
                      onClick={() => handleRemoveMember(memberId)}
                      className="text-gray-400 hover:text-red-600"
                      title="Remove member"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          projectId={id}
          existingMembers={project.members || []}
          onClose={() => setShowAddMember(false)}
          onMemberAdded={(updatedProject) => setProject(updatedProject)}
        />
      )}
    </div>
  );
}
