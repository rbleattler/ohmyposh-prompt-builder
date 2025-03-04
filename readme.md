# oh-my-posh prompt builder

This repository contains the source code for a visual prompt builder for [oh-my-posh](https://ohmyposh.dev/).

## Features

- Visual prompt builder
- Export to JSON
- Export to oh-my-posh theme
- Import from JSON
- Import from oh-my-posh theme
- Side by side code/theme view

## TODO

### Priority

- [ ] Further enhance the oh-my-posh theme rendering
  - [ ] Add support for more segment types
  - [ ] Improve PowerLine character rendering
  - [ ] Add support for custom templates

### Lower Priority

- [ ] Add visual builder capabilities
  - [ ] Create UI components for editing blocks and segments
  - [ ] Add drag-and-drop functionality for rearranging segments
  - [ ] Add color picker for selecting colors
- [ ] Add documentation
  - [ ] User guide
  - [ ] Development guide

## DONE

- [x] Add functionality to render oh-my-posh themes
  - [x] Create a parser for oh-my-posh config JSON
  - [x] Implement rendering logic for blocks, segments and styling
  - [x] Support oh-my-posh specific formatting and icons
- [x] Add Docker support for containerized deployment
- [x] Create documentation on theme rendering
- [x] The 'terminal window' preview should fill most of the right pane horizontally, and scale with the resizer
- [x] Make the terminal window preview fill most of the right pane horizontally, and scale with the resizer
- [x] FIX: The resize/slider goes away after dragging one time
- [x] Fix the resizable divider to ensure it remains visible and functional after use
- [x] Make it so the divider between the left and right pane can be dragged to resize the panes
  - [x] The terminal preview should resize with the right pane
- [x] Add a button to reset the JSON to the default oh-my-posh theme
- [x] Create a basic web page that displays two panes side by side
  - [x] Left pane: JSON editor
  - [x] Right pane: A preview of the theme (looks like windows terminal app)
- [x] Implement advanced JSON editor using Monaco Editor
- [x] Add import/export functionality
  - [x] Add "Import JSON" button to load config from a file
  - [x] Add "Export JSON" button to save config to a file
  - [x] Add "Export Theme" button to save as an oh-my-posh theme
- [x] Implement real-time preview
  - [x] Update terminal preview as JSON is edited
  - [x] Validate JSON input in real-time
