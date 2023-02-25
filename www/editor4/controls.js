/*
    This file holds the callbacks for actions initiated by the user
    eg pressing buttons, keyboard shortcuts...
*/

const codeArea = document.getElementById("codeArea");
const queryArea = document.getElementById("queryArea");
const queryNumb = document.getElementById("answer-number-input")
const consoleArea = document.getElementById("consoleArea");
const traceText = document.getElementById("traceText");

const buttonHandlers = {
   "answer-show-button": btn_showAnswer,
   "clear-console-button": btn_clearConsole,
   "clear-trace-button": btn_clearTrace,
   "header-New-button": btn_headerNew,
   "header-Open-button": btn_headerOpen,
   "header-Save-button": btn_headerSave,
};

function btn_showAnswer() {
   console.log("btn_showAnswer");
   executeQuery();
}

function btn_clearConsole() {
   console.log("btn_clearConsole");
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

function queryArea_enter() {
    console.log("queryArea_Enter");
    btn_showAnswer_glow();
    btn_showAnswer();
}



document.addEventListener('DOMContentLoaded', function() {
// Assigns an onclick event handler to each button on the page, using the appropriate handler from buttonHandlers
for (const button of document.querySelectorAll("button")) {
   button.onclick = buttonHandlers[button.id] || unknownButton;
}

// Assign a custom action to the query area. Pressing enter executes the query
queryArea.customKeyBehaviour("Enter", queryArea_enter);
//queryArea.customKeyBehaviour('ctrl+Enter', () => queryArea.addNewLine())
queryArea.addEventListener('input', isQueryAreaValid);
}, false);

