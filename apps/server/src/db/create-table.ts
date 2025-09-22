import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:./dev.db",
});

export const createTasksTable = async () => {
  await client.execute({
    sql: `
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                priority TEXT DEFAULT 'medium',
                completed BOOLEAN DEFAULT 0,
                due_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                completed_at DATETIME,
                category TEXT DEFAULT 'general'
            )
        `,
    args: [],
  });

  console.log("Tasks table created successfully!");
};

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await createTasksTable();
  process.exit(0);
}
