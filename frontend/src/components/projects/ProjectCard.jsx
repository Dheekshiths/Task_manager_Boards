import { Link } from 'react-router-dom';
import { FolderIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="card hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
            <FolderIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
              {project.description || 'No description'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <UsersIcon className="h-4 w-4" />
          <span>{project.members?.length || 0} members</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {project.taskCount || 0} tasks
        </div>
      </div>
    </Link>
  );
}
