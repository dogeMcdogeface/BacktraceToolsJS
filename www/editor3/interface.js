const buttonHandlers = {
   "answer-show-button": btn_showAnswer,
   "clear-console-button": btn_clearConsole,
   "show-tree-button": btn_showTree,
   "header-New-button": btn_headerNew,
   "header-Open-button": btn_headerOpen,
   "header-Save-button": btn_headerSave,
};

function btn_showAnswer() {
   requestAnswer();
}

function btn_clearConsole() {
   console.log("btn_clearConsole");
   consoleArea.clear();
}

function btn_showTree() {
   console.log("btn_showTree");
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
