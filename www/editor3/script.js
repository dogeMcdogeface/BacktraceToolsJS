// Get references to HTML elements with the specified IDs
const codeArea = document.getElementById("codeArea");
const queryArea = document.getElementById("queryArea");
const consoleArea = document.querySelector("console-area");
const traceArea = document.getElementById("traceArea");

// Main function that initializes the tool and calls testConsole()
function main() {
   console.log("Starting Backtrace Tools");
   //testConsole();
}

// Sends a query request to the API and displays the response in the console area
function answerRequest() {
   consoleArea.print("Executing Query ", "", "green");
   const count = parseInt(document.getElementById("answer-number-input").value, 10);
   const query = {
      program: codeArea.value,
      query: queryArea.value,
      count: count,
      id: uniqueID(),
   };
   console.log("Requesting", query);
   //consoleArea.print('Requesting', query);
   const xhttp = new XMLHttpRequest();
   xhttp.onload = () => displayResponse(xhttp.responseText);
   xhttp.open("POST", "/api/query");
   xhttp.send(JSON.stringify(query));
}

// Displays the given response text in the console area
function displayResponse(responseText) {
   const responseObj = JSON.parse(responseText);
   const solutions = responseObj.solutions;
   //console.log("Receiving", responseText);
   console.log("Receiving", responseObj);
   consoleArea.print("Query: ", responseObj.query, "Black");
   if (solutions.length === 0) {
      consoleArea.print("FALSE", "Red");
   } else if (solutions.length === 1 && Object.keys(solutions[0]).length === 0) {
      consoleArea.print("TRUE", "DarkGreen ");
   } else {
      consoleArea.print(solutions, "blue");
   }
   //   consoleArea.insert(t);
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
const buttonHandlers = {
   "answer-request-button": answerRequest,
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

// Returns a unique ID string using a random number and base 36 encoding
const uniqueID = () => Math.random().toString(36).substr(2, 12);

main();

// Function that generates and displays random error messages in the console, as an example
function testConsole() {
   const htmlColors = ["red", "blue", "green", "orange", "purple", "pink", "brown", "gray", "black"];
   const errorMessages = ["Fatal Exception", "Undefined Variable", "Syntax Error", "Index Out of Bounds", "Memory Overflow"];
   for (let i = 0; i < 15; i++) {
      const color = htmlColors[Math.floor(Math.random() * htmlColors.length)];
      const message = `${errorMessages[Math.floor(Math.random() * errorMessages.length)]}: ${Math.random().toString(36).substring(2, 15)}`;
      consoleArea.write(message, color);
   }
   const t = document.createElement`table`,
      s = t.style;
   s.border = "1px solid black";
   for (let i = 2; i--; ) for (let r = t.insertRow(), j = 3; j--; ) (r.insertCell().style.cssText = "border:1px solid black;padding:10px"), (r.cells[2 - j].textContent = `Row ${i + 1}, Column ${j + 1}`);
   consoleArea.insert(t);
}
