import { formatDate, isOverdue } from '../../utils/formatDate';
import { CalendarIcon } from '@heroicons/react/24/outline';

const priorityColors = {
  High: 'border-l-red-500',
  Medium: 'border-l-yellow-500',
  Low: 'border-l-green-500',
};

const priorityBadge = {
  High: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Low: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function TaskCard({ task, onClick, provided, isDragging }) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={onClick}
      className={`bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 border-l-4 ${
        priorityColors[task.priority]
      } p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''
      }`}
    >
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">{task.title}</p>

      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            priorityBadge[task.priority]
          }`}
        >
          {task.priority}
        </span>

        {task.assignedTo && (
          <div className="flex items-center gap-1.5" title={task.assignedTo.name}>
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-medium">
              {task.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[80px] truncate">
              {task.assignedTo.name}
            </span>
          </div>
        )}
      </div>

      {task.dueDate && (
        <div
          className={`flex items-center gap-1 mt-2 text-xs ${
            overdue ? 'text-red-600 font-medium' : 'text-gray-400'
          }`}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          {formatDate(task.dueDate)}
          {overdue && <span className="ml-1">(overdue)</span>}
        </div>
      )}
    </div>
  );
}
