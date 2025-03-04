# Oh My Posh Theme Rendering

## Overview

Oh My Posh themes are defined in JSON and consist of several key components:

1. **Blocks**: The main layout components that organize content either on the left, right or center of the prompt
2. **Segments**: Individual components within blocks that display specific information (git status, directory, time, etc.)
3. **Styling**: Visual appearance including colors, icons, and formatting

## Theme Structure

A typical Oh My Posh theme has this structure:

```json
{
  "$schema": "https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json",
  "version": 2,
  "final_space": true,
  "console_title_template": "{{ .Shell }} in {{ .Folder }}",
  "blocks": [
    {
      "type": "prompt",
      "alignment": "left",
      "segments": [
        {
          "type": "path",
          "style": "diamond",
          "foreground": "#ffffff",
          "background": "#61AFEF",
          "properties": {
            // segment specific properties
          }
        },
        // more segments
      ]
    },
    // more blocks
  ]
}
```

## Rendering Process

To properly render Oh My Posh themes in our application:

1. **Parse the JSON**: Read and validate the theme configuration
2. **Process Blocks**: Render each block with proper alignment and spacing
3. **Process Segments**: Within each block, render individual segments with:
   - Proper styling (colors, background)
   - Appropriate icons based on segment type
   - Text content based on segment type and properties
4. **Handle Special Elements**:
   - Leading/trailing text characters (like `>`, `$`, etc.)
   - Icons and PowerLine/Nerd Font characters
   - Color transitions between segments

## Special Features to Support

1. **PowerLine Characters**: The characters that create the arrow-like transitions between segments
2. **Nerd Fonts**: Special icon fonts used extensively in Oh My Posh themes
3. **Color Inheritance**: Segments can inherit colors from parent or previous segments
4. **Templates**: Oh My Posh uses Go templates for dynamic content (e.g. `{{ .Path }}`)
5. **Conditional Rendering**: Some segments only appear under certain conditions

## Implementation Approach

Our web-based renderer will:

1. Create a JavaScript parser for the Oh My Posh JSON schema
2. Implement a HTML/CSS renderer that:
   - Creates properly styled div elements for each block
   - Creates span elements with appropriate styling for segments
   - Handles PowerLine characters with CSS
   - Uses web-compatible icons (either Unicode or images) to substitute for Nerd Font characters
3. Simulate dynamic content that would normally be provided by the shell environment

## Icon Mapping

Since Nerd Fonts may not be available in the browser, we'll map common Oh My Posh icons to:
- Unicode equivalents where possible
- SVG icons where necessary
- Emoji as a fallback

We'll maintain a mapping table of common Oh My Posh icons to their web-friendly alternatives.
