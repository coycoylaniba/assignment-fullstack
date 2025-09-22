import { createClient } from "@libsql/client";
import { Hono } from "hono";

const client = createClient({
  url: "file:./dev.db",
});

const router = new Hono();

// GET all tasks - NO BUG HERE
router.get("/tasks", async (c) => {
  const { priority, category } = c.req.query();
  let query = "SELECT * FROM tasks";
  const params = [];
  const conditions = [];

  if (priority) {
    conditions.push("priority = ?");
    params.push(priority);
  }
  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY created_at DESC";

  const tasks = await client.execute({
    sql: query,
    args: params,
  });
  return c.json(tasks.rows);
});

router.post("/tasks", async (c) => {
  const {
    title,
    description,
    priority = "medium",
    category = "general",
    due_date,
  } = await c.req.json();

  console.log(title, description, priority, category, due_date);

  const result = await client.execute({
    sql: `INSERT INTO tasks (title, description, priority, category, due_date) 
              VALUES (?, ?, ?, ?, ?)`,
    args: [title, description, priority, category, due_date],
  });

  const task = await client.execute({
    sql: "SELECT * FROM tasks WHERE id = ?",
    args: [result.lastInsertRowid?.toString() || "0"],
  });
  return c.json(task.rows[0]);
});

router.delete("/tasks/:id", async (c) => {
  const id = c.req.param("id");
  client.execute({
    sql: "DELETE FROM tasks WHERE id = ?",
    args: [id],
  });
  return c.json({ success: true });
});

export default router;
