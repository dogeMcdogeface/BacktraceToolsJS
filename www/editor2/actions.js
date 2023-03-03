/*
    This file holds the functions which write to the DOM
    Write to/ clear the console, etc
*/

function btn_showAnswer_glow() {
   document.getElementById("answer-show-button").classList.add("pressed");
   if (window.timerId) clearTimeout(window.timerId);
   window.timerId = setTimeout(() => document.getElementById("answer-show-button").classList.remove("pressed"), 200);
}

function createAnswerBlock(){
   const block = document.createElement("answer-block");
   consoleArea.insert(block);
    return block;
}

// Builds an HTML table from the given data object
/* function buildAnswerTable(data) {
   const table = document.createElement("table");
   table.classList.add("solutionTable");

   const headerRow = table.createTHead().insertRow();
   headerRow.insertCell().textContent = "#";

   for (const property in data[0]) {
      headerRow.insertCell().textContent = property;
   }

   data.forEach((obj, index) => {
      const row = table.createTBody().insertRow();
      row.insertCell().textContent = index + 1;
      for (const property in obj) {
         row.insertCell().textContent = typeof obj[property] === "object" ? JSON.stringify(obj[property]) : obj[property];
      }
   });
   return table;
}*/


function clearTrace() {
   traceText.innerHTML = "";
}

function printToTrace(txt) {
   const div = document.createElement("div");
   const textNode = document.createTextNode(txt);
   div.appendChild(textNode);
   traceText.appendChild(div);
}

function displayProgram(program) {
   console.log(program.title);
   codeArea.value = program.program;
   queryArea.value = program.query;
   document.dispatchEvent(new Event("input"));
}

const storedPrograms = [];
function populateExamples() {
   storedPrograms.sort((a, b) => a.title.localeCompare(b.title)); // sort storedPrograms alphabetically by title
   storedPrograms.forEach((program) => {
      const button = document.createElement("button");
      button.textContent = program.title;
      button.addEventListener("click", () => displayProgram(program));
      examplesMenu.appendElement(button);
   });
}


