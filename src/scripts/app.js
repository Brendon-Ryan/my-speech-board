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

// --- Drag and Drop for Word Buttons ---
function enableDragAndDropOnTable(table) {
    if (!table) return;
    // Make all word buttons draggable
    table.querySelectorAll('.word-btn').forEach(btn => {
        btn.setAttribute('draggable', 'true');
        btn.addEventListener('dragstart', handleDragStart);
        btn.addEventListener('dragend', handleDragEnd);
    });
    // Make all table cells droppable
    table.querySelectorAll('td').forEach(td => {
        td.addEventListener('dragover', handleDragOver);
        td.addEventListener('drop', handleDrop);
        td.addEventListener('dragenter', handleDragEnter);
        td.addEventListener('dragleave', handleDragLeave);
    });
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