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



// Prints the solutions, builds a table from the solution data, and displays it in the console area
function displayResponse(responseObj) {
   const solutions = responseObj.solutions;
   consoleArea.print("Query: ", responseObj.query, "Black");
   consoleArea.print("Debug: Solutions=", solutions, "LightSteelBlue");
   const table = buildAnswerTable(solutions);
   consoleArea.insert(table);
    displayTrace(responseObj.trace);
}

function displayTrace(trace) {
traceText.innerHTML="";
    trace.forEach((element, index) => {
        const div = document.createElement("div");
        const textNode = document.createTextNode(element);
        div.appendChild(textNode);
        div.style.display = "none"; // Set the div element to be hidden
        traceText.appendChild(div);
        //const delay = 50 * Math.min(10, index);
        const delay = 500 /(1+ (1/(index*0.5)));
        console.log(delay);
        setTimeout(() => {
            div.style.display = "block"; // Set the div element to be visible after 50ms
        }, delay); // Multiply the delay by the index to stagger the display of each element
    });
}