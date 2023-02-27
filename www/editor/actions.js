/*
    This file holds the functions which write to the DOM
    Write to/ clear the console, etc
*/

function btn_showAnswer_glow() {
   document.getElementById("answer-show-button").classList.add("pressed");
   if (window.timerId) clearTimeout(window.timerId);
   window.timerId = setTimeout(() => document.getElementById("answer-show-button").classList.remove("pressed"), 200);
}

function isQueryAreaValid() {
   if (queryArea.value.trim() === "") {
      queryArea.classList.add("invalid");
      /*queryArea.addEventListener("animationend", () => {
         queryArea.classList.remove("invalid");
      });*/
      return false;
   }
   queryArea.classList.remove("invalid");
   return true;
}

// Builds an HTML table from the given data object
function buildAnswerTable(data) {
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
}

setInterval(updateGUI, 500);
function updateGUI() {
   if (canExecQuery()) {
      document.getElementById("answer-show-button").disabled = false;
   } else {
      document.getElementById("answer-show-button").disabled = true;
   }

   if (currentQuery.open) {
      document.getElementById("stop-query-button").disabled = false;
   } else {
      document.getElementById("stop-query-button").disabled = true;
   }
   document.getElementById("query-status-label").innerText = "Query status: " + currentQuery.state;
}

function clearTrace() {
   traceText.innerHTML = "";
}

function printToTrace(txt) {
   const div = document.createElement("div");
   const textNode = document.createTextNode(txt);
   div.appendChild(textNode);
   traceText.appendChild(div);
}

function displayTrace(trace) {
   clearTrace();
   trace.forEach((element, index) => {
      const div = document.createElement("div");
      const textNode = document.createTextNode(element);
      div.appendChild(textNode);
      div.style.display = "none"; // Set the div element to be hidden
      traceText.appendChild(div);
      //const delay = 50 * Math.min(10, index);
      const delay = 500 / (1 + 1 / (index * 0.5));
      setTimeout(() => {
         div.style.display = "block"; // Set the div element to be visible after 50ms
      }, delay); // Multiply the delay by the index to stagger the display of each element
   });
}

const programFiles = ["example1.xml", "example2.xml", "example3.xml"];
const storedPrograms = [];

function displayProgram(program) {
   console.log(program.title);
   codeArea.value = program.program;
   queryArea.value = program.query;
}

//populateExamples();
function populateExamples() {
   storedPrograms.sort((a, b) => a.title.localeCompare(b.title)); // sort storedPrograms alphabetically by title
   storedPrograms.forEach((program) => {
      const button = document.createElement("button");
      button.textContent = program.title;
      button.addEventListener("click", () => displayProgram(program));
      examplesMenu.appendElement(button);
   });
}

loadPrograms();
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
