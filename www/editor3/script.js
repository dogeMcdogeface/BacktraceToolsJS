console.log("Starting Backtrace Tools");

// Get references to HTML elements with the specified IDs
const codeArea = document.getElementById("codeArea");
const queryArea = document.getElementById("queryArea");
const consoleArea = document.getElementById("consoleArea");
const traceText = document.getElementById("traceText");

// Assigns an onclick event handler to each button on the page, using the appropriate handler from buttonHandlers
for (const button of document.querySelectorAll("button")) {
   button.onclick = buttonHandlers[button.id] || unknownButton;
}

// Assign a custom action to the query area. Pressing enter executes the query
queryArea.customKeyBehaviour("Enter", kbd_showAnswer);
//queryArea.customKeyBehaviour('ctrl+Enter', () => queryArea.addNewLine())