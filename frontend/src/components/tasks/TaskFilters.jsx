import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function TaskFilters({ filters, onChange, members }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        className="input-field w-auto text-sm"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <select
        className="input-field w-auto text-sm"
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
      >
        <option value="">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <select
        className="input-field w-auto text-sm"
        value={filters.assignedTo}
        onChange={(e) => onChange({ ...filters, assignedTo: e.target.value })}
      >
        <option value="">All Assignees</option>
        {members?.map((m) => {
          const u = m.user || m;
          return (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          );
        })}
      </select>

      {(filters.status || filters.priority || filters.assignedTo) && (
        <button
          onClick={() => onChange({ status: '', priority: '', assignedTo: '' })}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
