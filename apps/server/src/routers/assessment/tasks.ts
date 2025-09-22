import { db } from "@/db";
import { tasks } from "@/db/schema";
import { createClient } from "@libsql/client";
import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { Hono } from "hono";

type Priority = "low" | "medium" | "high";

const client = createClient({
  url: "file:./dev.db",
});

const router = new Hono();

const ITEMS_PER_PAGE = 10;

// GET all tasks - NO BUG HERE
router.get("/tasks", async (c) => {
  const {
    priority,
    category,
    page,
    limit,
    search,
    sortBy = "due_date",
    sortOrder = "asc",
    completed,
  } = c.req.query() as {
    priority?: Priority;
    category?: string;
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: "title" | "priority" | "due_date";
    sortOrder?: "asc" | "desc";
    completed?: string;
  };

  const currentPage = Number(page) || 1;
  const itemsPerPage = Number(limit) || ITEMS_PER_PAGE;
  const sortCondition =
    sortBy === "priority"
      ? sql`CASE ${tasks.priority}
          WHEN 'low' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'high' THEN 3
        END
      `
      : tasks[sortBy];
  const directionObj = {
    asc,
    desc,
  };

  const tasksResult = await db
    .select()
    .from(tasks)
    .where(
      and(
        priority ? eq(tasks.priority, priority) : undefined,
        category ? eq(tasks.category, category) : undefined,
        search
          ? or(
              like(tasks.title, `%${search}%`),
              like(tasks.description, `%${search}%`),
              like(tasks.priority, `%${search}%`),
              like(tasks.category, `%${search}%`)
            )
          : undefined,
        completed === "true" ? eq(tasks.completed, true) : undefined,
        completed === "false" ? eq(tasks.completed, false) : undefined
      )
    )
    .limit(itemsPerPage + 1)
    .offset((currentPage - 1) * itemsPerPage)
    .orderBy(directionObj[sortOrder](sortCondition));
  const tasksCountResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(tasks);
  const totalItems = tasksCountResult[0].count;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = tasksResult.length > itemsPerPage;
  const hasPreviousPage = currentPage > 1;

  if (tasksResult.length > itemsPerPage + 1) {
    tasksResult.pop();
  }

  return c.json({
    data: tasksResult,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage,
      hasPreviousPage,
    },
  });
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
