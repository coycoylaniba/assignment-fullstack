import { db } from "./index";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority", { enum: ["low", "medium", "high"] }).default(
    "medium"
  ),
  completed: integer("completed", { mode: "boolean" }).default(false),
  due_date: text("due_date"),
  created_at: text("created_at").default(new Date().toISOString()),
  completed_at: text("completed_at"),
  category: text("category").default("general"),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
