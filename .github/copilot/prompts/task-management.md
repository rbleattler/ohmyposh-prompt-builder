---
description: Instructions for task management workflow in oh-my-posh profile builder
when: "git\\.\\w+|\\.(md|task|subtask)$|\\.tasks/"
weight: 10
---
# Task Management Instructions

## Creating Tasks

When creating new tasks:

1. Use the template at `.tasks/template.md`
2. Generate a unique task ID using timestamp format: `YYYYMMDD-HHMMSS`
3. Follow naming convention: `<taskId>.md`
4. Place in `.tasks` directory
5. Update the front matter with relevant information:

   ```yaml
   ---
   status: todo # todo, in-progress, done
   completion_date: null # YYYY-MM-DD
   priority: 0 # 0 is highest priority
   taskId: "YYYYMMDD-HHMMSS" # Generated timestamp ID
   subtasks: [] # Array of subtask IDs
   ---
   ```

## Creating Subtasks

When a task needs to be broken down:

1. Use the template at `.tasks/template_subtask.md`
2. Generate a unique subtask ID using timestamp format: `YYYYMMDD-HHMMSS`
3. Reference the parent task ID in the `parentTaskId` field
4. Follow naming convention: `<taskId>.md`
5. Update the parent task's `subtasks` array with the new subtask ID

Subtasks should:

- Be concise and focused on a specific aspect of the main task
- Not be full user stories, but rather implementation details
- Reference the main task in the description and metadata

## Updating Task Status

1. Update the `status` field in front matter:
   - `todo`: Task is defined but not started
   - `in-progress`: Task is being worked on
   - `done`: Task is completed
2. Add completion date (YYYY-MM-DD) when done

## Completing Tasks

1. Move completed task and subtask files to `.tasks/archive` directory
2. Ensure `status` is set to `done`
3. Set the `completion_date` to the current date
4. Keep all metadata intact for reference

## Implementation

When implementing code related to tasks:

1. Reference task file or task ID in commit messages
2. Ensure all acceptance criteria are met before marking as complete
3. Update task status as progress is made
4. Create subtasks if the implementation becomes too complex
