import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { timeAgo } from '../../utils/formatDate';
import { PaperAirplaneIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function CommentSection({ taskId, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/tasks/${taskId}/comments`);
      setComments(data);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    if (taskId) fetchComments();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/tasks/${taskId}/comments`, { text });
      setComments([...comments, data]);
      setText('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/tasks/${taskId}/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Comments</h4>

      <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
        {comments.length === 0 && (
          <p className="text-xs text-gray-400">No comments yet</p>
        )}
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-2 group">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 shrink-0">
              {comment.userId?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {comment.userId?.name}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {timeAgo(comment.createdAt)}
                </span>
                {comment.userId?._id === currentUserId && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="input-field text-sm"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="btn-primary px-3"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
