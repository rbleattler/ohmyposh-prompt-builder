let editor; // Monaco editor instance
let defaultThemeContent; // Store the default theme content

// Initialize Monaco Editor
function initMonaco() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('monaco-editor'), {
            value: '{\n  // Paste your oh-my-posh config here\n}',
            language: 'json',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            formatOnPaste: true,
            formatOnType: true
        });

        // Set up auto-update preview when content changes
        editor.onDidChangeModelContent(function() {
            updatePreview();
        });

        // Load sample config
        loadSampleConfig();
    });
}

// Load a sample oh-my-posh config
function loadSampleConfig() {
    // You can load a sample config here or leave it empty
    fetch('./default.omp.json')
        .then(response => response.text())
        .then(data => {
            // Store the default theme content for reset functionality
            defaultThemeContent = data;
            if (editor) {
                editor.setValue(data);
            }
        })
        .catch(error => {
            console.log('Sample config not found, using empty config');
        });
}

// Function to reset the editor to the default theme
function resetToDefault() {
    if (editor && defaultThemeContent) {
        if (confirm('Are you sure you want to reset to the default theme? Any unsaved changes will be lost.')) {
            editor.setValue(defaultThemeContent);
            updatePreview();
        }
    } else {
        alert('Default theme not loaded yet. Please try again in a moment.');
    }
}

// Function to handle the resizable divider
function initResizable() {
    const resizeHandle = document.getElementById('resize-handle');
    const jsonEditor = document.getElementById('json-editor');
    const themePreview = document.getElementById('theme-preview');
    const terminal = document.querySelector('.terminal');

    let isResizing = false;

    // Mouse down event listener
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        resizeHandle.classList.add('active');
        document.body.style.cursor = 'col-resize';
        // Prevent text selection during resize
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    // Mouse move event listener - use window for better tracking
    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        // Calculate the percentage width
        const containerWidth = window.innerWidth;
        const percentage = (e.clientX / containerWidth) * 100;

        // Constrain the resize (don't allow panes to get too small)
        if (percentage > 20 && percentage < 80) {
            jsonEditor.style.flex = `0 0 ${percentage}%`;
            themePreview.style.flex = `0 0 ${100 - percentage - 1}%`; // Reserve 1% for the handle

            // Ensure the resize handle stays visible
            resizeHandle.style.display = 'block';

            // Make sure the terminal properly fits the preview pane
            if (terminal) {
                terminal.style.width = '95%';
                terminal.style.height = '95%';
            }

            // Trigger Monaco editor resize if it exists
            if (editor) {
                editor.layout();
            }
        }
    });

    // Mouse up event listener - use window for better tracking
    window.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizeHandle.classList.remove('active');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

function updatePreview() {
    if (!editor) return;

    const jsonInput = editor.getValue();
    const terminalBody = document.getElementById('terminal-body');

    try {
        const config = JSON.parse(jsonInput);
        // Clear existing content
        terminalBody.innerHTML = '';

        // Use the dedicated Oh My Posh renderer instead of the basic one
        if (window.OhMyPoshRenderer) {
            window.OhMyPoshRenderer.renderTheme(config, terminalBody);
        } else {
            // Fallback to simple rendering if the renderer is not loaded
            renderOhMyPoshPrompt(config, terminalBody);
        }
    } catch (e) {
        terminalBody.innerHTML = '<div class="error">Invalid JSON: ' + e.message + '</div>';
    }
}

// Render an oh-my-posh prompt based on the configuration
function renderOhMyPoshPrompt(config, container) {
    try {
        // Create a welcome message
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'prompt-line';
        welcomeDiv.innerHTML = '<span style="color: #4CAF50;">Welcome to the Oh My Posh Preview!</span>';
        container.appendChild(welcomeDiv);

        // Add a directory path example
        const dirDiv = document.createElement('div');
        dirDiv.className = 'prompt-line';
        dirDiv.innerHTML = '<span style="color: #FFA500;">C:\\Users\\User> cd Projects</span>';
        container.appendChild(dirDiv);

        // Render blocks from the configuration
        if (config.blocks && Array.isArray(config.blocks)) {
            config.blocks.forEach((block, blockIndex) => {
                if (block.type === 'prompt') {
                    const blockDiv = document.createElement('div');
                    blockDiv.className = 'prompt-block';
                    if (block.alignment === 'right') {
                        blockDiv.style.textAlign = 'right';
                    }

                    // Render segments in the block
                    if (block.segments && Array.isArray(block.segments)) {
                        let segmentsHtml = '';
                        block.segments.forEach(segment => {
                            const segmentColor = segment.foreground || '#FFFFFF';
                            const bgColor = segment.background || 'transparent';

                            // Create a sample representation based on segment type
                            let content = '';
                            switch(segment.type) {
                                case 'os':
                                    content = '🖥️ Windows';
                                    break;
                                case 'path':
                                    content = '📁 C:\\Projects';
                                    break;
                                case 'git':
                                    content = '🔀 main';
                                    break;
                                case 'root':
                                    content = '👑';
                                    break;
                                case 'exit':
                                    content = '➜';
                                    break;
                                case 'text':
                                    content = segment.properties?.text || '─';
                                    break;
                                case 'time':
                                    content = '🕒 10:30';
                                    break;
                                default:
                                    content = segment.type || '...';
                            }

                            segmentsHtml += `<span style="color: ${segmentColor}; background-color: ${bgColor}; padding: 2px 5px;">${content}</span>`;
                        });

                        blockDiv.innerHTML = segmentsHtml;
                    }

                    container.appendChild(blockDiv);

                    // Add a newline if specified
                    if (block.newline) {
                        container.appendChild(document.createElement('br'));
                    }
                }
            });
        }

        // Add a sample command
        const cmdDiv = document.createElement('div');
        cmdDiv.className = 'prompt-line';
        cmdDiv.innerHTML = '<span style="color: #FFF;">npm start</span>';
        container.appendChild(cmdDiv);

    } catch (error) {
        container.innerHTML += '<div class="error">Error rendering prompt: ' + error.message + '</div>';
    }
}

// Function to handle importing JSON from a file
function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function() {
            if (editor) {
                editor.setValue(reader.result);
                updatePreview();
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Function to handle exporting JSON to a file
function exportJSON() {
    if (!editor) return;

    const jsonInput = editor.getValue();
    try {
        const config = JSON.parse(jsonInput); // Validate JSON
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'oh-my-posh-config.json';
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
    }
}

// Function to handle exporting to an oh-my-posh theme
function exportTheme() {
    if (!editor) return;

    const jsonInput = editor.getValue();
    try {
        const config = JSON.parse(jsonInput); // Validate JSON
        // Here you would transform the JSON if needed for oh-my-posh theme format
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'oh-my-posh-theme.omp.json';
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Monaco Editor
    initMonaco();

    // Initialize resizable divider
    initResizable();

    // Add event listeners for UI elements - only attach once
    document.getElementById('import-json').addEventListener('click', importJSON);
    document.getElementById('export-json').addEventListener('click', exportJSON);
    document.getElementById('export-theme').addEventListener('click', exportTheme);
    document.getElementById('reset-json').addEventListener('click', resetToDefault);

    // Make sure the Monaco editor resizes when the window resizes
    window.addEventListener('resize', function() {
        if (editor) {
            editor.layout();
        }
    });
});
