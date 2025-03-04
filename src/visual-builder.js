/**
 * Visual Builder component for Oh My Posh Prompt Builder
 * Implements the functionality described in task 1_add_visual_builder_capabilities.md
 */

class VisualBuilder {
    constructor() {
        this.currentConfig = null;
        this.selectedBlock = null;
        this.selectedSegment = null;
        this.dragulaInstances = {};
        this.colorPickers = {};

        // Initialize UI components
        this.initTabInterface();
        this.initDragAndDrop();
        this.initEventListeners();
    }

    /**
     * Initialize tab interface for switching between JSON and Visual editors
     */
    initTabInterface() {
        const tabs = document.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-tab');

                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update active panel
                document.querySelectorAll('.editor-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                document.getElementById(targetId).classList.add('active');

                // If switching to visual builder, update the UI from current JSON
                if (targetId === 'visual-builder') {
                    this.updateVisualFromJson();
                } else if (targetId === 'json-editor') {
                    this.updateJsonFromVisual();
                }
            });
        });
    }

    /**
     * Initialize drag and drop functionality for blocks and segments
     */
    initDragAndDrop() {
        // Initialize dragula for blocks
        this.dragulaInstances.blocks = dragula([document.getElementById('blocks-list')], {
            moves: (el) => el.classList.contains('draggable')
        });

        // Initialize dragula for segments
        this.dragulaInstances.segments = dragula([document.getElementById('segments-list')], {
            moves: (el) => el.classList.contains('draggable')
        });

        // Handle drop events
        this.dragulaInstances.blocks.on('drop', this.handleBlockReorder.bind(this));
        this.dragulaInstances.segments.on('drop', this.handleSegmentReorder.bind(this));
    }

    /**
     * Initialize event listeners for buttons and other UI elements
     */
    initEventListeners() {
        // Add block button
        document.getElementById('add-block').addEventListener('click', () => this.openBlockModal());

        // Add segment button
        document.getElementById('add-segment').addEventListener('click', () => this.openSegmentModal());

        // Close modal buttons
        document.querySelectorAll('.close-modal, .cancel-button').forEach(button => {
            button.addEventListener('click', event => {
                const modal = event.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Save block button
        document.getElementById('save-block').addEventListener('click', () => {
            this.saveBlockChanges();
            document.getElementById('block-modal').style.display = 'none';
        });

        // Save segment button
        document.getElementById('save-segment').addEventListener('click', () => {
            this.saveSegmentChanges();
            document.getElementById('segment-modal').style.display = 'none';
        });

        // Event delegation for edit and delete buttons
        document.addEventListener('click', event => {
            // Edit block button
            if (event.target.classList.contains('edit-button') && event.target.closest('.block-item')) {
                const blockEl = event.target.closest('.block-item');
                const blockIndex = Array.from(blockEl.parentElement.children).indexOf(blockEl);
                this.editBlock(blockIndex);
            }

            // Delete block button
            if (event.target.classList.contains('delete-button') && event.target.closest('.block-item')) {
                const blockEl = event.target.closest('.block-item');
                const blockIndex = Array.from(blockEl.parentElement.children).indexOf(blockEl);
                this.deleteBlock(blockIndex);
            }

            // Edit segment button
            if (event.target.classList.contains('edit-button') && event.target.closest('.segment-item')) {
                const segmentEl = event.target.closest('.segment-item');
                const segmentIndex = Array.from(segmentEl.parentElement.children).indexOf(segmentEl);
                this.editSegment(segmentIndex);
            }

            // Delete segment button
            if (event.target.classList.contains('delete-button') && event.target.closest('.segment-item')) {
                const segmentEl = event.target.closest('.segment-item');
                const segmentIndex = Array.from(segmentEl.parentElement.children).indexOf(segmentEl);
                this.deleteSegment(segmentIndex);
            }
        });
    }

    /**
     * Update visual builder UI from the current JSON configuration
     */
    updateVisualFromJson() {
        try {
            // Get current JSON from Monaco Editor
            this.currentConfig = JSON.parse(window.monacoEditor.getValue());

            // Render blocks
            this.renderBlocks();

            // If there are blocks, render segments for the first block
            if (this.currentConfig.blocks && this.currentConfig.blocks.length > 0) {
                this.selectBlock(0);
            }
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            alert('Failed to parse JSON. Please check the editor for errors.');
        }
    }

    /**
     * Update JSON in the Monaco Editor from the current visual builder state
     */
    updateJsonFromVisual() {
        try {
            // Update the Monaco Editor with the current configuration
            window.monacoEditor.setValue(JSON.stringify(this.currentConfig, null, 2));

            // Trigger preview update
            document.getElementById('update-preview').click();
        } catch (error) {
            console.error('Failed to update JSON:', error);
            alert('Failed to update JSON from visual builder.');
        }
    }

    /**
     * Render blocks in the blocks list
     */
    renderBlocks() {
        const blocksList = document.getElementById('blocks-list');
        blocksList.innerHTML = '';

        if (!this.currentConfig.blocks) return;

        this.currentConfig.blocks.forEach((block, index) => {
            const blockTemplate = document.getElementById('block-template');
            const blockClone = document.importNode(blockTemplate.content, true);

            // Set block title
            const blockTitle = blockClone.querySelector('.block-title');
            blockTitle.textContent = `Block ${index + 1}: ${block.type || 'Unknown'}`;

            // Add to the list
            blocksList.appendChild(blockClone);

            // Add click handler to select this block
            blocksList.lastElementChild.addEventListener('click', event => {
                if (!event.target.closest('.block-actions')) {
                    this.selectBlock(index);
                }
            });
        });
    }

    /**
     * Render segments for a specific block
     * @param {number} blockIndex - Index of the block to render segments for
     */
    renderSegments(blockIndex) {
        const segmentsList = document.getElementById('segments-list');
        segmentsList.innerHTML = '';

        const block = this.currentConfig.blocks[blockIndex];
        if (!block || !block.segments) return;

        block.segments.forEach((segment, index) => {
            const segmentTemplate = document.getElementById('segment-template');
            const segmentClone = document.importNode(segmentTemplate.content, true);

            // Set segment type
            const segmentType = segmentClone.querySelector('.segment-type');
            segmentType.textContent = segment.type || 'Unknown';

            // Set segment preview (background color if available)
            const segmentPreview = segmentClone.querySelector('.segment-preview');
            if (segment.style && segment.style.background) {
                segmentPreview.style.backgroundColor = segment.style.background;
            }

            // Add to the list
            segmentsList.appendChild(segmentClone);

            // Add click handler to select this segment
            segmentsList.lastElementChild.addEventListener('click', event => {
                if (!event.target.closest('.segment-actions')) {
                    this.selectSegment(index);
                }
            });
        });
    }

    /**
     * Select a block and display its segments
     * @param {number} blockIndex - Index of the block to select
     */
    selectBlock(blockIndex) {
        this.selectedBlock = blockIndex;

        // Update selected block UI
        const blockItems = document.querySelectorAll('#blocks-list .block-item');
        blockItems.forEach((item, index) => {
            if (index === blockIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        // Render segments for this block
        this.renderSegments(blockIndex);
    }

    /**
     * Select a segment and display its properties
     * @param {number} segmentIndex - Index of the segment to select
     */
    selectSegment(segmentIndex) {
        this.selectedSegment = segmentIndex;

        // Update selected segment UI
        const segmentItems = document.querySelectorAll('#segments-list .segment-item');
        segmentItems.forEach((item, index) => {
            if (index === segmentIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        // Render properties for this segment
        this.renderProperties(this.selectedBlock, segmentIndex);
    }

    /**
     * Render properties form for a segment
     * @param {number} blockIndex - Index of the block
     * @param {number} segmentIndex - Index of the segment
     */
    renderProperties(blockIndex, segmentIndex) {
        const propertiesForm = document.getElementById('properties-form');
        propertiesForm.innerHTML = '';

        if (blockIndex === null || segmentIndex === null) return;

        const segment = this.currentConfig.blocks[blockIndex].segments[segmentIndex];

        // Create form fields for segment properties
        for (const [key, value] of Object.entries(segment)) {
            if (key === 'style') {
                // Handle style object separately
                this.renderStyleProperties(propertiesForm, segment.style);
            } else {
                // Handle regular properties
                this.renderPropertyField(propertiesForm, key, value);
            }
        }

        // Add apply button
        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply Changes';
        applyBtn.className = 'save-button';
        applyBtn.style.marginTop = '15px';
        applyBtn.addEventListener('click', () => this.applyPropertyChanges());
        propertiesForm.appendChild(applyBtn);
    }

    /**
     * Render style properties (colors, etc.)
     * @param {HTMLElement} container - Container element to append to
     * @param {Object} styleObj - Style object from the segment
     */
    renderStyleProperties(container, styleObj) {
        if (!styleObj) return;

        const styleFieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = 'Style Properties';
        styleFieldset.appendChild(legend);

        for (const [key, value] of Object.entries(styleObj)) {
            if (key === 'background' || key === 'foreground') {
                // Create color picker for colors
                const label = document.createElement('label');
                label.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}:`;
                styleFieldset.appendChild(label);

                const colorPickerContainer = document.createElement('div');
                colorPickerContainer.className = 'color-picker-container';
                colorPickerContainer.id = `color-picker-${key}`;
                styleFieldset.appendChild(colorPickerContainer);

                // Initialize color picker
                setTimeout(() => {
                    this.initColorPicker(key, value, colorPickerContainer);
                }, 0);
            } else {
                // Regular property field
                this.renderPropertyField(styleFieldset, key, value);
            }
        }

        container.appendChild(styleFieldset);
    }

    /**
     * Render a property field for the form
     * @param {HTMLElement} container - Container element to append to
     * @param {string} key - Property key
     * @param {any} value - Property value
     */
    renderPropertyField(container, key, value) {
        if (typeof value === 'object' && value !== null) return; // Skip objects (handled separately)

        const div = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}:`;
        div.appendChild(label);

        const input = document.createElement('input');
        input.type = typeof value === 'boolean' ? 'checkbox' : 'text';

        if (input.type === 'checkbox') {
            input.checked = value;
        } else {
            input.value = value;
        }

        input.id = `prop-${key}`;
        input.dataset.property = key;
        div.appendChild(input);

        container.appendChild(div);
    }

    /**
     * Initialize color picker for a style property
     * @param {string} property - Style property name
     * @param {string} color - Color value
     * @param {HTMLElement} container - Container element
     */
    initColorPicker(property, color, container) {
        // Clean up any existing color picker
        if (this.colorPickers[property]) {
            this.colorPickers[property].destroyAndRemove();
            delete this.colorPickers[property];
        }

        // Create new color picker
        this.colorPickers[property] = Pickr.create({
            el: container,
            theme: 'classic',
            default: color || '#000000',
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    input: true,
                    save: true
                }
            }
        });

        // Save the property name on the color picker instance for later reference
        this.colorPickers[property].property = property;
    }

    /**
     * Apply property changes from the form to the segment
     */
    applyPropertyChanges() {
        if (this.selectedBlock === null || this.selectedSegment === null) return;

        const segment = this.currentConfig.blocks[this.selectedBlock].segments[this.selectedSegment];

        // Update regular properties
        document.querySelectorAll('#properties-form input[data-property]').forEach(input => {
            const property = input.dataset.property;
            const value = input.type === 'checkbox' ? input.checked : input.value;

            // Convert string values to proper types if needed
            if (input.type !== 'checkbox') {
                if (value === 'true') {
                    segment[property] = true;
                } else if (value === 'false') {
                    segment[property] = false;
                } else if (!isNaN(value) && value.trim() !== '') {
                    segment[property] = Number(value);
                } else {
                    segment[property] = value;
                }
            } else {
                segment[property] = value;
            }
        });

        // Update color properties
        for (const [prop, picker] of Object.entries(this.colorPickers)) {
            if (!segment.style) segment.style = {};
            segment.style[prop] = picker.getColor().toHEXA().toString();
        }

        // Update JSON and preview
        this.updateJsonFromVisual();
        this.renderSegments(this.selectedBlock);

        // Update the segment item preview
        const segmentItems = document.querySelectorAll('#segments-list .segment-item');
        if (segmentItems[this.selectedSegment]) {
            const preview = segmentItems[this.selectedSegment].querySelector('.segment-preview');
            if (segment.style && segment.style.background) {
                preview.style.backgroundColor = segment.style.background;
            }
        }
    }

    /**
     * Handle block reordering after drag and drop
     */
    handleBlockReorder() {
        if (!this.currentConfig.blocks) return;

        // Get the new order from the DOM
        const blockElements = document.querySelectorAll('#blocks-list .block-item');
        const newBlocks = [];

        blockElements.forEach((element, index) => {
            const originalIndex = parseInt(element.dataset.index);
            newBlocks.push(this.currentConfig.blocks[originalIndex]);
        });

        // Update the configuration
        this.currentConfig.blocks = newBlocks;

        // Update the JSON and preview
        this.updateJsonFromVisual();

        // Re-render blocks with the new order
        this.renderBlocks();
    }

    /**
     * Handle segment reordering after drag and drop
     */
    handleSegmentReorder() {
        if (this.selectedBlock === null || !this.currentConfig.blocks[this.selectedBlock].segments) return;

        // Get the new order from the DOM
        const segmentElements = document.querySelectorAll('#segments-list .segment-item');
        const newSegments = [];

        segmentElements.forEach((element, index) => {
            const originalIndex = parseInt(element.dataset.index);
            newSegments.push(this.currentConfig.blocks[this.selectedBlock].segments[originalIndex]);
        });

        // Update the configuration
        this.currentConfig.blocks[this.selectedBlock].segments = newSegments;

        // Update the JSON and preview
        this.updateJsonFromVisual();

        // Re-render segments with the new order
        this.renderSegments(this.selectedBlock);
    }

    /**
     * Open the block modal to add or edit a block
     * @param {Object} block - Block to edit (undefined for new block)
     * @param {number} blockIndex - Index of the block to edit (undefined for new block)
     */
    openBlockModal(block, blockIndex) {
        const modal = document.getElementById('block-modal');
        const form = document.getElementById('block-form');
        form.innerHTML = '';

        // If editing, store the block index
        if (blockIndex !== undefined) {
            form.dataset.blockIndex = blockIndex;
        } else {
            delete form.dataset.blockIndex;
        }

        // Create form fields for block properties
        const defaultBlock = block || {
            type: 'prompt',
            alignment: 'left',
            segments: []
        };

        // Block type field
        const typeDiv = document.createElement('div');
        const typeLabel = document.createElement('label');
        typeLabel.textContent = 'Block Type:';
        typeDiv.appendChild(typeLabel);

        const typeSelect = document.createElement('select');
        typeSelect.id = 'block-type';
        ['prompt', 'rprompt', 'newline'].forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            if (defaultBlock.type === type) {
                option.selected = true;
            }
            typeSelect.appendChild(option);
        });
        typeDiv.appendChild(typeSelect);
        form.appendChild(typeDiv);

        // Alignment field
        const alignmentDiv = document.createElement('div');
        const alignmentLabel = document.createElement('label');
        alignmentLabel.textContent = 'Alignment:';
        alignmentDiv.appendChild(alignmentLabel);

        const alignmentSelect = document.createElement('select');
        alignmentSelect.id = 'block-alignment';
        ['left', 'right'].forEach(alignment => {
            const option = document.createElement('option');
            option.value = alignment;
            option.textContent = alignment;
            if (defaultBlock.alignment === alignment) {
                option.selected = true;
            }
            alignmentSelect.appendChild(option);
        });
        alignmentDiv.appendChild(alignmentSelect);
        form.appendChild(alignmentDiv);

        // Newline option
        const newlineDiv = document.createElement('div');
        const newlineLabel = document.createElement('label');
        newlineLabel.textContent = 'Add Newline:';
        newlineDiv.appendChild(newlineLabel);

        const newlineCheck = document.createElement('input');
        newlineCheck.type = 'checkbox';
        newlineCheck.id = 'block-newline';
        newlineCheck.checked = defaultBlock.newline || false;
        newlineDiv.appendChild(newlineCheck);
        form.appendChild(newlineDiv);

        // Show the modal
        modal.style.display = 'block';
    }

    /**
     * Save changes to a block
     */
    saveBlockChanges() {
        const form = document.getElementById('block-form');
        const blockIndex = form.dataset.blockIndex !== undefined ? parseInt(form.dataset.blockIndex) : undefined;

        // Get values from form
        const type = document.getElementById('block-type').value;
        const alignment = document.getElementById('block-alignment').value;
        const newline = document.getElementById('block-newline').checked;

        // Create or update block
        const block = {
            type,
            alignment,
            segments: []
        };

        if (newline) {
            block.newline = true;
        }

        if (blockIndex !== undefined) {
            // Update existing block
            block.segments = this.currentConfig.blocks[blockIndex].segments || [];
            this.currentConfig.blocks[blockIndex] = block;
        } else {
            // Add new block
            if (!this.currentConfig.blocks) {
                this.currentConfig.blocks = [];
            }
            this.currentConfig.blocks.push(block);
        }

        // Update UI
        this.updateJsonFromVisual();
        this.renderBlocks();

        // Select the block
        const selectIndex = blockIndex !== undefined ? blockIndex : this.currentConfig.blocks.length - 1;
        this.selectBlock(selectIndex);
    }

    /**
     * Edit an existing block
     * @param {number} blockIndex - Index of the block to edit
     */
    editBlock(blockIndex) {
        const block = this.currentConfig.blocks[blockIndex];
        this.openBlockModal(block, blockIndex);
    }

    /**
     * Delete a block
     * @param {number} blockIndex - Index of the block to delete
     */
    deleteBlock(blockIndex) {
        if (confirm('Are you sure you want to delete this block?')) {
            this.currentConfig.blocks.splice(blockIndex, 1);

            // Update UI
            this.updateJsonFromVisual();
            this.renderBlocks();

            // Reset selection
            this.selectedBlock = null;
            this.selectedSegment = null;

            // Clear segments list
            document.getElementById('segments-list').innerHTML = '';
            document.getElementById('properties-form').innerHTML = '';
        }
    }

    /**
     * Open the segment modal to add or edit a segment
     * @param {Object} segment - Segment to edit (undefined for new segment)
     * @param {number} segmentIndex - Index of the segment to edit (undefined for new segment)
     */
    openSegmentModal(segment, segmentIndex) {
        if (this.selectedBlock === null && segmentIndex === undefined) {
            alert('Please select a block first');
            return;
        }

        const modal = document.getElementById('segment-modal');
        const form = document.getElementById('segment-form');
        form.innerHTML = '';

        // If editing, store the segment index
        if (segmentIndex !== undefined) {
            form.dataset.segmentIndex = segmentIndex;
        } else {
            delete form.dataset.segmentIndex;
        }

        // Create form fields for segment properties
        const defaultSegment = segment || {
            type: 'text',
            style: {
                foreground: '#ffffff',
                background: '#000000'
            },
            text: 'New Segment'
        };

        // Segment type field
        const typeDiv = document.createElement('div');
        const typeLabel = document.createElement('label');
        typeLabel.textContent = 'Segment Type:';
        typeDiv.appendChild(typeLabel);

        const typeSelect = document.createElement('select');
        typeSelect.id = 'segment-type';

        // Common segment types in oh-my-posh
        const segmentTypes = [
            'text', 'path', 'git', 'exit', 'node', 'battery',
            'python', 'command', 'time', 'aws', 'os', 'root'
        ];

        segmentTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            if (defaultSegment.type === type) {
                option.selected = true;
            }
            typeSelect.appendChild(option);
        });
        typeDiv.appendChild(typeSelect);
        form.appendChild(typeDiv);

        // Text field (for text type)
        const textDiv = document.createElement('div');
        const textLabel = document.createElement('label');
        textLabel.textContent = 'Text:';
        textDiv.appendChild(textLabel);

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.id = 'segment-text';
        textInput.value = defaultSegment.text || '';
        textDiv.appendChild(textInput);
        form.appendChild(textDiv);

        // Style fields
        const styleFieldset = document.createElement('fieldset');
        const styleLegend = document.createElement('legend');
        styleLegend.textContent = 'Style';
        styleFieldset.appendChild(styleLegend);

        // Foreground color
        const fgDiv = document.createElement('div');
        const fgLabel = document.createElement('label');
        fgLabel.textContent = 'Foreground Color:';
        fgDiv.appendChild(fgLabel);

        const fgInput = document.createElement('input');
        fgInput.type = 'color';
        fgInput.id = 'segment-foreground';
        fgInput.value = defaultSegment.style?.foreground || '#ffffff';
        fgDiv.appendChild(fgInput);
        styleFieldset.appendChild(fgDiv);

        // Background color
        const bgDiv = document.createElement('div');
        const bgLabel = document.createElement('label');
        bgLabel.textContent = 'Background Color:';
        bgDiv.appendChild(bgLabel);

        const bgInput = document.createElement('input');
        bgInput.type = 'color';
        bgInput.id = 'segment-background';
        bgInput.value = defaultSegment.style?.background || '#000000';
        bgDiv.appendChild(bgInput);
        styleFieldset.appendChild(bgDiv);

        form.appendChild(styleFieldset);

        // PowerLine options
        const powerlineFieldset = document.createElement('fieldset');
        const powerlineLegend = document.createElement('legend');
        powerlineLegend.textContent = 'PowerLine Options';
        powerlineFieldset.appendChild(powerlineLegend);

        // PowerLine enable
        const plEnableDiv = document.createElement('div');
        const plEnableLabel = document.createElement('label');
        plEnableLabel.textContent = 'Enable PowerLine:';
        plEnableDiv.appendChild(plEnableLabel);

        const plEnableCheck = document.createElement('input');
        plEnableCheck.type = 'checkbox';
        plEnableCheck.id = 'segment-powerline';
        plEnableCheck.checked = defaultSegment.powerline || false;
        plEnableDiv.appendChild(plEnableCheck);
        powerlineFieldset.appendChild(plEnableDiv);

        form.appendChild(powerlineFieldset);

        // Show the modal
        modal.style.display = 'block';
    }

    /**
     * Save changes to a segment
     */
    saveSegmentChanges() {
        const form = document.getElementById('segment-form');
        const segmentIndex = form.dataset.segmentIndex !== undefined ? parseInt(form.dataset.segmentIndex) : undefined;

        // Get values from form
        const type = document.getElementById('segment-type').value;
        const text = document.getElementById('segment-text').value;
        const foreground = document.getElementById('segment-foreground').value;
        const background = document.getElementById('segment-background').value;
        const powerline = document.getElementById('segment-powerline').checked;

        // Create or update segment
        const segment = {
            type,
            style: {
                foreground,
                background
            }
        };

        // Only add text for text type segments
        if (type === 'text' && text) {
            segment.text = text;
        }

        if (powerline) {
            segment.powerline = true;
        }

        // Add segment to the current block
        if (segmentIndex !== undefined) {
            // Update existing segment
            this.currentConfig.blocks[this.selectedBlock].segments[segmentIndex] = segment;
        } else {
            // Add new segment
            if (!this.currentConfig.blocks[this.selectedBlock].segments) {
                this.currentConfig.blocks[this.selectedBlock].segments = [];
            }
            this.currentConfig.blocks[this.selectedBlock].segments.push(segment);
        }

        // Update UI
        this.updateJsonFromVisual();
        this.renderSegments(this.selectedBlock);

        // Select the segment
        const selectIndex = segmentIndex !== undefined ? segmentIndex :
            this.currentConfig.blocks[this.selectedBlock].segments.length - 1;
        this.selectSegment(selectIndex);
    }

    /**
     * Edit an existing segment
     * @param {number} segmentIndex - Index of the segment to edit
     */
    editSegment(segmentIndex) {
        if (this.selectedBlock === null) return;

        const segment = this.currentConfig.blocks[this.selectedBlock].segments[segmentIndex];
        this.openSegmentModal(segment, segmentIndex);
    }

    /**
     * Delete a segment
     * @param {number} segmentIndex - Index of the segment to delete
     */
    deleteSegment(segmentIndex) {
        if (this.selectedBlock === null) return;

        if (confirm('Are you sure you want to delete this segment?')) {
            this.currentConfig.blocks[this.selectedBlock].segments.splice(segmentIndex, 1);

            // Update UI
            this.updateJsonFromVisual();
            this.renderSegments(this.selectedBlock);

            // Reset segment selection
            this.selectedSegment = null;

            // Clear properties form
            document.getElementById('properties-form').innerHTML = '';
        }
    }
}

// Initialize the visual builder when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Monaco editor to be initialized first
    const checkMonacoInterval = setInterval(() => {
        if (window.monacoEditor) {
            clearInterval(checkMonacoInterval);
            window.visualBuilder = new VisualBuilder();
        }
    }, 100);
});