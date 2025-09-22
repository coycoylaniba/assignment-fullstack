import type { Priority, Task } from "@/api/tasks";
import { deleteTask } from "@/api/tasks";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (taskId: number, updates: Partial<Task>) => void;
  onTaskDeleted: (taskId: number) => void;
  setSortBy: (filter: "due_date" | "priority" | "title") => void;
  sortBy: "due_date" | "priority" | "title";
  setSortOrder: (filter: "asc" | "desc") => void;
  sortOrder: "asc" | "desc";
  tasksCount: number;
  totalPages: number;
}

function TaskList({
  tasks,
  tasksCount,
  onTaskUpdated,
  onTaskDeleted,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  totalPages,
}: TaskListProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const handlePriorityChange = (taskId: number, newPriority: Priority) => {
    onTaskUpdated(taskId, { priority: newPriority });
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      onTaskDeleted(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const pages = Array.from({ length: totalPages }).map((_v, i) => i + 1);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "due_date" | "priority" | "title")
          }
        >
          <option value="due_date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <span style={{ marginLeft: "10px" }}>
          Showing {tasks.length} of {tasksCount} tasks
        </span>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={selectedTaskId === task.id}
            onClick={handleTaskClick}
            onPriorityChange={handlePriorityChange}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {pages.length > 1 ? (
        <div className="pagination">
          {pages.map((p) => (
            <Link key={`page-${p}`} to={`/`} search={{ page: p }}>
              {p}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onClick: (taskId: number) => void;
  onPriorityChange: (taskId: number, newPriority: Priority) => void;
  onDelete: (taskId: number) => void | Promise<void>;
}

const TaskItem = ({
  task,
  isSelected,
  onClick,
  onPriorityChange,
  onDelete,
}: TaskItemProps) => {
  return (
    <div
      className={`task-item ${isSelected ? "selected" : ""}`}
      data-task-id={task.id}
      onClick={() => onClick(task.id)}
    >
      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <select
          className={`priority ${task.priority}`}
          value={task.priority}
          onChange={(e) =>
            onPriorityChange(task.id, e.target.value as Priority)
          }
          onClick={(e) => e.stopPropagation()}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          style={{
            padding: "5px 10px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskList;
