/**
 * Oh My Posh Theme Renderer
 * This file contains functions for rendering oh-my-posh themes in a web environment
 */

// Icon mapping from oh-my-posh specific characters to web-compatible versions
const iconMap = {
  // OS icons
  "\uf179": "🍎", // Apple
  "\uf17c": "🐧", // Linux
  "\uf31b": "🐧", // Ubuntu
  "\uf871": "🪟", // Windows

  // Standard segment icons
  "\uf015": "🏠", // Home
  "\uf07b": "📁", // Folder
  "\uf07c": "📂", // Folder open
  "\ue5ff": "👑", // Admin/root
  "\uf1d3": "🔀", // Git
  "\ue725": "🌿", // Branch
  "\uf48a": "⏰", // Time
  "\uf0e7": "⚡", // PowerShell
  "\ue795": "⚠️", // Error/warning
  "\uf061": "➡️", // Arrow right
  "\uf178": "➡️", // Arrow long right

  // PowerLine characters
  "\ue0b0": "▶", // Right solid arrow
  "\ue0b1": "▶", // Right thin arrow
  "\ue0b2": "◀", // Left solid arrow
  "\ue0b3": "◀", // Left thin arrow
  "\ue0b4": "▶", // Right solid diagonal
  "\ue0b5": "▶", // Right thin diagonal
  "\ue0b6": "◀", // Left solid diagonal
  "\ue0b7": "◀", // Left thin diagonal
  "\ue0b8": "▲", // Up solid arrow
  "\ue0b9": "▲", // Up thin arrow
  "\ue0ba": "▼", // Down solid arrow
  "\ue0bb": "▼", // Down thin arrow

  // Common Fallbacks
  "": "..." // Default fallback
};

/**
 * Get a web-compatible icon from an oh-my-posh icon
 * @param {string} icon The oh-my-posh icon character or code
 * @returns {string} A web-compatible icon or character
 */
function getWebIcon(icon) {
  if (!icon) return "";
  // Handle escaped unicode
  if (icon.startsWith("\\u")) {
    try {
      const unicodeChar = String.fromCharCode(parseInt(icon.slice(2), 16));
      return iconMap[unicodeChar] || unicodeChar;
    } catch (e) {
      return icon;
    }
  }
  // Direct mapping
  return iconMap[icon] || icon;
}

/**
 * Parse color values from oh-my-posh format to CSS format
 * @param {string} color The color value from oh-my-posh config
 * @returns {string} A valid CSS color
 */
function parseColor(color) {
  if (!color) return "inherit";

  // Check if it's already a hex color
  if (color.startsWith("#")) {
    return color;
  }

  // Handle p:color (palette reference)
  if (color.startsWith("p:")) {
    // For now, just return a default color
    // In a full implementation, we would look up the palette color
    return "#cccccc";
  }

  // Handle special named colors
  switch (color.toLowerCase()) {
    case "transparent":
      return "transparent";
    case "reset":
      return "inherit";
    // Add more special color cases as needed
    default:
      return "#cccccc"; // Default fallback
  }
}

/**
 * Render an oh-my-posh block
 * @param {Object} block The block configuration object
 * @param {boolean} isLast Whether this is the last block
 * @returns {HTMLElement} The DOM element for the block
 */
function renderBlock(block, isLast = false) {
  const blockDiv = document.createElement("div");
  blockDiv.className = "prompt-block";

  // Set alignment
  if (block.alignment === "right") {
    blockDiv.style.textAlign = "right";
    blockDiv.style.alignSelf = "flex-end";
  } else if (block.alignment === "center") {
    blockDiv.style.textAlign = "center";
    blockDiv.style.alignSelf = "center";
  }

  // Render segments in this block
  if (block.segments && Array.isArray(block.segments)) {
    block.segments.forEach((segment, index) => {
      const segmentSpan = renderSegment(segment, index, block.segments.length);
      blockDiv.appendChild(segmentSpan);
    });
  }

  // Add newline if specified and not the last block
  if (block.newline && !isLast) {
    blockDiv.style.marginBottom = "0.5em";
  }

  return blockDiv;
}

/**
 * Render an oh-my-posh segment
 * @param {Object} segment The segment configuration object
 * @param {number} index The index of this segment
 * @param {number} total The total number of segments in the parent block
 * @returns {HTMLElement} The DOM element for the segment
 */
function renderSegment(segment, index, total) {
  const segmentContainer = document.createElement("span");
  segmentContainer.className = "prompt-segment";

  // Style the segment
  const fg = parseColor(segment.foreground);
  const bg = parseColor(segment.background);

  // Apply segment style
  let style = segment.style || "plain";

  // Create the content span
  const contentSpan = document.createElement("span");
  contentSpan.style.color = fg;
  contentSpan.style.backgroundColor = bg;
  contentSpan.style.padding = "0 8px";

  // Handle PowerLine/diamond style
  if (style === "diamond" || style === "powerline") {
    // Add leading separator if not first segment
    if (index > 0 && segment.leading_diamond) {
      const leadingSpan = document.createElement("span");
      leadingSpan.innerText = getWebIcon(segment.leading_diamond);
      segmentContainer.appendChild(leadingSpan);
    }

    // Add trailing separator if not last segment
    if (index < total - 1 && segment.trailing_diamond) {
      contentSpan.style.paddingRight = "0";
      const trailingSpan = document.createElement("span");
      trailingSpan.innerText = getWebIcon(segment.trailing_diamond);
      segmentContainer.appendChild(contentSpan);
      segmentContainer.appendChild(trailingSpan);
      return segmentContainer;
    }
  }

  // Generate content based on segment type
  const content = getSegmentContent(segment);
  contentSpan.innerHTML = content;

  segmentContainer.appendChild(contentSpan);
  return segmentContainer;
}

/**
 * Get the content for a segment based on its type
 * @param {Object} segment The segment configuration object
 * @returns {string} HTML content for the segment
 */
function getSegmentContent(segment) {
  const props = segment.properties || {};
  let content = '';

  // Add prefix if specified
  if (props.prefix) {
    content += getWebIcon(props.prefix);
  }

  // Main content based on segment type
  switch (segment.type) {
    case "os":
      content += getWebIcon(props.windows || "\uf871") + " Windows";
      break;

    case "path":
      content += getWebIcon(props.folder_icon || "\uf07b") + " C:\\Projects";
      break;

    case "git":
      content += getWebIcon(props.branch_icon || "\ue725") + " main";
      break;

    case "root":
      content += getWebIcon(props.root_icon || "\ue5ff");
      break;

    case "exit":
      content += props.always_numeric
        ? "0"
        : getWebIcon(props.success_icon || "\u2713");
      break;

    case "text":
      content += props.text || "";
      break;

    case "time":
      const timeFormat = props.time_format || "15:04:05";
      content += getWebIcon(props.time_icon || "\uf48a") + " " +
        new Date().toLocaleTimeString();
      break;

    case "shell":
      content += getWebIcon(props.powershell_icon || "\uf0e7") + " pwsh";
      break;

    case "node":
      content += getWebIcon("\ue718") + " node";
      break;

    case "battery":
      content += "🔋 100%";
      break;

    default:
      content += segment.type || "...";
  }

  // Add postfix if specified
  if (props.postfix) {
    content += getWebIcon(props.postfix);
  }

  return content;
}

/**
 * Render an oh-my-posh theme in a container
 * @param {Object} config The oh-my-posh theme configuration
 * @param {HTMLElement} container The container to render in
 */
function renderOhMyPoshTheme(config, container) {
  // Clear container
  container.innerHTML = '';

  try {
    // Add a welcome message
    const welcomeDiv = document.createElement("div");
    welcomeDiv.className = "prompt-line";
    welcomeDiv.innerHTML = '<span style="color: #4CAF50;">Oh My Posh Theme Preview:</span>';
    container.appendChild(welcomeDiv);

    // Add a directory context
    const dirDiv = document.createElement("div");
    dirDiv.className = "prompt-line";
    dirDiv.innerHTML = '<span style="color: #FFA500;">C:\\Users\\User> cd Projects</span>';
    container.appendChild(dirDiv);

    // Create a prompt container
    const promptContainer = document.createElement("div");
    promptContainer.className = "prompt-container";

    // Render blocks
    if (config.blocks && Array.isArray(config.blocks)) {
      config.blocks.forEach((block, index) => {
        if (block.type === "prompt") {
          const blockElement = renderBlock(block, index === config.blocks.length - 1);
          promptContainer.appendChild(blockElement);
        }
      });
    }

    container.appendChild(promptContainer);

    // Add example command
    const cmdDiv = document.createElement("div");
    cmdDiv.className = "prompt-command";
    cmdDiv.innerHTML = '<span style="color: #FFFFFF;">npm start</span>';
    container.appendChild(cmdDiv);

  } catch (error) {
    container.innerHTML += `<div class="error">Error rendering theme: ${error.message}</div>`;
    console.error("Theme rendering error:", error);
  }
}

// Export the renderer function
window.OhMyPoshRenderer = {
  renderTheme: renderOhMyPoshTheme
};
