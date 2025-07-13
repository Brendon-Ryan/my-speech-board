// Select elements
const wordInput = document.getElementById('word-input');
const addWordBtn = document.getElementById('add-word-btn');
const wordList = document.getElementById('word-list');
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

// Add event listener to the "Add Word" button
addWordBtn.addEventListener('click', () => {
    const word = wordInput.value.trim();

    if (word) {
        // Find the table
        const wordTable = document.getElementById('word-table');

        // Create a new table row if the last row has 3 buttons
        let lastRow = wordTable.rows[wordTable.rows.length - 1];
        if (!lastRow || lastRow.cells.length === 3) {
            lastRow = wordTable.insertRow();
        }

        // Add a new cell with the button
        const cell = lastRow.insertCell();
        const button = document.createElement('button');
        button.textContent = word;
        button.className = 'word-btn';

        // Set activation mode for new button
        setButtonActivation(button, word);

        // Append the button to the cell
        cell.appendChild(button);

        // Clear the input field
        wordInput.value = '';
    }
});

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