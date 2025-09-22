# Full-Stack Developer Technical Assessment (30 Minutes)

## Overview

This assessment tests your ability to identify and fix performance bugs in React applications and implement backend features in Node.js APIs. Give yourself around 30 minutes to complete the following tasks.

## Environment Setup

```bash
# Install dependencies
pnpm install

# Setup assessment
pnpm setup-assessment

# Start both servers
pnpm dev
```

Open http://localhost:3001 in your browser to begin.

## Part 1: React Performance Optimization

### Performance Issues to Fix

The React application has several performance bugs. Open the browser console to see performance warnings.

**Bug 1: Expensive Filter/Sort Operations**

- Location: `apps/web/src/components/assessment/TaskList.tsx`
- Issue: The `filteredAndSortedTasks` calculation runs on every render
- Symptoms: "🔥 Expensive sort operation running!" logs on every keystroke

**Bug 2: Stats Recalculation**

- Location: `apps/web/src/components/assessment/TaskStats.tsx`
- Issue: Statistics recalculated on every render
- Symptoms: "🔥 Calculating overdue tasks..." logs frequently

**Bug 3: Memory Leak**

- Location: `apps/web/src/components/assessment/TaskStats.tsx`
- Issue: Interval not cleaned up on component unmount

## Part 2: Backend Feature Implementation

### Features to Implement

The backend API needs enhanced functionality for the tasks endpoint. Currently, the `/tasks` GET endpoint has basic filtering but lacks proper pagination, advanced filtering, and sorting capabilities.

**Feature 1: Server-Side Pagination**

- Location: `apps/server/src/routers/assessment/tasks.ts`
- Requirement: Implement pagination with `page` and `limit` query parameters
- Default: 10 items per page
- Response should include pagination metadata (currentPage, totalPages, totalItems, hasNextPage, etc.)

**Feature 2: Enhanced Server-Side Filtering**

- Location: `apps/server/src/routers/assessment/tasks.ts`
- Current: Basic priority filtering exists
- Add: `search` filter server side instead of client side

**Feature 3: Server-Side Sorting**

- Location: `apps/server/src/routers/assessment/tasks.ts`
- Requirement: Add `sortBy`
- Allowed sortBy fields: title, priority, due_date
- Default sortBy: due_date

**Expected API Response Format:**

```json
{
  "data": [...tasks],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Example API Calls:**

```
GET /tasks?page=2&limit=5&priority=high&completed=false&search=urgent&sortBy=due_date&sortOrder=asc
```
