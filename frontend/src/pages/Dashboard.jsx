import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import { formatDate, isOverdue } from '../utils/formatDate';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard')
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!data) return null;

  const priorityColors = {
    High: 'text-red-600 bg-red-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    Low: 'text-green-600 bg-green-50',
  };

  const statusColors = {
    Todo: 'text-gray-600 bg-gray-100',
    'In Progress': 'text-blue-600 bg-blue-50',
    Done: 'text-green-600 bg-green-50',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Tasks"
          value={data.stats.totalTasks}
          icon={ClipboardDocumentListIcon}
          color="blue"
        />
        <StatsCard
          title="Completed"
          value={data.stats.completedTasks}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatsCard
          title="In Progress"
          value={data.stats.inProgressTasks}
          icon={ClockIcon}
          color="yellow"
        />
        <StatsCard
          title="Overdue"
          value={data.stats.overdueTasks}
          icon={ExclamationTriangleIcon}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Tasks</h2>
          {data.myTasks.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No tasks assigned to you</p>
          ) : (
            <div className="space-y-3">
              {data.myTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/projects/${task.projectId?._id || task.projectId}/board`}
                  className="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        statusColors[task.status]
                      }`}
                    >
                      {task.status}
                    </span>
                    {task.dueDate && (
                      <span
                        className={`text-xs ${
                          isOverdue(task.dueDate, task.status)
                            ? 'text-red-600 font-medium'
                            : 'text-gray-400'
                        }`}
                      >
                        Due {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                  {task.projectId?.name && (
                    <p className="text-xs text-gray-400 mt-1">{task.projectId.name}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <RecentActivity activities={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}
