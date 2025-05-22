// Select elements
const wordInput = document.getElementById('word-input');
const addWordBtn = document.getElementById('add-word-btn');
const wordList = document.getElementById('word-list');

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

// Add click functionality to buttons
function addClickSpeech(button, word) {
    console.log(`Attaching click event to button: ${word}`); // Debugging log
    button.addEventListener('click', () => {
        console.log(`Button clicked: ${word}`); // Debugging log
        speakWord(word);
    });
}

// Initialize existing buttons
const buttons = document.querySelectorAll('.word-btn');
console.log('Buttons found:', buttons); // Debugging log
buttons.forEach(button => {
    addClickSpeech(button, button.textContent);
});

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

        // Add click functionality to the new button
        addClickSpeech(button, word);

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