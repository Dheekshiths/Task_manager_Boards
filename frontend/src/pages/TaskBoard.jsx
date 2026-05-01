import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  optimisticStatusUpdate,
} from '../store/slices/taskSlice';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskModal from '../components/tasks/TaskModal';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TaskBoard() {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [project, setProject] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', assignedTo: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    api
      .get(`/projects/${projectId}`)
      .then(({ data }) => setProject(data))
      .catch(() => toast.error('Failed to load project'));
  }, [projectId]);

  useEffect(() => {
    dispatch(fetchTasks({ projectId, filters }));
  }, [dispatch, projectId, filters]);

  const handleStatusChange = async (taskId, newStatus) => {
    dispatch(optimisticStatusUpdate({ taskId, status: newStatus }));
    try {
      await dispatch(updateTaskStatus({ projectId, taskId, status: newStatus })).unwrap();
    } catch {
      dispatch(fetchTasks({ projectId, filters }));
      toast.error('Failed to update status');
    }
  };

  const handleSaveTask = async (formData, taskId) => {
    try {
      if (taskId) {
        await dispatch(updateTask({ projectId, taskId, taskData: formData })).unwrap();
        toast.success('Task updated');
      } else {
        await dispatch(createTask({ projectId, taskData: formData })).unwrap();
        toast.success('Task created');
      }
    } catch (err) {
      toast.error(err || 'Failed to save task');
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await dispatch(deleteTask({ projectId, taskId })).unwrap();
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete task');
    }
  };

  const openModal = (task = null) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to={`/projects/${projectId}`}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {project?.name || 'Task Board'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tasks.length} tasks</p>
          </div>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilters
          filters={filters}
          onChange={setFilters}
          members={project?.members}
        />
      </div>

      {/* Board */}
      {loading && tasks.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <KanbanBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onTaskClick={openModal}
        />
      )}

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={selectedTask}
          projectId={projectId}
          members={project?.members}
          currentUserId={user?._id}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}
