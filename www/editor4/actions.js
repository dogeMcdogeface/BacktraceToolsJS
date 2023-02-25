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
      queryArea.addEventListener("animationend", () => {
         queryArea.classList.remove("invalid");
      });
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
        setTimeout(() => {
            div.style.display = "block"; // Set the div element to be visible after 50ms
        }, delay); // Multiply the delay by the index to stagger the display of each element
    });
}