# Task Management

This directory contains task files for the Oh My Posh Profile Builder project.

## Task Structure

- Main tasks are defined in files named `<priority>_<task_name>.md`
- Completed tasks are moved to the `archive` directory

## Breaking Down Complex Tasks

For complex tasks that would exceed the time/response length limit:

1. Break the task into smaller sub-tasks:
   - Create sub-task files named as `<priority>_<task_name>_<sub_task_priority>_<sub_task_name>.md`
   - Use the `template_subtask.md` template for sub-tasks

2. Sub-tasks should:
   - Be concise and focused on a specific aspect of the main task
   - Not be full user stories, but rather implementation details
   - Reference the main task in the description

3. Update the main task to:
   - Reference the sub-tasks
   - Track overall progress

4. Complete one task (or sub-task) at a time

## Templates

- Main tasks: Use `template.md`
- Sub-tasks: Use `template_subtask.md`

## Example Task Breakdown

- `1_add_visual_builder_capabilities.md` (Main task)
  - `1_add_visual_builder_capabilities_1_block_editor.md` (Sub-task)
  - `1_add_visual_builder_capabilities_2_segment_editor.md` (Sub-task)
  - `1_add_visual_builder_capabilities_3_drag_drop.md` (Sub-task)
