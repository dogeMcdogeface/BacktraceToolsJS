/*
    This file holds the callbacks for actions initiated by the user
    eg pressing buttons, keyboard shortcuts...
*/

const programFiles = ["example1.xml", "example2.xml", "example3.xml", "example4.xml"];


const codeArea = document.getElementById("codeArea");
const queryArea = document.getElementById("queryArea");
const queryNumb = document.getElementById("answer-number-input")
const consoleArea = document.getElementById("consoleArea");
const traceText = document.getElementById("traceText");
const examplesMenu = document.getElementById("examplesMenu");

const buttonHandlers = {
   "answer-show-button": btn_showAnswer,
   "clear-console-button": btn_clearConsole,
   "clear-trace-button": btn_clearTrace,
   "stop-query-button": btn_stopQuery,
   "header-New-button": btn_headerNew,
   "header-Open-button": btn_headerOpen,
   "header-Save-button": btn_headerSave,
};


document.addEventListener('input', validateInputs);
queryArea.customKeyBehaviour("Enter", queryArea_enter); // Assign a custom action to the query area. Pressing enter executes the query

for (const button of document.querySelectorAll("button")) { // Assigns an onclick event handler to each button on the page, using the appropriate handler from buttonHandlers
   button.onclick = buttonHandlers[button.id] || unknownButton;
}

validateInputs();
loadPrograms();





//-------------------------------------------- BUTTON FUNCTIONS ------------------------------------------------------//
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
    clearTrace();
}

function btn_stopQuery() {
   console.log("btn_stopQuery");
    currentQuery.stop = true;
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

function validateInputs() {
  const validQuery = queryArea.value.trim() !== "";
  queryArea.classList.toggle("invalid", !validQuery);
  const validNumber = queryNumb.checkValidity();
  const valid =  validQuery && validNumber;
  document.getElementById("answer-show-button").disabled = !valid;
  return valid;
}


async function loadPrograms() {
   const folder = "../examples/";
   const xmlParser = new DOMParser();
   const programRequests = programFiles.map((file) =>
      fetch(folder + file)
         .then((response) => response.text())
         .then((program) => xmlParser.parseFromString(program, "application/xml"))
         .then((xml) => {
            const title = xml.querySelector("title").textContent;
            const programText = xml.querySelector("program").textContent;
            const query = xml.querySelector("query").textContent;
            storedPrograms.push({ title, program: programText, query });
         })
         .catch((error) => console.warn(error))
   );
   await Promise.all(programRequests);
   console.log("Stored programs ", storedPrograms);
   populateExamples();
}