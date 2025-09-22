import { fetchTasks, type Task } from "@/api/tasks";
import TaskForm from "@/components/assessment/TaskForm";
import TaskList from "@/components/assessment/TaskList";
import TaskStats from "@/components/assessment/TaskStats";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<"due_date" | "priority" | "title">(
    "due_date"
  );
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    loadTasks();
  }, [search, sortBy]);

  useEffect(() => {
    const to = setTimeout(() => {
      setSearch(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(to);
    };
  }, [searchTerm]);

  const loadTasks = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetchTasks({ search: searchTerm, sortBy });
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask: Task): void => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskUpdated = (taskId: number, updates: Partial<Task>): void => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const handleTaskDeleted = (taskId: number): void => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="app">
      <h1>Task Management Assessment</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="main-content">
        <div className="left-panel">
          <TaskForm onTaskAdded={handleTaskAdded} />
          <TaskStats tasks={tasks} />
        </div>

        <div className="right-panel">
          <TaskList
            tasks={tasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
