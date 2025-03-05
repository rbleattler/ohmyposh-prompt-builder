# GitHub Copilot Instructions for oh-my-posh Prompt Builder

These instructions help GitHub Copilot assist with development work on the oh-my-posh prompt builder repository.

## Task Management

This repository uses a structured task management system. When working with tasks:

1. **Creating new tasks:**
   - Use the template at `.tasks/template.md`
   - Generate a unique task ID using timestamp format: `YYYYMMDD-HHMMSS`
   - Follow naming convention: `<priority>_<task_name>.md`
   - Place in `.tasks` directory

2. **Creating subtasks:**
   - Use the template at `.tasks/template_subtask.md`
   - Generate a unique subtask ID using timestamp format: `YYYYMMDD-HHMMSS`
   - Reference the parent task ID in the `parentTaskId` field
   - Follow naming convention: `<priority>_<task_name>_<sub_task_priority>_<sub_task_name>.md`
   - Update the parent task's `subtasks` array with the new subtask ID

3. **Updating task status:**
   - Update status in front matter when changed
   - Add completion date when done

4. **Completing tasks:**
   - Move completed task and subtask files to `.tasks/archive`
   - Update status and completion date

5. **Code Implementation:**
   - Reference task file or task ID in commit messages
   - Ensure all acceptance criteria are met
   - Update task status as progress is made

## Reference Files

- Task template: `.tasks/template.md`
- Subtask template: `.tasks/template_subtask.md`
- Coding standards: `.github/CONTRIBUTING.md`
- Task examples: `.tasks/archive/README.md`

>[!IMPORTANT]
>
> 1. Always ensure all acceptance criteria are met before marking a task as complete.
> 2. Only complete one task at a time
>
> - If a task will exceed the time/response length limit,
>     1. Break it into smaller tasks (create sub-tasks as dependencies of the main task)
>       - Sub tasks should
>         - Be named as `<priority>_<task_name>_<sub_task_priority>_<sub_task_name>.md`
>         - Be concise and focused on a specific aspect of the main task
>         - Not be full user stories, but rather implementation details
>         - Reference the main task in the description and metadata
>     2. Update the main task to reflect the new structure
>     3. Create prompts for the user to send to the LLM model to complete the subtasks
