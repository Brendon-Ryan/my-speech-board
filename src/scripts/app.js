// Select elements
const configBtn = document.getElementById('config-btn');
const configModal = document.getElementById('config-modal');
const closeConfig = document.getElementById('close-config');
const activationModeSelect = document.getElementById('activation-mode');
const hoverTimeSelect = document.getElementById('hover-time');
const colorSchemeSelect = document.getElementById('color-scheme');

let activationMode = 'hover'; // default
let hoverTime = 1000; // default 1 second

// Function to speak a word
function speakWord(word) {
    console.log(`Attempting to speak: ${word}`); // Debugging log
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        window.speechSynthesis.speak(utterance);
    } else {
        console.error('Web Speech API is not supported in this browser.');
    }
}

// Show/hide hover time section based on mode
function updateHoverTimeVisibility() {
    const section = document.getElementById('hover-time-section');
    section.style.display = (activationMode === 'hover') ? 'block' : 'none';
}

// Show modal
configBtn.addEventListener('click', () => {
    configModal.style.display = 'block';
    updateHoverTimeVisibility();
});
// Hide modal
closeConfig.addEventListener('click', () => {
    configModal.style.display = 'none';
});
window.addEventListener('click', (event) => {
    if (event.target === configModal) {
        configModal.style.display = 'none';
    }
});
// Change activation mode
activationModeSelect.addEventListener('change', (e) => {
    activationMode = e.target.value;
    updateHoverTimeVisibility();
    updateAllButtonActivation();
});
// Change hover time
hoverTimeSelect.addEventListener('change', (e) => {
    hoverTime = parseInt(e.target.value, 10);
    updateAllButtonActivation();
});

// --- Activation logic for word buttons ---
function clearButtonActivation(button) {
    button.replaceWith(button.cloneNode(true)); // Remove all listeners
}
function setButtonActivation(button, word) {
    // Remove all listeners by replacing the node
    const newButton = button.cloneNode(true);
    if (activationMode === 'hover') {
        let hoverTimeout;
        newButton.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                speakWord(word);
            }, hoverTime);
        });
        newButton.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
        });
    } else {
        newButton.addEventListener('click', () => {
            speakWord(word);
        });
    }
    button.parentNode.replaceChild(newButton, button);
    return newButton;
}
function updateAllButtonActivation() {
    const buttons = document.querySelectorAll('.word-btn');
    buttons.forEach(button => {
        setButtonActivation(button, button.textContent);
    });
}

// Initial activation for existing buttons
updateAllButtonActivation();

speakWord('Test');

const testButton = document.createElement('button');
testButton.textContent = 'Speak Test';
document.body.appendChild(testButton);

testButton.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance('This is a test');
    window.speechSynthesis.speak(utterance);
});

// Set default color scheme on load
function applyColorScheme(scheme) {
    document.body.classList.remove('default-scheme', 'dark-scheme', 'pastel-scheme', 'high-contrast-scheme', 'sunset-scheme');
    switch (scheme) {
        case 'dark':
            document.body.classList.add('dark-scheme');
            break;
        case 'pastel':
            document.body.classList.add('pastel-scheme');
            break;
        case 'high-contrast':
            document.body.classList.add('high-contrast-scheme');
            break;
        case 'sunset':
            document.body.classList.add('sunset-scheme');
            break;
        case 'colorblind':
            document.body.classList.add('colorblind-scheme');
            break;
        case 'protanopia':
            document.body.classList.add('protanopia-scheme');
            break;
        case 'protanomaly':
            document.body.classList.add('protanomaly-scheme');
            break;
        case 'deuteranopia':
            document.body.classList.add('deuteranopia-scheme');
            break;
        case 'deuteranomaly':
            document.body.classList.add('deuteranomaly-scheme');
            break;
        case 'tritanopia':
            document.body.classList.add('tritanopia-scheme');
            break;
        case 'tritanomaly':
            document.body.classList.add('tritanomaly-scheme');
            break;
        case 'achromatopsia':
            document.body.classList.add('achromatopsia-scheme');
            break;
        default:
            document.body.classList.add('default-scheme');
    }
}

// Set initial color scheme based on select value
function getInitialColorScheme() {
    return colorSchemeSelect.value || 'default';
}

document.addEventListener('DOMContentLoaded', () => {
    // Set the color scheme select to default if not set
    colorSchemeSelect.value = 'default';
    hoverTimeSelect.value = '1000'; // Set default hover time to 1s
    applyColorScheme(getInitialColorScheme());
});

colorSchemeSelect.addEventListener('change', (e) => {
    applyColorScheme(e.target.value);
});
// Set initial color scheme
applyColorScheme('default');

// Tab functionality for communication themes
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            // Hide all tab contents
            tabContents.forEach(tc => tc.style.display = 'none');
            // Activate this tab
            btn.classList.add('active');
            const tabId = 'tab-' + btn.getAttribute('data-tab');
            const tabPanel = document.getElementById(tabId);
            if (tabPanel) tabPanel.style.display = '';
            // Re-activate word buttons in the new tab
            updateAllButtonActivation();
        });
    });
}

// Add a new word to the current tab
const addWordBtn = document.getElementById('add-word-btn');
const wordInput = document.getElementById('word-input');

addWordBtn.addEventListener('click', () => {
    const word = wordInput.value.trim();
    if (!word) return;
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const tabContent = document.getElementById(`tab-${activeTab}`);
    let table = tabContent.querySelector('.word-table');
    if (!table) {
        // If no table exists, create one
        table = document.createElement('table');
        table.className = 'word-table';
        tabContent.appendChild(table);
    }
    // Add to last row if it has < 8 cells, else create new row
    let lastRow = table.rows[table.rows.length - 1];
    if (!lastRow || lastRow.cells.length >= 8) {
        lastRow = table.insertRow();
    }
    const cell = lastRow.insertCell();
    const btn = document.createElement('button');
    btn.className = 'word-btn';
    btn.textContent = word;
    cell.appendChild(btn);
    setButtonActivation(btn, word); // Ensure new button is interactive
    wordInput.value = '';
    enableDragAndDropOnAllTables(); // Re-enable drag and drop after adding new word
});

// Allow Enter key to add word
wordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addWordBtn.click();
    }
});

// --- Edit Mode Toggle ---
let editMode = false;

// Add Edit Mode and Save buttons to the UI
const editModeBtn = document.createElement('button');
editModeBtn.id = 'edit-mode-btn';
editModeBtn.textContent = 'Enable Edit Mode';
editModeBtn.style.position = 'absolute';
editModeBtn.style.top = '20px';
editModeBtn.style.left = '30px';
editModeBtn.style.zIndex = '1001';
document.body.appendChild(editModeBtn);

const saveBtn = document.createElement('button');
saveBtn.id = 'save-btn';
saveBtn.textContent = 'Save';
saveBtn.style.position = 'absolute';
saveBtn.style.top = '20px';
saveBtn.style.left = '170px';
saveBtn.style.zIndex = '1001';
document.body.appendChild(saveBtn);

saveBtn.addEventListener('click', () => {
    // Save functionality to be implemented
});

editModeBtn.addEventListener('click', () => {
    editMode = !editMode;
    editModeBtn.textContent = editMode ? 'Disable Edit Mode' : 'Enable Edit Mode';
    document.body.classList.toggle('edit-mode', editMode);
    // First, ensure all rows have 8 cells and empty-drop-spot classes are set
    document.querySelectorAll('.word-table').forEach(table => {
        if (editMode) {
            Array.from(table.rows).forEach(row => {
                while (row.cells.length < 8) {
                    const newCell = row.insertCell();
                    newCell.classList.add('empty-drop-spot');
                }
            });
            // Add empty-drop-spot class to all empty cells
            table.querySelectorAll('td').forEach(td => {
                if (td.children.length === 0) {
                    td.classList.add('empty-drop-spot');
                } else {
                    td.classList.remove('empty-drop-spot');
                }
            });
        } else {
            // Remove empty-drop-spot class when leaving edit mode
            table.querySelectorAll('td').forEach(td => td.classList.remove('empty-drop-spot'));
        }
    });
    // Now enable drag and drop (must be after cell creation for listeners to attach)
    enableDragAndDropOnAllTables();
});

// --- Drag and Drop for Word Buttons ---
function enableDragAndDropOnTable(table) {
    if (!table) return;
    // Make all word buttons draggable only in edit mode
    table.querySelectorAll('.word-btn').forEach(btn => {
        if (editMode) {
            btn.setAttribute('draggable', 'true');
            // Remove previous listeners to avoid duplicates
            btn.removeEventListener('dragstart', handleDragStart);
            btn.removeEventListener('dragend', handleDragEnd);
            btn.addEventListener('dragstart', handleDragStart);
            btn.addEventListener('dragend', handleDragEnd);
        } else {
            btn.removeAttribute('draggable');
            btn.removeEventListener('dragstart', handleDragStart);
            btn.removeEventListener('dragend', handleDragEnd);
        }
    });
    // Make all table cells droppable only in edit mode
    table.querySelectorAll('td').forEach(td => {
        if (editMode) {
            // Remove previous listeners to avoid duplicates
            td.removeEventListener('dragover', handleDragOver);
            td.removeEventListener('drop', handleDrop);
            td.removeEventListener('dragenter', handleDragEnter);
            td.removeEventListener('dragleave', handleDragLeave);
            td.addEventListener('dragover', handleDragOver);
            td.addEventListener('drop', handleDrop);
            td.addEventListener('dragenter', handleDragEnter);
            td.addEventListener('dragleave', handleDragLeave);
            // Add a class to visually indicate empty drop spots in edit mode
            if (td.children.length === 0) {
                td.classList.add('empty-drop-spot');
            } else {
                td.classList.remove('empty-drop-spot');
            }
        } else {
            td.removeEventListener('dragover', handleDragOver);
            td.removeEventListener('drop', handleDrop);
            td.removeEventListener('dragenter', handleDragEnter);
            td.removeEventListener('dragleave', handleDragLeave);
            td.classList.remove('drag-over');
            td.classList.remove('empty-drop-spot');
        }
    });
    // In edit mode, ensure all rows have 8 cells (so there are empty cells to drop into)
    if (editMode) {
        Array.from(table.rows).forEach(row => {
            while (row.cells.length < 8) {
                row.insertCell();
            }
        });
    }
}

let draggedBtn = null;
function handleDragStart(e) {
    draggedBtn = this;
    setTimeout(() => this.classList.add('dragging'), 0);
    e.dataTransfer.effectAllowed = 'move';
}
function handleDragEnd() {
    this.classList.remove('dragging');
    draggedBtn = null;
}
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}
function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    if (!draggedBtn) return;
    const targetCell = this;
    const sourceCell = draggedBtn.parentNode;
    if (targetCell === sourceCell) return;
    // If dropping onto an empty cell, just move the button
    if (targetCell.children.length === 0) {
        targetCell.appendChild(draggedBtn);
        // Remove empty-drop-spot class since it's no longer empty
        targetCell.classList.remove('empty-drop-spot');
        // If source cell is now empty, add empty-drop-spot class
        if (sourceCell.children.length === 0) {
            sourceCell.classList.add('empty-drop-spot');
        }
    } else {
        // If dropping onto a cell with a button, swap them
        const targetBtn = targetCell.querySelector('.word-btn');
        sourceCell.appendChild(targetBtn);
        targetCell.appendChild(draggedBtn);
    }
    updateAllButtonActivation();
    enableDragAndDropOnAllTables();
}
function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}
function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function enableDragAndDropOnAllTables() {
    document.querySelectorAll('.word-table').forEach(enableDragAndDropOnTable);
}

document.addEventListener('DOMContentLoaded', () => {
    enableDragAndDropOnAllTables();
});