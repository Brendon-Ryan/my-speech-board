// Select elements
const configBtn = document.getElementById('config-btn');
const configModal = document.getElementById('config-modal');
const closeConfig = document.getElementById('close-config');
const activationModeSelect = document.getElementById('activation-mode');
const hoverTimeSelect = document.getElementById('hover-time');
const colorSchemeSelect = document.getElementById('color-scheme');
const voiceSelect = document.getElementById('voice-select');

let activationMode = 'hover'; // default
let hoverTime = 1000; // default 1 second
let selectedVoice = null;

// Function to speak a word
function speakWord(word) {
    console.log(`Attempting to speak: ${word}`); // Debugging log
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        if (selectedVoice) utterance.voice = selectedVoice;
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
    let speechLabel = newButton.getAttribute('data-speech-label') || word;
    if (activationMode === 'hover') {
        let hoverTimeout;
        newButton.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                speakWord(speechLabel);
            }, hoverTime);
        });
        newButton.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
        });
    } else {
        newButton.addEventListener('click', () => {
            speakWord(speechLabel);
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
    document.body.classList.remove(
        'default-scheme', 'dark-scheme', 'pastel-scheme', 'high-contrast-scheme', 'sunset-scheme',
        'ocean-breeze-scheme', 'lavender-dream-scheme', 'green-scheme',
        'colorblind-scheme', 'protanopia-scheme', 'protanomaly-scheme', 'deuteranopia-scheme',
        'deuteranomaly-scheme', 'tritanopia-scheme', 'tritanomaly-scheme', 'achromatopsia-scheme'
    );
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
        case 'ocean-breeze':
            document.body.classList.add('ocean-breeze-scheme');
            break;
        case 'lavender-dream':
            document.body.classList.add('lavender-dream-scheme');
            break;
        case 'green':
            document.body.classList.add('green-scheme');
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

// --- Voice Selection in Config Modal ---
function populateVoices() {
    if (!voiceSelect) return;
    const voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach((voice, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' [default]' : ''}`;
        voiceSelect.appendChild(option);
    });
    // Set selectedVoice to default
    if (voices.length > 0) {
        selectedVoice = voices[voiceSelect.selectedIndex || 0];
    }
}

if (voiceSelect) {
    function setSelectedVoice() {
        const voices = window.speechSynthesis.getVoices();
        selectedVoice = voices[voiceSelect.selectedIndex] || voices[0];
    }
    populateVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        populateVoices();
        setSelectedVoice();
    };
    voiceSelect.addEventListener('change', setSelectedVoice);
    // Always update selectedVoice before speaking
    document.addEventListener('mouseenter', function(e) {
        if (e.target && e.target.classList && e.target.classList.contains('word-btn')) {
            setSelectedVoice();
        }
    }, true);
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList && e.target.classList.contains('word-btn')) {
            setSelectedVoice();
        }
    }, true);
}

// Tab functionality for communication themes
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(btn => {
        // Remove previous listeners to avoid duplicates
        btn.replaceWith(btn.cloneNode(true));
    });
    // Re-select after replace
    const newTabButtons = document.querySelectorAll('.tab-btn');
    newTabButtons.forEach(btn => {
        const tabId = btn.getAttribute('data-tab');
        if (activationMode === 'hover') {
            let hoverTimeout;
            btn.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(() => {
                    switchTab(tabId);
                }, hoverTime);
            });
            btn.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });
        } else {
            btn.addEventListener('click', () => {
                switchTab(tabId);
            });
        }
    });
}

function switchTab(tabId) {
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
    // Activate this tab
    const btn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
    if (btn) btn.classList.add('active');
    const tabPanel = document.getElementById('tab-' + tabId);
    if (tabPanel) tabPanel.style.display = '';
    // Re-activate word buttons in the new tab
    updateAllButtonActivation();
}

// When activation mode changes, re-apply tab button activation
activationModeSelect.addEventListener('change', () => {
    if (tabButtons.length > 0 && tabContents.length > 0) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        const newTabButtons = document.querySelectorAll('.tab-btn');
        newTabButtons.forEach(btn => {
            const tabId = btn.getAttribute('data-tab');
            if (activationMode === 'hover') {
                let hoverTimeout;
                btn.addEventListener('mouseenter', () => {
                    hoverTimeout = setTimeout(() => {
                        switchTab(tabId);
                    }, hoverTime);
                });
                btn.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimeout);
                });
            } else {
                btn.addEventListener('click', () => {
                    switchTab(tabId);
                });
            }
        });
    }
});

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
    // Add to last row if it has < 10 cells, else create new row
    let lastRow = table.rows[table.rows.length - 1];
    if (!lastRow || lastRow.cells.length >= 10) {
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

// Add Edit Mode, Save, and Icons buttons to the UI
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

const iconsBtn = document.createElement('button');
iconsBtn.id = 'icons-btn';
iconsBtn.textContent = 'Icons';
iconsBtn.style.position = 'absolute';
iconsBtn.style.top = '60px';
iconsBtn.style.left = '30px';
iconsBtn.style.zIndex = '1001';
iconsBtn.style.display = 'none';
document.body.appendChild(iconsBtn);

saveBtn.addEventListener('click', () => {
    // Save functionality to be implemented
});

editModeBtn.addEventListener('click', () => {
    editMode = !editMode;
    editModeBtn.textContent = editMode ? 'Disable Edit Mode' : 'Enable Edit Mode';
    document.body.classList.toggle('edit-mode', editMode);
    // Show or hide the Icons button based on edit mode
    iconsBtn.style.display = editMode ? 'block' : 'none';
    // First, ensure all rows have 10 cells and empty-drop-spot classes are set
    document.querySelectorAll('.word-table').forEach(table => {
        if (editMode) {
            Array.from(table.rows).forEach(row => {
                while (row.cells.length < 10) {
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
    // In edit mode, ensure all rows have 10 cells (so there are empty cells to drop into)
    if (editMode) {
        Array.from(table.rows).forEach(row => {
            while (row.cells.length < 10) {
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

// When the Icons button is clicked, toggle between icons and text labels for word buttons
let iconsMode = false;
iconsBtn.addEventListener('click', () => {
    iconsMode = !iconsMode;
    document.querySelectorAll('.word-btn').forEach(btn => {
        if (iconsMode) {
            // Store original label if not already stored
            if (!btn.hasAttribute('data-original-label')) {
                btn.setAttribute('data-original-label', btn.textContent);
            }
            const label = btn.getAttribute('data-original-label').trim().toLowerCase();
            let icon = '';
            // Simple mapping for demonstration; expand as needed
            switch (label) {
                // General
                case 'yes': icon = '👍'; break;
                case 'no': icon = '👎'; break;
                case 'hello': icon = '👋'; break;
                case 'goodbye': icon = '👋'; break;
                case 'stop': icon = '✋'; break;
                case 'go': icon = '🏃'; break;
                case 'help': icon = '🆘'; break;
                case 'love': icon = '❤️'; break;
                // Food & Drink
                case 'eat': icon = '🍽️'; break;
                case 'food': icon = '🍲'; break;
                case 'snack': icon = '🍪'; break;
                case 'breakfast': icon = '🥞'; break;
                case 'lunch': icon = '🥪'; break;
                case 'dinner': icon = '🍝'; break;
                case 'fruit': icon = '🍎'; break;
                case 'apple': icon = '🍏'; break;
                case 'banana': icon = '🍌'; break;
                case 'orange': icon = '🍊'; break;
                case 'grape': icon = '🍇'; break;
                case 'strawberry': icon = '🍓'; break;
                case 'vegetable': icon = '🥦'; break;
                case 'carrot': icon = '🥕'; break;
                case 'broccoli': icon = '🥦'; break;
                case 'potato': icon = '🥔'; break;
                case 'rice': icon = '🍚'; break;
                case 'bread': icon = '🍞'; break;
                case 'cheese': icon = '🧀'; break;
                case 'egg': icon = '🥚'; break;
                case 'meat': icon = '🥩'; break;
                case 'chicken': icon = '🍗'; break;
                case 'fish': icon = '🐟'; break;
                case 'pizza': icon = '🍕'; break;
                case 'burger': icon = '🍔'; break;
                case 'sandwich': icon = '🥪'; break;
                case 'soup': icon = '🥣'; break;
                case 'salad': icon = '🥗'; break;
                case 'ice cream': icon = '🍦'; break;
                case 'cookie': icon = '🍪'; break;
                case 'cake': icon = '🍰'; break;
                case 'candy': icon = '🍬'; break;
                case 'drink': icon = '🥤'; break;
                case 'water': icon = '💧'; break;
                case 'milk': icon = '🥛'; break;
                case 'juice': icon = '🧃'; break;
                case 'tea': icon = '🍵'; break;
                case 'coffee': icon = '☕'; break;
                // Bathroom & Hygiene
                case 'bathroom': icon = '🚻'; break;
                case 'toilet': icon = '🚽'; break;
                case 'wash': icon = '🧼'; break;
                case 'shower': icon = '🚿'; break;
                case 'brush': icon = '🪥'; break;
                case 'soap': icon = '🧴'; break;
                // Emotions
                case 'happy': icon = '😊'; break;
                case 'sad': icon = '😢'; break;
                case 'angry': icon = '😠'; break;
                case 'tired': icon = '😴'; break;
                case 'scared': icon = '😱'; break;
                case 'excited': icon = '🤩'; break;
                case 'bored': icon = '🥱'; break;
                case 'sick': icon = '🤒'; break;
                // Activities
                case 'play': icon = '🎲'; break;
                case 'read': icon = '📖'; break;
                case 'write': icon = '✍️'; break;
                case 'draw': icon = '🎨'; break;
                case 'sing': icon = '🎤'; break;
                case 'dance': icon = '💃'; break;
                case 'run': icon = '🏃'; break;
                case 'walk': icon = '🚶'; break;
                case 'jump': icon = '🤸'; break;
                case 'swim': icon = '🏊'; break;
                // People & Places
                case 'home': icon = '🏠'; break;
                case 'school': icon = '🏫'; break;
                case 'friend': icon = '🧑‍🤝‍🧑'; break;
                case 'family': icon = '👨‍👩‍👧‍👦'; break;
                case 'teacher': icon = '🧑‍🏫'; break;
                case 'mom': icon = '👩'; break;
                case 'dad': icon = '👨'; break;
                case 'sister': icon = '👧'; break;
                case 'brother': icon = '👦'; break;
                case 'grandma': icon = '👵'; break;
                case 'grandpa': icon = '👴'; break;
                // Colors
                case 'red': icon = '🟥'; break;
                case 'blue': icon = '🟦'; break;
                case 'green': icon = '🟩'; break;
                case 'yellow': icon = '🟨'; break;
                case 'orange': icon = '🟧'; break;
                case 'purple': icon = '🟪'; break;
                case 'pink': icon = '🩷'; break;
                case 'black': icon = '⬛'; break;
                case 'white': icon = '⬜'; break;
                case 'brown': icon = '🟫'; break;
                case 'gray': icon = '⬜'; break;
                // Numbers
                case 'one': icon = '1️⃣'; break;
                case 'two': icon = '2️⃣'; break;
                case 'three': icon = '3️⃣'; break;
                case 'four': icon = '4️⃣'; break;
                case 'five': icon = '5️⃣'; break;
                case 'six': icon = '6️⃣'; break;
                case 'seven': icon = '7️⃣'; break;
                case 'eight': icon = '8️⃣'; break;
                case 'nine': icon = '9️⃣'; break;
                case 'ten': icon = '🔟'; break;
                // Days/Time
                case 'day': icon = '🌞'; break;
                case 'night': icon = '🌜'; break;
                case 'morning': icon = '🌅'; break;
                case 'afternoon': icon = '🏙️'; break;
                case 'evening': icon = '🌇'; break;
                case 'today': icon = '📅'; break;
                case 'tomorrow': icon = '⏭️'; break;
                case 'yesterday': icon = '⏮️'; break;
                // Weather
                case 'sun': icon = '☀️'; break;
                case 'rain': icon = '🌧️'; break;
                case 'cloud': icon = '☁️'; break;
                case 'snow': icon = '❄️'; break;
                case 'wind': icon = '💨'; break;
                case 'hot': icon = '🥵'; break;
                case 'cold': icon = '🥶'; break;
                // Transport
                case 'car': icon = '🚗'; break;
                case 'bus': icon = '🚌'; break;
                case 'train': icon = '🚆'; break;
                case 'bike': icon = '🚲'; break;
                case 'plane': icon = '✈️'; break;
                case 'boat': icon = '⛵'; break;
                // Technology
                case 'phone': icon = '📱'; break;
                case 'computer': icon = '💻'; break;
                case 'tv': icon = '📺'; break;
                case 'camera': icon = '📷'; break;
                // Animals
                case 'dog': icon = '🐶'; break;
                case 'cat': icon = '🐱'; break;
                case 'bird': icon = '🐦'; break;
                case 'fish': icon = '🐟'; break;
                case 'horse': icon = '🐴'; break;
                case 'cow': icon = '🐮'; break;
                case 'pig': icon = '🐷'; break;
                case 'sheep': icon = '🐑'; break;
                case 'chicken': icon = '🐔'; break;
                case 'duck': icon = '🦆'; break;
                case 'rabbit': icon = '🐰'; break;
                case 'frog': icon = '🐸'; break;
                // Default fallback
                default:
                    icon = label.charAt(0).toUpperCase();
            }
            btn.innerHTML = `<span style="font-size:1.5em;">${icon}</span>`;
            // Always keep the original label in a data attribute for speech
            btn.setAttribute('data-speech-label', btn.getAttribute('data-original-label'));
        } else {
            // Restore original label
            if (btn.hasAttribute('data-original-label')) {
                btn.textContent = btn.getAttribute('data-original-label');
                btn.removeAttribute('data-original-label');
                btn.removeAttribute('data-speech-label');
            }
        }
    });
    // Re-activate word buttons after toggling icons/text
    updateAllButtonActivation();
});

// Voice test button functionality
const voiceTestBtn = document.getElementById('voice-test-btn');
if (voiceTestBtn) {
    voiceTestBtn.addEventListener('click', () => {
        speakWord('I am your selected voice');
    });
}