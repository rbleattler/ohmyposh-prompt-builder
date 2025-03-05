# Contributing Guidelines

## Coding Standards

1. **Code Formatting**
   - Follow established project formatting
   - Use consistent naming conventions
   - Include appropriate comments

2. **Error Handling**
   - Include appropriate error handling in all functional code
   - Provide meaningful error messages
   - Log errors appropriately

3. **Documentation**
   - Write thorough comments for complex logic
   - Document public APIs and components
   - Update relevant documentation when making changes

4. **Performance**
   - Consider performance implications of changes
   - Optimize resource-intensive operations
   - Use appropriate data structures

5. **Testing**
   - Write unit tests for new functionality
   - Ensure existing tests pass
   - Update tests when modifying functionality

## Task Management

### Creating Tasks

1. Use the template at `.tasks/template.md`
2. Generate a unique task ID using a timestamp in format `YYYYMMDD-HHMMSS`
3. Follow naming convention: `<priority>_<task_name>.md`
4. Place in `.tasks` directory

### Creating Subtasks

1. Use the template at `.tasks/template_subtask.md`
2. Generate a unique subtask ID using a timestamp in format `YYYYMMDD-HHMMSS`
3. Reference the parent task ID in the `parentTaskId` field
4. Follow naming convention: `<priority>_<task_name>_<sub_task_priority>_<sub_task_name>.md`
5. Update the parent task's `subtasks` array with the new subtask ID

### Updating Tasks

- Update status in front matter when changed
- Add completion date when done
- Update subtask references when needed

### Completing Tasks

- Move completed tasks to `.tasks/archive`
- Update status and completion date

Tasks are managed using Markdown files in the `.tasks` directory. See `.github/copilot-instructions.md` for details on task management.

## Directory Structure

```
.
├── .github/
│   ├── copilot-instructions.md
│   └── CONTRIBUTING.md
├── .tasks/
│   ├── template.md
│   ├── [priority]_[task_name].md
│   └── archive/
└── src/
    └── [implementation files]
```

## Git Workflow

1. Create feature branches from main
2. Use conventional commit messages
3. Reference task files in commits
4. Submit PRs with completed acceptance criteria
