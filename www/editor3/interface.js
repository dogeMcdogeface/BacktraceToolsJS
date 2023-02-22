const buttonHandlers = {
   "answer-show-button": btn_showAnswer,
   "clear-console-button": btn_clearConsole,
   "clear-trace-button": btn_clearTrace,
   "header-New-button": btn_headerNew,
   "header-Open-button": btn_headerOpen,
   "header-Save-button": btn_headerSave,
};

function btn_showAnswer() {
   requestAnswer();
}

function btn_clearConsole() {
   consoleArea.clear();
}

function btn_clearTrace() {
   console.log("btn_clearTrace");
   traceText.innerHTML="";
}

function btn_headerNew() {
   console.log("btn_headerNew");
}

function btn_headerOpen() {
   console.log("btn_headerOpen");
}

function btn_headerSave() {
   console.log("btn_headerSave");
}

function unknownButton() {
   console.log("Button with undefined behaviour");
}

function kbd_showAnswer() {
   document.getElementById("answer-show-button").classList.add("pressed");
   if (window.timerId) clearTimeout(window.timerId);
   window.timerId = setTimeout(() => document.getElementById("answer-show-button").classList.remove("pressed"), 200);
   requestAnswer();
}


// Assigns an onclick event handler to each button on the page, using the appropriate handler from buttonHandlers
for (const button of document.querySelectorAll("button")) {
   button.onclick = buttonHandlers[button.id] || unknownButton;
}

// Assign a custom action to the query area. Pressing enter executes the query
queryArea.customKeyBehaviour("Enter", kbd_showAnswer);
//queryArea.customKeyBehaviour('ctrl+Enter', () => queryArea.addNewLine())
queryArea.addEventListener('input', getQueryAreaValid);