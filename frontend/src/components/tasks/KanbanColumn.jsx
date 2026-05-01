import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const statusColors = {
  Todo: 'bg-gray-500',
  'In Progress': 'bg-blue-500',
  Done: 'bg-green-500',
};

export default function KanbanColumn({ status, tasks, onTaskClick }) {
  return (
    <div className="flex-1 min-w-[300px] bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{status}</h3>
        <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full ml-auto">
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[200px] rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <TaskCard
                    task={task}
                    onClick={() => onTaskClick(task)}
                    provided={provided}
                    isDragging={snapshot.isDragging}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
