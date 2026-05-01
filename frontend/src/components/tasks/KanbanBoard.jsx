import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';

const STATUSES = ['Todo', 'In Progress', 'Done'];

export default function KanbanBoard({ tasks, onStatusChange, onTaskClick }) {
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    onStatusChange(draggableId, newStatus);
  };

  const groupedTasks = {};
  STATUSES.forEach((status) => {
    groupedTasks[status] = tasks.filter((t) => t.status === status);
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={groupedTasks[status]}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
