import { timeAgo } from '../../utils/formatDate';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <ClockIcon className="h-10 w-10 mx-auto mb-2" />
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity._id}
          className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
        >
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
            {activity.userId?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800">
              <span className="font-medium">{activity.userId?.name}</span>{' '}
              {activity.action}
              {activity.taskId && (
                <span className="text-blue-600"> {activity.taskId.title}</span>
              )}
            </p>
            {activity.details && (
              <p className="text-xs text-gray-500 mt-0.5">{activity.details}</p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">
              {timeAgo(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
