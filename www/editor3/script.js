// Get references to HTML elements with the specified IDs
const codeArea = document.getElementById("codeArea");
const queryArea = document.getElementById("queryArea");
const consoleArea = document.querySelector("console-area");
const traceArea = document.getElementById("traceArea");

console.log("Starting Backtrace Tools");

const buttonHandlers = {
   "answer-show-button": showAnswer,
   "clear-console-button": clearConsole,
   "show-tree-button": showTree,
   "header-New-button": headerNew,
   "header-Open-button": headerOpen,
   "header-Save-button": headerSave,
};

// Assigns an onclick event handler to each button on the page, using the appropriate handler from buttonHandlers
for (const button of document.querySelectorAll("button")) {
   button.onclick = buttonHandlers[button.id] || unknownButton;
}

queryArea.customKeyBehaviour("Enter", kbd_showAnswer); // single key example
//queryArea.customKeyBehaviour('ctrl+Enter', () => queryArea.addNewLine()); // combined key example

let timerId;
function kbd_showAnswer() {
   document.getElementById("answer-show-button").classList.add("pressed");
     clearTimeout(timerId);
   timerId = setTimeout(() => document.getElementById("answer-show-button").classList.remove("pressed"), 200);
   requestAnswer();
}

function showAnswer() {
   requestAnswer();
}

// Sends a query request to the API and displays the response in the console area
function requestAnswer() {
   const count = parseInt(document.getElementById("answer-number-input").value, 10);
   const query = {
      program: codeArea.value,
      query: queryArea.value,
      count: count,
      id: uniqueID(),
   };
   postQuery(query, queryLoadedCallback);
}

function postQuery(query, loadedCallback) {
   consoleArea.print("Executing Query", "", "green");
   const xhttp = new XMLHttpRequest();
   xhttp.addEventListener("load", () => loadedCallback(xhttp));
   xhttp.open("POST", "/api/query");
   xhttp.send(JSON.stringify(query));
}

function queryLoadedCallback(xhttp) {
   console.log("Query loaded: ", xhttp.status, xhttp);
   if (xhttp.status == 200) {
      displayResponse(xhttp.responseText);
   } else {
      consoleArea.print("Query request failed: ", xhttp.statusText, "Orange");
   }
}

// Displays the given response text in the console area
function displayResponse(responseText) {
   console.log(
      "Receiving",
      ((r) => {
         try {
            return JSON.parse(r);
         } catch {
            return r;
         }
      })(responseText)
   );
   const responseObj = JSON.parse(responseText);
   const solutions = responseObj.solutions;
   consoleArea.print("Query: ", responseObj.query, "Black");

   consoleArea.print("Debug: Solutions=", solutions, "LightSteelBlue");
   const table = buildAnswerTable(solutions);
   consoleArea.insert(table);
}

function buildAnswerTable(data) {
   const table = document.createElement("table");
   const thead = document.createElement("thead");
   const tbody = document.createElement("tbody");
   table.classList.add("solutionTable");
   const headerRow = document.createElement("tr");
   const numberHeader = document.createElement("th");
   numberHeader.textContent = "#";
   headerRow.appendChild(numberHeader);

   if (data.length === 0 || Object.keys(data[0]).length === 0) {
      const th = document.createElement("th");
      th.textContent = "Has Solutions";
      headerRow.appendChild(th);
      data = data.length === 0 ? [{ _: false }] : data.map((obj) => (Object.keys(obj).length === 0 ? { _: true, ...obj } : obj));
   } else {
      for (const property in data[0]) {
         const th = document.createElement("th");
         th.textContent = property;
         headerRow.appendChild(th);
      }
   }
   thead.appendChild(headerRow);
   table.appendChild(thead);

   data.forEach((obj, index) => {
      const row = document.createElement("tr");
      const numberCell = document.createElement("td");
      numberCell.textContent = index + 1;
      row.appendChild(numberCell);
      for (const property in obj) {
         const td = document.createElement("td");
         td.textContent = obj[property];
         row.appendChild(td);
      }
      tbody.appendChild(row);
   });

   table.appendChild(tbody);
   return table;
}

// Clears the console area
function clearConsole() {
   console.log("clearConsole");
   consoleArea.clear();
}

// Displays a tree view of the current state
function showTree() {
   console.log("showTree");
}

// Handles the "New" button in the header
function headerNew() {
   console.log("headerNew");
}

// Handles the "Open" button in the header
function headerOpen() {
   console.log("headerOpen");
}

// Handles the "Save" button in the header
function headerSave() {
   console.log("headerSave");
}

// Logs a message to the console indicating that the clicked button has undefined behavior
function unknownButton() {
   console.log("Button with undefined behaviour");
}

// Object containing button handlers for each button on the page

// Returns a unique ID string using a random number and base 36 encoding
const uniqueID = () => Math.random().toString(36).substr(2, 12);
