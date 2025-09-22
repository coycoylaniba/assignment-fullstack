import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:./dev.db",
});

const priorities = ["low", "medium", "high"];
const categories = ["work", "personal", "shopping", "health", "education"];

const generateTasks = (count: number) => {
  const taskList = [];
  for (let i = 1; i <= count; i++) {
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const completed = Math.random() > 0.7;
    const created = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );
    const due = new Date(
      created.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000
    );

    taskList.push({
      title: `Task ${i}: ${category} item`,
      description: `Description for task ${i}. This is a ${priority} priority ${category} task.`,
      priority,
      category,
      completed: completed ? 1 : 0,
      created_at: created.toISOString(),
      due_date: due.toISOString(),
      completed_at: completed
        ? new Date(
            created.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString()
        : null,
    });
  }
  return taskList;
};

export const seedAssessmentData = async () => {
  // Clear existing data
  await client.execute({
    sql: "DELETE FROM tasks",
    args: [],
  });

  // Generate and insert new data
  const taskList = generateTasks(150); // Generate 150 test tasks

  for (const task of taskList) {
    await client.execute({
      sql: `INSERT INTO tasks (title, description, priority, category, completed, created_at, due_date, completed_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        task.title,
        task.description,
        task.priority,
        task.category,
        task.completed,
        task.created_at,
        task.due_date,
        task.completed_at,
      ],
    });
  }

  console.log(`Seeded ${taskList.length} tasks successfully!`);
};

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await seedAssessmentData();
  process.exit(0);
}
