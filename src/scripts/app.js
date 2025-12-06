// Restore Speech button functionality for static HTML button
const speechBtn = document.getElementById('speech-btn');
if (speechBtn) {
    speechBtn.addEventListener('mouseenter', () => {
        speechBtn.style.background = '#eafbe7';
    });
    speechBtn.addEventListener('mouseleave', () => {
        speechBtn.style.background = '#fff';
    });
    speechBtn.addEventListener('click', () => {
        window.location.reload();
    });
}
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
    if (tabPanel) tabPanel.style.display = 'block';
    // Re-activate word buttons in the new tab
    updateAllButtonActivation();
    // Re-bind QWERTY keyboard activation if present
    if (tabId === 'search') {
        bindQwertyKeyboardActivation();
    }
}

// Helper to (re)bind QWERTY keyboard activation to match activationMode
function bindQwertyKeyboardActivation() {
    const qwertyTabPanel = document.getElementById('tab-search');
    if (!qwertyTabPanel) return;
    const searchInput = qwertyTabPanel.querySelector('.search-input');
    qwertyTabPanel.querySelectorAll('.qwerty-key').forEach(keyBtn => {
        // Remove all previous listeners by replacing the node
        const key = keyBtn.textContent === '␣' ? 'Space' : (keyBtn.textContent === '⌫' ? 'Backspace' : keyBtn.textContent);
        if (key === 'SEARCH') return;
        const newBtn = keyBtn.cloneNode(true);
        const activateKey = () => {
            if (key === 'Space') {
                searchInput.value += ' ';
            } else if (key === 'Backspace') {
                searchInput.value = searchInput.value.slice(0, -1);
            } else {
                searchInput.value += key;
            }
            searchInput.focus();
        };
        if (activationMode === 'hover') {
            let hoverTimeout;
            newBtn.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(activateKey, hoverTime);
            });
            newBtn.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });
        } else {
            newBtn.addEventListener('click', activateKey);
        }
        keyBtn.parentNode.replaceChild(newBtn, keyBtn);
    });
}
// When activation mode changes, re-apply tab button activation and QWERTY keyboard activation
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
    // Also re-bind QWERTY keyboard activation if present
    bindQwertyKeyboardActivation();
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
    enableTouchDragAndDropOnAllTables(); // Re-enable touch drag and drop
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
saveBtn.style.left = '230px'; // Increased from 170px to avoid overlap with "Disable Edit Mode"
saveBtn.style.zIndex = '1001';
saveBtn.disabled = true;
saveBtn.style.opacity = '0.5';
saveBtn.style.cursor = 'not-allowed';
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



// Restore Film / TV button functionality for static HTML button
const filmBtn = document.getElementById('film-btn');
if (filmBtn) {
    filmBtn.addEventListener('mouseenter', () => {
        filmBtn.style.background = '#eaf6ff';
    });
    filmBtn.addEventListener('mouseleave', () => {
        filmBtn.style.background = '#fff';
    });
    filmBtn.addEventListener('click', () => {
        // Show streaming buttons and label when Film/TV is selected
        streamingLabel.style.display = 'block';
        netflixBtn.style.display = 'flex';
        stanBtn.style.display = 'flex';
        disneyBtn.style.display = 'flex';
        primeBtn.style.display = 'flex';
        paramountBtn.style.display = 'flex';
        bingeBtn.style.display = 'flex';
        // Remove all existing tab buttons and tab content panels
        document.querySelectorAll('.tab-btn').forEach(btn => btn.parentNode && btn.parentNode.removeChild(btn));
        document.querySelectorAll('.tab-content').forEach(tc => tc.parentNode && tc.parentNode.removeChild(tc));

        // Hide Add New Word UI (button and input)
        const addWordBtn = document.getElementById('add-word-btn');
        if (addWordBtn) addWordBtn.style.display = 'none';
        const wordInput = document.getElementById('word-input');
        if (wordInput) wordInput.style.display = 'none';

        // Ensure tab bar exists, or create it after the Word Board
        let tabBar = document.querySelector('.tab-bar');
        if (!tabBar) {
            // Find the Word Board element (assume it has id 'word-board' or class 'word-board')
            let wordBoard = document.getElementById('word-board');
            if (!wordBoard) {
                wordBoard = document.querySelector('.word-board');
            }
            tabBar = document.createElement('div');
            tabBar.className = 'tab-bar';
            if (wordBoard && wordBoard.parentNode) {
                if (wordBoard.nextSibling) {
                    wordBoard.parentNode.insertBefore(tabBar, wordBoard.nextSibling);
                } else {
                    wordBoard.parentNode.appendChild(tabBar);
                }
            } else if (document.body.firstChild) {
                document.body.insertBefore(tabBar, document.body.firstChild);
            } else {
                document.body.appendChild(tabBar);
            }
        } else {
            tabBar.innerHTML = '';
        }

        // Define new tabs
        const newTabs = [
            { label: 'Popular', id: 'popular' },
            { label: 'Movies', id: 'movies' },
            { label: 'TV Shows', id: 'tvshows' },
            { label: 'Genres', id: 'genres' },
            { label: 'Search', id: 'search' }
        ];
        // Add new tab buttons
        newTabs.forEach((tab, idx) => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn';
            btn.setAttribute('data-tab', tab.id);
            btn.textContent = tab.label;
            if (idx === 0) btn.classList.add('active');
            tabBar.appendChild(btn);
        });
        // Add new tab content panels as siblings immediately after the tab bar
        let nextElem = tabBar.nextSibling;
        newTabs.forEach((tab, idx) => {
            const tabPanel = document.createElement('div');
            tabPanel.className = 'tab-content';
            tabPanel.id = 'tab-' + tab.id;
            if (idx !== 0) tabPanel.style.display = 'none';
            // ...existing code for populating tab content (movies, tvshows, genres, search)...
            // This code is unchanged and will be executed as before
            // (see previous implementation for details)
            // ...existing code...
            tabBar.parentNode.insertBefore(tabPanel, nextElem);
        });
        // Re-activate tab button logic
        const newTabButtons = tabBar.querySelectorAll('.tab-btn');
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
    });
}


// Helper to create a streaming button (vertical stack)
function createStreamingBtn({ id, title, top, logoUrl, borderColor, bgColor, hoverBg, logoAlt, fullLogo }) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.title = title;
    btn.style.position = 'absolute';
    btn.style.top = top;
    btn.style.right = '30px';
    btn.style.zIndex = '1001';
    btn.style.background = bgColor;
    btn.style.border = `2px solid ${borderColor}`;
    btn.style.borderRadius = '8px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 8px rgba(44,62,80,0.08)';
    btn.style.transition = 'background 0.2s, border 0.2s, opacity 0.2s';
    btn.style.display = 'none'; // hidden by default
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.padding = '0';
    btn.style.width = '60px';
    btn.style.height = '60px';
    btn.style.opacity = '1';
    if (fullLogo) {
        btn.innerHTML = `<img src="${logoUrl}" alt="${logoAlt}" style="width:100%;height:100%;object-fit:contain;display:block;">`;
    } else {
        btn.innerHTML = `<img src="${logoUrl}" alt="${logoAlt}" style="width:40px;height:40px;object-fit:contain;display:block;">`;
    }
    btn.addEventListener('mouseenter', () => {
        btn.style.background = hoverBg;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.background = bgColor;
    });
    let ghosted = false;
    btn.addEventListener('click', () => {
        ghosted = !ghosted;
        btn.style.opacity = ghosted ? '0.4' : '1';
    });
    document.body.appendChild(btn);
    return btn;
}

// Add a label above the Netflix button
const streamingLabel = document.createElement('div');
streamingLabel.textContent = 'Toggle Services';
streamingLabel.style.position = 'absolute';
streamingLabel.style.top = '135px';
streamingLabel.style.right = '30px';
streamingLabel.style.zIndex = '1001';
// No background, no padding, no border radius, no box shadow
streamingLabel.style.background = 'none';
streamingLabel.style.padding = '0';
streamingLabel.style.borderRadius = '0';
streamingLabel.style.boxShadow = 'none';
streamingLabel.style.fontWeight = 'normal';
streamingLabel.style.fontSize = '0.95em';
streamingLabel.style.color = '#222';
streamingLabel.style.display = 'none'; // hidden by default, shown with buttons
document.body.appendChild(streamingLabel);

// 2-column layout for streaming buttons
const streamingBtnPositions = [
    { top: 170, right: 30 },   // Netflix (col 1)
    { top: 170, right: 100 },  // Stan (col 2)
    { top: 240, right: 30 },   // Disney+ (col 1)
    { top: 240, right: 100 },  // Prime (col 2)
    { top: 310, right: 30 },   // Paramount+ (col 1)
    { top: 310, right: 100 }   // Binge (col 2)
];

const netflixBtn = createStreamingBtn({
    id: 'netflix-btn',
    title: 'Netflix',
    top: streamingBtnPositions[0].top + 'px',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    borderColor: '#e50914',
    bgColor: '#141414',
    hoverBg: '#e50914',
    logoAlt: 'Netflix Logo'
});
const stanBtn = createStreamingBtn({
    id: 'stan-btn',
    title: 'Stan',
    top: streamingBtnPositions[1].top + 'px',
    logoUrl: 'scripts/stan-logo.png', // Path relative to index.html
    borderColor: '#0a6cff',
    bgColor: '#fff',
    hoverBg: '#0a6cff22',
    logoAlt: 'Stan Logo',
    fullLogo: true
});
const disneyBtn = createStreamingBtn({
    id: 'disney-btn',
    title: 'Disney+',
    top: streamingBtnPositions[2].top + 'px',
    logoUrl: 'scripts/disney-logo.png', // Path relative to index.html
    borderColor: '#113ccf',
    bgColor: '#fff',
    hoverBg: '#113ccf22',
    logoAlt: 'Disney+ Logo',
    fullLogo: true
});
const primeBtn = createStreamingBtn({
    id: 'prime-btn',
    title: 'Prime',
    top: streamingBtnPositions[3].top + 'px',
    logoUrl: 'scripts/prime-video-logo.png', // Path relative to index.html
    borderColor: '#00a8e1',
    bgColor: '#fff',
    hoverBg: '#00a8e122',
    logoAlt: 'Prime Video Logo',
    fullLogo: true
});
const paramountBtn = createStreamingBtn({
    id: 'paramount-btn',
    title: 'Paramount+',
    top: streamingBtnPositions[4].top + 'px',
    logoUrl: 'scripts/paramount-plus-logo.png', // Path relative to index.html
    borderColor: '#0064d2',
    bgColor: '#fff',
    hoverBg: '#0064d222',
    logoAlt: 'Paramount+ Logo',
    fullLogo: true
});
const bingeBtn = createStreamingBtn({
    id: 'binge-btn',
    title: 'Binge',
    top: streamingBtnPositions[5].top + 'px',
    logoUrl: 'scripts/binge_logo.png', // Path relative to index.html
    borderColor: '#e6007a',
    bgColor: '#fff',
    hoverBg: '#e6007a22',
    logoAlt: 'Binge Logo',
    fullLogo: true
});
// Set right position for each button
netflixBtn.style.right = streamingBtnPositions[0].right + 'px';
stanBtn.style.right = streamingBtnPositions[1].right + 'px';
disneyBtn.style.right = streamingBtnPositions[2].right + 'px';
primeBtn.style.right = streamingBtnPositions[3].right + 'px';
paramountBtn.style.right = streamingBtnPositions[4].right + 'px';
bingeBtn.style.right = streamingBtnPositions[5].right + 'px';

// Remove all main tabs when Film/TV button is clicked
filmBtn.addEventListener('click', () => {
    // Show streaming buttons and label when Film/TV is selected
    streamingLabel.style.display = 'block';
    netflixBtn.style.display = 'flex';
    stanBtn.style.display = 'flex';
    disneyBtn.style.display = 'flex';
    primeBtn.style.display = 'flex';
    paramountBtn.style.display = 'flex';
    bingeBtn.style.display = 'flex';
    // Remove all existing tab buttons and tab content panels
    document.querySelectorAll('.tab-btn').forEach(btn => btn.parentNode && btn.parentNode.removeChild(btn));
    document.querySelectorAll('.tab-content').forEach(tc => tc.parentNode && tc.parentNode.removeChild(tc));

    // Hide Add New Word UI (button and input)
    const addWordBtn = document.getElementById('add-word-btn');
    if (addWordBtn) addWordBtn.style.display = 'none';
    const wordInput = document.getElementById('word-input');
    if (wordInput) wordInput.style.display = 'none';

    // Ensure tab bar exists, or create it after the Word Board
    let tabBar = document.querySelector('.tab-bar');
    if (!tabBar) {
        // Find the Word Board element (assume it has id 'word-board' or class 'word-board')
        let wordBoard = document.getElementById('word-board');
        if (!wordBoard) {
            wordBoard = document.querySelector('.word-board');
        }
        tabBar = document.createElement('div');
        tabBar.className = 'tab-bar';
        if (wordBoard && wordBoard.parentNode) {
            if (wordBoard.nextSibling) {
                wordBoard.parentNode.insertBefore(tabBar, wordBoard.nextSibling);
            } else {
                wordBoard.parentNode.appendChild(tabBar);
            }
        } else if (document.body.firstChild) {
            document.body.insertBefore(tabBar, document.body.firstChild);
        } else {
            document.body.appendChild(tabBar);
        }
    } else {
        tabBar.innerHTML = '';
    }

    // Define new tabs
    const newTabs = [
        { label: 'Popular', id: 'popular' },
        { label: 'Movies', id: 'movies' },
        { label: 'TV Shows', id: 'tvshows' },
        { label: 'Genres', id: 'genres' },
        { label: 'Search', id: 'search' }
    ];
    // Add new tab buttons
    newTabs.forEach((tab, idx) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.setAttribute('data-tab', tab.id);
        btn.textContent = tab.label;
        if (idx === 0) btn.classList.add('active');
        tabBar.appendChild(btn);
    });
    // Add new tab content panels as siblings immediately after the tab bar
    let nextElem = tabBar.nextSibling;
    newTabs.forEach((tab, idx) => {
        const tabPanel = document.createElement('div');
        tabPanel.className = 'tab-content';
        tabPanel.id = 'tab-' + tab.id;
        if (idx !== 0) tabPanel.style.display = 'none';
        // If this is the Movies tab, add popular movie buttons
        if (tab.id === 'movies') {
            const movies = [
                { title: 'Barbie', poster: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Barbie_2023_poster.jpg' },
                { title: 'Oppenheimer', poster: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Oppenheimer_%28film%29.jpg' },
                { title: 'Spider-Man: Across the Spider-Verse', poster: 'https://upload.wikimedia.org/wikipedia/en/f/f3/Spider-Man_Across_the_Spider-Verse_poster.jpg' },
                { title: 'The Super Mario Bros. Movie', poster: 'https://upload.wikimedia.org/wikipedia/en/4/44/The_Super_Mario_Bros._Movie_poster.jpg' },
                { title: 'Guardians of the Galaxy Vol. 3', poster: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Guardians_of_the_Galaxy_Vol_3_poster.jpg' },
                { title: 'Elemental', poster: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Elemental_%282023_film%29.png' },
                { title: 'Wonka', poster: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Wonka_film_poster.jpg' },
                { title: 'The Little Mermaid', poster: 'https://upload.wikimedia.org/wikipedia/en/6/6e/The_Little_Mermaid_2023_poster.jpg' },
                { title: 'Mission: Impossible – Dead Reckoning', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Mission_Impossible_Dead_Reckoning_Part_One_poster.jpg' },
                { title: 'John Wick: Chapter 4', poster: 'https://upload.wikimedia.org/wikipedia/en/6/60/John_Wick_Chap_4_poster.jpg' },
                { title: 'Indiana Jones and the Dial of Destiny', poster: 'https://upload.wikimedia.org/wikipedia/en/8/80/Indiana_Jones_and_the_Dial_of_Destiny_poster.jpg' },
                { title: 'The Marvels', poster: 'https://upload.wikimedia.org/wikipedia/en/6/60/The_Marvels_poster.jpg' },
                { title: 'The Hunger Games: The Ballad of Songbirds & Snakes', poster: 'https://upload.wikimedia.org/wikipedia/en/6/6b/The_Hunger_Games_The_Ballad_of_Songbirds_and_Snakes_poster.jpg' },
                { title: 'Fast X', poster: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Fast_X_poster.jpg' },
                { title: 'The Flash', poster: 'https://upload.wikimedia.org/wikipedia/en/e/e7/The_Flash_%282023_film%29_poster.jpg' },
                { title: 'Transformers: Rise of the Beasts', poster: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Transformers_Rise_of_the_Beasts_poster.jpg' },
                { title: 'Ant-Man and the Wasp: Quantumania', poster: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Ant-Man_and_the_Wasp_Quantumania_poster.jpg' },
                { title: 'Creed III', poster: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Creed_III_poster.jpg' },
                { title: 'Puss in Boots: The Last Wish', poster: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Puss_in_Boots_The_Last_Wish_poster.jpg' },
                // New movies to fill 8x3 grid
                { title: 'Elemental (2023)', poster: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Elemental_%282023_film%29.png' },
                { title: 'Napoleon', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Napoleon_2023_poster.jpg' },
                { title: 'Killers of the Flower Moon', poster: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Killers_of_the_Flower_Moon_poster.jpg' },
                { title: 'Migration', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Migration_2023_poster.jpg' }
            ];
            const moviesTable = document.createElement('table');
            moviesTable.className = 'word-table';
            // Arrange 24 movies into 3 rows: 8, 8, 8
            const rowSizes = [8, 8, 8];
            let movieIdx = 0;
            rowSizes.forEach(rowSize => {
                const row = moviesTable.insertRow();
                for (let j = 0; j < rowSize && movieIdx < movies.length; j++, movieIdx++) {
                    const movie = movies[movieIdx];
                    const cell = row.insertCell();
                    const btn = document.createElement('button');
                    btn.className = 'word-btn movie-btn';
                    btn.style.display = 'block';
                    btn.style.padding = '0';
                    btn.style.width = '110px';
                    btn.style.height = '150px';
                    btn.style.overflow = 'hidden';
                    btn.style.background = '#fff';
                    btn.style.border = '2px solid #2980b9';
                    btn.style.borderRadius = '10px';
                    btn.style.boxShadow = '0 2px 8px rgba(44,62,80,0.08)';
                    btn.style.margin = '8px 2px';
                    btn.style.position = 'relative';
                    // Poster image fills the button
                    const img = document.createElement('img');
                    img.src = movie.poster;
                    img.alt = movie.title + ' poster';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '10px';
                    img.style.display = 'block';
                    btn.appendChild(img);
                    // Movie title overlay
                    const titleSpan = document.createElement('span');
                    titleSpan.textContent = movie.title;
                    titleSpan.style.position = 'absolute';
                    titleSpan.style.left = '0';
                    titleSpan.style.right = '0';
                    titleSpan.style.bottom = '0';
                    titleSpan.style.background = 'rgba(0,0,0,0.55)';
                    titleSpan.style.color = '#fff';
                    titleSpan.style.fontSize = '0.95em';
                    titleSpan.style.textAlign = 'center';
                    titleSpan.style.padding = '4px 2px 2px 2px';
                    titleSpan.style.lineHeight = '1.1';
                    titleSpan.style.borderRadius = '0 0 10px 10px';
                    titleSpan.style.display = 'block';
                    btn.appendChild(titleSpan);
                    cell.appendChild(btn);
                    setButtonActivation(btn, movie.title);
                }
            });
            tabPanel.appendChild(moviesTable);
        }

        // If this is the TV Shows tab, add popular TV show buttons with posters
        if (tab.id === 'tvshows') {
            const shows = [
                { title: 'Stranger Things', poster: 'https://upload.wikimedia.org/wikipedia/en/f/f7/Stranger_Things_season_4.jpg' },
                { title: 'The Mandalorian', poster: 'https://upload.wikimedia.org/wikipedia/en/6/6c/The_Mandalorian_season_2_poster.jpg' },
                { title: 'Succession', poster: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Succession_Season_4.jpg' },
                { title: 'The Last of Us', poster: 'https://upload.wikimedia.org/wikipedia/en/7/7e/The_Last_of_Us_%28TV_series%29.jpg' },
                { title: 'Ted Lasso', poster: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Ted_Lasso_season_3.jpg' },
                { title: 'Wednesday', poster: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Wednesday_Netflix_poster.png' },
                { title: 'The Bear', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/The_Bear_TV_series_poster.jpg' },
                { title: 'Better Call Saul', poster: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Better_Call_Saul_Season_6.jpg' },
                { title: 'House of the Dragon', poster: 'https://upload.wikimedia.org/wikipedia/en/9/90/House_of_the_Dragon_season_1.jpg' },
                { title: 'The Boys', poster: 'https://upload.wikimedia.org/wikipedia/en/9/9a/The_Boys_season_3.jpg' },
                { title: 'The Crown', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/The_Crown_Season_5.jpg' },
                { title: 'Only Murders in the Building', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Only_Murders_in_the_Building_season_3.jpg' },
                { title: 'Loki', poster: 'https://upload.wikimedia.org/wikipedia/en/6/6a/Loki_season_2.jpg' },
                { title: 'The Witcher', poster: 'https://upload.wikimedia.org/wikipedia/en/9/9c/The_Witcher_season_3.jpg' },
                { title: 'Severance', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Severance_TV_series.jpg' },
                { title: 'The White Lotus', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/The_White_Lotus_season_2.jpg' },
                { title: 'Yellowjackets', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Yellowjackets_TV_series.jpg' },
                { title: 'Barry', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Barry_Season_4.jpg' },
                { title: 'Andor', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Andor_TV_series.jpg' },
                { title: 'The Morning Show', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/The_Morning_Show_Season_3.jpg' },
                // New TV shows to fill 8x3 grid
                { title: 'Silo', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Silo_TV_series_poster.jpg' },
                { title: 'Foundation', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Foundation_TV_series_poster.jpg' },
                { title: 'The Diplomat', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/The_Diplomat_TV_series_poster.jpg' },
                { title: 'Bluey', poster: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Bluey_TV_series_poster.jpg' }
            ];
            const showsTable = document.createElement('table');
            showsTable.className = 'word-table';
            // Arrange 24 shows into 3 rows: 8, 8, 8
            const rowSizes = [8, 8, 8];
            let showIdx = 0;
            rowSizes.forEach(rowSize => {
                const row = showsTable.insertRow();
                for (let j = 0; j < rowSize && showIdx < shows.length; j++, showIdx++) {
                    const show = shows[showIdx];
                    const cell = row.insertCell();
                    const btn = document.createElement('button');
                    btn.className = 'word-btn tvshow-btn';
                    btn.style.display = 'block';
                    btn.style.padding = '0';
                    btn.style.width = '110px';
                    btn.style.height = '150px';
                    btn.style.overflow = 'hidden';
                    btn.style.background = '#fff';
                    btn.style.border = '2px solid #2980b9';
                    btn.style.borderRadius = '10px';
                    btn.style.boxShadow = '0 2px 8px rgba(44,62,80,0.08)';
                    btn.style.margin = '8px 2px';
                    btn.style.position = 'relative';
                    // Poster image fills the button
                    const img = document.createElement('img');
                    img.src = show.poster;
                    img.alt = show.title + ' poster';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '10px';
                    img.style.display = 'block';
                    btn.appendChild(img);
                    // Show title overlay
                    const titleSpan = document.createElement('span');
                    titleSpan.textContent = show.title;
                    titleSpan.style.position = 'absolute';
                    titleSpan.style.left = '0';
                    titleSpan.style.right = '0';
                    titleSpan.style.bottom = '0';
                    titleSpan.style.background = 'rgba(0,0,0,0.55)';
                    titleSpan.style.color = '#fff';
                    titleSpan.style.fontSize = '0.95em';
                    titleSpan.style.textAlign = 'center';
                    titleSpan.style.padding = '4px 2px 2px 2px';
                    titleSpan.style.lineHeight = '1.1';
                    titleSpan.style.borderRadius = '0 0 10px 10px';
                    titleSpan.style.display = 'block';
                    btn.appendChild(titleSpan);
                    cell.appendChild(btn);
                    setButtonActivation(btn, show.title);
                }
            });
            tabPanel.appendChild(showsTable);
        }
        // If this is the Search tab, add a QWERTY keyboard styled like the word board buttons
        if (tab.id === 'search') {
            const keyboardRows = [
                ['Q','W','E','R','T','Y','U','I','O','P'],
                ['A','S','D','F','G','H','J','K','L'],
                ['Z','X','C','V','B','N','M'],
                ['Space','Backspace','SEARCH']
            ];
            const keyboard = document.createElement('div');
            keyboard.className = 'qwerty-keyboard';
            keyboard.style.display = 'flex';
            keyboard.style.flexDirection = 'column';
            keyboard.style.alignItems = 'center';
            keyboard.style.margin = '30px 0';
            // Input field for composing text
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'search-input';
            searchInput.style.fontSize = '2em';
            searchInput.style.marginBottom = '20px';
            searchInput.style.width = '80%';
            searchInput.style.maxWidth = '500px';
            searchInput.style.textAlign = 'center';
            keyboard.appendChild(searchInput);
            // Keyboard rows
            keyboardRows.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.style.display = 'flex';
                rowDiv.style.justifyContent = 'center';
                rowDiv.style.marginBottom = '10px';
                row.forEach(key => {
                    const keyBtn = document.createElement('button');
                    keyBtn.className = 'word-btn qwerty-key';
                    if (key === 'Space') {
                        keyBtn.textContent = '␣';
                        keyBtn.style.minWidth = '120px';
                    } else if (key === 'Backspace') {
                        keyBtn.textContent = '⌫';
                    } else if (key === 'SEARCH') {
                        keyBtn.textContent = 'SEARCH';
                        keyBtn.addEventListener('click', () => {
                            // Replace this with your search logic
                            if (searchInput.value.trim()) {
                                // For now, just log the value
                                console.log('Search:', searchInput.value.trim());
                            }
                            searchInput.focus();
                        });
                        keyBtn.style.margin = '0 4px';
                        rowDiv.appendChild(keyBtn);
                        return;
                    } else {
                        keyBtn.textContent = key;
                    }
                    keyBtn.style.margin = '0 4px';
                    // Activation for QWERTY keys: match activationMode (hover or click)
                    const activateKey = () => {
                        if (key === 'Space') {
                            searchInput.value += ' ';
                        } else if (key === 'Backspace') {
                            searchInput.value = searchInput.value.slice(0, -1);
                        } else {
                            searchInput.value += key;
                        }
                        searchInput.focus();
                    };
                    if (activationMode === 'hover') {
                        let hoverTimeout;
                        keyBtn.addEventListener('mouseenter', () => {
                            hoverTimeout = setTimeout(activateKey, hoverTime);
                        });
                        keyBtn.addEventListener('mouseleave', () => {
                            clearTimeout(hoverTimeout);
                        });
                    } else {
                        keyBtn.addEventListener('click', activateKey);
                    }
                    rowDiv.appendChild(keyBtn);
                });
                keyboard.appendChild(rowDiv);
            });
            // Optionally, add a Speak button below
            const speakBtn = document.createElement('button');
            speakBtn.textContent = 'Speak';
            speakBtn.className = 'word-btn';
            speakBtn.style.marginTop = '15px';
            speakBtn.style.fontSize = '1.2em';
            speakBtn.addEventListener('click', () => {
                if (searchInput.value.trim()) speakWord(searchInput.value.trim());
            });
            keyboard.appendChild(speakBtn);
            tabPanel.appendChild(keyboard);
        }
        // If this is the Genres tab, add genre buttons styled like word buttons
        if (tab.id === 'genres') {
            const genres = [
                'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
                'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
                'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
            ];
            const genresTable = document.createElement('table');
            genresTable.className = 'word-table';
            let row = null;
            genres.forEach((genre, i) => {
                if (i % 5 === 0) row = genresTable.insertRow();
                const cell = row.insertCell();
                const btn = document.createElement('button');
                btn.className = 'word-btn';
                btn.textContent = genre;
                cell.appendChild(btn);
                setButtonActivation(btn, genre);
            });
            tabPanel.appendChild(genresTable);
        }
        tabBar.parentNode.insertBefore(tabPanel, nextElem);
    });
    // Re-activate tab button logic
    const newTabButtons = tabBar.querySelectorAll('.tab-btn');
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
});

// --- Save and Edit Mode Functionality ---
let hasUnsavedChanges = false;

// Function to save tile positions to localStorage
function saveTilePositions() {
    const tileData = {};
    
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        const tabId = tabContent.id;
        const tiles = [];
        
        const table = tabContent.querySelector('.word-table');
        if (table) {
            table.querySelectorAll('tr').forEach((row, rowIndex) => {
                Array.from(row.cells).forEach((cell, cellIndex) => {
                    const btn = cell.querySelector('.word-btn');
                    if (btn) {
                        tiles.push({
                            text: btn.textContent,
                            row: rowIndex,
                            col: cellIndex,
                            speechLabel: btn.getAttribute('data-speech-label') || btn.textContent
                        });
                    }
                });
            });
        }
        
        if (tiles.length > 0) {
            tileData[tabId] = tiles;
        }
    });
    
    localStorage.setItem('speechBoardTiles', JSON.stringify(tileData));
    hasUnsavedChanges = false;
    updateSaveButtonState();
}

// Function to load tile positions from localStorage
function loadTilePositions() {
    const savedData = localStorage.getItem('speechBoardTiles');
    if (!savedData) return;
    
    try {
        const tileData = JSON.parse(savedData);
        
        Object.keys(tileData).forEach(tabId => {
            const tabContent = document.getElementById(tabId);
            if (!tabContent) return;
            
            const table = tabContent.querySelector('.word-table');
            if (!table) return;
            
            const tiles = tileData[tabId];
            
            // Create a map of current buttons by their text (store reference before removing from DOM)
            const buttonMap = new Map();
            const buttonsToMove = [];
            table.querySelectorAll('.word-btn').forEach(btn => {
                buttonMap.set(btn.textContent.trim(), btn);
                buttonsToMove.push(btn);
            });
            
            // Remove buttons from their current cells (but keep them in memory via buttonMap)
            buttonsToMove.forEach(btn => btn.remove());
            
            // Place buttons in their saved positions
            tiles.forEach(tileInfo => {
                const btn = buttonMap.get(tileInfo.text.trim());
                const row = table.rows[tileInfo.row];
                if (btn && row) {
                    const targetCell = row.cells[tileInfo.col];
                    if (targetCell) {
                        targetCell.appendChild(btn);
                        if (tileInfo.speechLabel) {
                            btn.setAttribute('data-speech-label', tileInfo.speechLabel);
                        }
                    }
                }
            });
        });
        
        // Re-activate buttons after loading
        updateAllButtonActivation();
    } catch (e) {
        console.error('Error loading tile positions:', e);
    }
}

// Function to update save button state
function updateSaveButtonState() {
    if (editMode) {
        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';
        saveBtn.style.cursor = 'pointer';
    } else {
        saveBtn.disabled = true;
        saveBtn.style.opacity = '0.5';
        saveBtn.style.cursor = 'not-allowed';
    }
}

// Save button with animation
saveBtn.addEventListener('click', () => {
    if (!editMode) return;
    
    // Save the positions
    saveTilePositions();
    
    // Animate the button
    saveBtn.style.transform = 'scale(0.95)';
    saveBtn.style.background = '#229954';
    
    // Show a checkmark briefly
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '✓ Saved';
    
    setTimeout(() => {
        saveBtn.style.transform = 'scale(1)';
        saveBtn.style.background = '#27ae60';
        setTimeout(() => {
            saveBtn.textContent = originalText;
        }, 500);
    }, 200);
});

editModeBtn.addEventListener('click', () => {
    editMode = !editMode;
    editModeBtn.textContent = editMode ? 'Disable Edit Mode' : 'Enable Edit Mode';
    document.body.classList.toggle('edit-mode', editMode);
    // Show or hide the Icons button based on edit mode
    iconsBtn.style.display = editMode ? 'block' : 'none';
    
    // Update save button state
    updateSaveButtonState();
    
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
            table.querySelectorAll('td').forEach(td => {
                td.classList.remove('empty-drop-spot');
            });
        }
    });
    // Now enable drag and drop (must be after cell creation for listeners to attach)
    enableDragAndDropOnAllTables();
    enableTouchDragAndDropOnAllTables();
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
let dragCounter = 0; // Track drag enter/leave properly
let dragPlaceholder = null; // Placeholder element to show during drag

function handleDragStart(e) {
    draggedBtn = this;
    setTimeout(() => this.classList.add('dragging'), 0);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd() {
    this.classList.remove('dragging');
    // Remove drag-over class from all cells
    document.querySelectorAll('td.drag-over').forEach(td => {
        td.classList.remove('drag-over');
    });
    // Remove any placeholder
    if (dragPlaceholder && dragPlaceholder.parentNode) {
        dragPlaceholder.parentNode.removeChild(dragPlaceholder);
    }
    dragPlaceholder = null;
    draggedBtn = null;
    dragCounter = 0;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.preventDefault();
    
    this.classList.remove('drag-over');
    
    // Remove placeholder before dropping
    if (dragPlaceholder && dragPlaceholder.parentNode) {
        dragPlaceholder.parentNode.removeChild(dragPlaceholder);
        dragPlaceholder = null;
    }
    
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
        if (targetBtn) {
            sourceCell.appendChild(targetBtn);
            targetCell.appendChild(draggedBtn);
        }
    }
    
    // Mark that we have unsaved changes
    hasUnsavedChanges = true;
    
    updateAllButtonActivation();
    enableDragAndDropOnAllTables();
    enableTouchDragAndDropOnAllTables();
    
    return false;
}

function handleDragEnter(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    dragCounter++;
    this.classList.add('drag-over');
    
    // Show placeholder for empty cells
    if (draggedBtn && this.children.length === 0 && this.classList.contains('empty-drop-spot')) {
        // Remove any existing placeholder
        if (dragPlaceholder && dragPlaceholder.parentNode) {
            dragPlaceholder.parentNode.removeChild(dragPlaceholder);
        }
        
        // Create a placeholder preview of the dragged button
        dragPlaceholder = draggedBtn.cloneNode(true);
        dragPlaceholder.classList.add('drag-placeholder');
        dragPlaceholder.style.opacity = '0.4';
        dragPlaceholder.style.pointerEvents = 'none';
        dragPlaceholder.style.border = '2px dashed #f39c12';
        this.appendChild(dragPlaceholder);
    }
}

function handleDragLeave(e) {
    dragCounter--;
    if (dragCounter === 0) {
        this.classList.remove('drag-over');
        
        // Remove placeholder when leaving the cell
        if (dragPlaceholder && this.contains(dragPlaceholder)) {
            this.removeChild(dragPlaceholder);
            dragPlaceholder = null;
        }
    }
}

function enableDragAndDropOnAllTables() {
    document.querySelectorAll('.word-table').forEach(enableDragAndDropOnTable);
}

// Touch event support for mobile drag-and-drop
let touchDraggedBtn = null;
let touchStartX = 0;
let touchStartY = 0;
let clonedElement = null;

function handleTouchStart(e) {
    if (!editMode) return;
    
    touchDraggedBtn = this;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    
    // Create a clone for visual feedback
    clonedElement = this.cloneNode(true);
    clonedElement.style.position = 'fixed';
    clonedElement.style.pointerEvents = 'none';
    clonedElement.style.opacity = '0.7';
    clonedElement.style.zIndex = '10000';
    clonedElement.style.transform = 'rotate(3deg) scale(1.05)';
    clonedElement.style.left = touch.clientX - (this.offsetWidth / 2) + 'px';
    clonedElement.style.top = touch.clientY - (this.offsetHeight / 2) + 'px';
    clonedElement.style.width = this.offsetWidth + 'px';
    document.body.appendChild(clonedElement);
    
    this.classList.add('dragging');
}

function handleTouchMove(e) {
    if (!touchDraggedBtn || !clonedElement) return;
    
    e.preventDefault(); // Prevent scrolling while dragging
    
    const touch = e.touches[0];
    clonedElement.style.left = touch.clientX - (clonedElement.offsetWidth / 2) + 'px';
    clonedElement.style.top = touch.clientY - (clonedElement.offsetHeight / 2) + 'px';
    
    // Find the element under the touch point
    clonedElement.style.display = 'none';
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    clonedElement.style.display = '';
    
    // Remove drag-over from all cells
    document.querySelectorAll('td.drag-over').forEach(td => {
        td.classList.remove('drag-over');
    });
    
    // Add drag-over to the cell under touch
    if (elementBelow) {
        const cell = elementBelow.closest('td');
        if (cell && cell.closest('.word-table')) {
            cell.classList.add('drag-over');
        }
    }
}

function handleTouchEnd(e) {
    if (!touchDraggedBtn) return;
    
    const touch = e.changedTouches[0];
    
    // Find the element under the touch point
    // Find element under touch and clean up clone
    let elementBelow;
    if (clonedElement) {
        clonedElement.style.display = 'none';
        elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        document.body.removeChild(clonedElement);
        clonedElement = null;
    } else {
        elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    }
    
    touchDraggedBtn.classList.remove('dragging');
    
    // Remove drag-over from all cells
    document.querySelectorAll('td.drag-over').forEach(td => {
        td.classList.remove('drag-over');
    });
    
    if (elementBelow) {
        const targetCell = elementBelow.closest('td');
        if (targetCell && targetCell.closest('.word-table')) {
            const sourceCell = touchDraggedBtn.parentNode;
            
            if (targetCell !== sourceCell) {
                // If dropping onto an empty cell, just move the button
                if (targetCell.children.length === 0) {
                    targetCell.appendChild(touchDraggedBtn);
                    targetCell.classList.remove('empty-drop-spot');
                    if (sourceCell.children.length === 0) {
                        sourceCell.classList.add('empty-drop-spot');
                    }
                } else {
                    // If dropping onto a cell with a button, swap them
                    const targetBtn = targetCell.querySelector('.word-btn');
                    if (targetBtn) {
                        sourceCell.appendChild(targetBtn);
                        targetCell.appendChild(touchDraggedBtn);
                    }
                }
                
                // Mark that we have unsaved changes
                hasUnsavedChanges = true;
                
                updateAllButtonActivation();
                
                // Only re-enable on the specific table for better performance
                const table = targetCell.closest('.word-table');
                if (table) {
                    enableDragAndDropOnTable(table);
                    enableTouchDragAndDropOnTable(table);
                }
            }
        }
    }
    
    touchDraggedBtn = null;
}

function enableTouchDragAndDropOnTable(table) {
    if (!table) return;
    
    table.querySelectorAll('.word-btn').forEach(btn => {
        // Only modify listeners if needed (avoid redundant operations)
        const hasListeners = btn.dataset.touchListenersAttached === 'true';
        
        if (editMode && !hasListeners) {
            btn.addEventListener('touchstart', handleTouchStart, { passive: false });
            btn.addEventListener('touchmove', handleTouchMove, { passive: false });
            btn.addEventListener('touchend', handleTouchEnd, { passive: false });
            btn.dataset.touchListenersAttached = 'true';
        } else if (!editMode && hasListeners) {
            btn.removeEventListener('touchstart', handleTouchStart, { passive: false });
            btn.removeEventListener('touchmove', handleTouchMove, { passive: false });
            btn.removeEventListener('touchend', handleTouchEnd, { passive: false });
            delete btn.dataset.touchListenersAttached;
        }
    });
}

function enableTouchDragAndDropOnAllTables() {
    document.querySelectorAll('.word-table').forEach(enableTouchDragAndDropOnTable);
}

document.addEventListener('DOMContentLoaded', () => {
    loadTilePositions(); // Load saved tile positions first
    enableDragAndDropOnAllTables();
    enableTouchDragAndDropOnAllTables();
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

// Update the tabs at the top for TV mode (disabled - tvSearchBtn not defined)
// This code would need the tvSearchBtn element to be created first
/*
tvSearchBtn.addEventListener('click', () => {
    const tabBar = document.querySelector('.tab-bar');
    if (tabBar) {
        // Remove ALL .tab-btn and .tab-content elements from the DOM
        document.querySelectorAll('.tab-btn').forEach(btn => btn.parentNode && btn.parentNode.removeChild(btn));
        document.querySelectorAll('.tab-content').forEach(tc => tc.parentNode && tc.parentNode.removeChild(tc));
        // Clear tabBar
        tabBar.innerHTML = '';
        // Add only Movies and TV Shows tabs
        const tabNames = [
            { label: 'Movies', id: 'movies' },
            { label: 'TV Shows', id: 'tvshows' }
        ];
        // Add new tab buttons
        tabNames.forEach((tab, idx) => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn';
            btn.setAttribute('data-tab', tab.id);
            btn.textContent = tab.label;
            if (idx === 0) btn.classList.add('active');
            tabBar.appendChild(btn);
        });
        // Add new tab content panels as siblings immediately after the tab bar
        let nextElem = tabBar.nextSibling;
        tabNames.forEach((tab, idx) => {
            const tabPanel = document.createElement('div');
            tabPanel.className = 'tab-content';
            tabPanel.id = 'tab-' + tab.id;
            if (idx !== 0) tabPanel.style.display = 'none';
            tabBar.parentNode.insertBefore(tabPanel, nextElem);
        });
        // Re-activate tab button logic
        const newTabButtons = tabBar.querySelectorAll('.tab-btn');
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
*/