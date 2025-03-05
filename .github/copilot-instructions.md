# GitHub Copilot Instructions for oh-my-posh Prompt Builder

This file provides specialized instructions for GitHub Copilot when working on this project.

## Project Overview

This is a visual prompt builder for [oh-my-posh](https://ohmyposh.dev/), allowing users to design and customize their terminal prompts through a visual interface. The application imports/exports JSON theme files compatible with oh-my-posh.

## General Coding Guidelines

Follow the project's established coding patterns with React/TypeScript. Use functional components with hooks rather than class components. Maintain type safety throughout the codebase.

- Use TypeScript types/interfaces over any
- Use Material UI (MUI) for UI components
- Follow established error handling patterns
- Write unit tests for new functionality

## Task Management

When working on tasks:

- Generate unique task IDs using timestamp format: `YYYYMMDD-HHMMSS`
- Create task files in `.tasks` directory following naming convention `<priority>_<task_name>.md`
- For subtasks, use `<priority>_<task_name>_<sub_task_priority>_<sub_task_name>.md` and reference parent task ID
- Update statuses in front matter and add completion dates when done
- Archive completed tasks to `.tasks/archive`
- Reference task IDs in commit messages

See `.github/copilot/prompts/task-management.md` for detailed instructions on task management.

## Architecture

The application uses:

- React for UI components
- TypeScript for type safety
- Material UI for component library
- Local storage for persisting configurations
- JSON Schema for validation

Components should be organized by feature/function. Shared utilities should go in the `src/utils` directory.

## Project Structure

- `.github/` - GitHub-related files including Copilot instructions
- `.tasks/` - Task management files
- `src/` - Source code
  - `components/` - React components
  - `contexts/` - React contexts for state management
  - `factories/` - Factory components for dynamic UI generation
  - `schemas/` - JSON Schema definitions
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions

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
