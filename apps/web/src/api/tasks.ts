const API_URL = "http://localhost:3000/api";

export type Priority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  description?: string | null;
  priority: Priority;
  completed: boolean;
  due_date?: string | null;
  created_at: string;
  completed_at?: string | null;
  category: string;
};

export type NewTask = {
  title: string;
  description?: string | null;
  priority?: Priority;
  category?: string;
  due_date?: string | null;
};

export type TaskFilters = {
  priority?: Priority;
  category?: string;
};

export const fetchTasks = async (
  filters: TaskFilters = {}
): Promise<Task[]> => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams
    ? `${API_URL}/tasks?${queryParams}`
    : `${API_URL}/tasks`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json() as Promise<Task[]>;
};

export const createTask = async (task: NewTask): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) throw new Error("Failed to create task");
  return response.json() as Promise<Task>;
};

export const deleteTask = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete task");
  return response.json() as Promise<{ success: boolean }>;
};

export const toggleTask = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}/toggle`, {
    method: "PATCH",
  });

  if (!response.ok) throw new Error("Failed to toggle task");
  return response.json() as Promise<Task>;
};
