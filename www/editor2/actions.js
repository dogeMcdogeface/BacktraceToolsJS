/*
    This file holds the functions which write to the DOM
    Write to/ clear the console, etc
*/

function btn_showAnswer_glow() {
   document.getElementById("answer-show-button").classList.add("pressed");
   if (window.timerId) clearTimeout(window.timerId);
   window.timerId = setTimeout(() => document.getElementById("answer-show-button").classList.remove("pressed"), 200);
}


function clearTrace() {
   traceText.innerHTML = "";
}

function printToTrace(...txt) {
  for (let t of txt.flat()) {
    const div = document.createElement("div");
    const textNode = document.createTextNode(t);
    div.appendChild(textNode);
    traceText.appendChild(div);
}
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


