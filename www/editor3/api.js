// Sends a query request to the API and displays the response in the console area
function requestAnswer() {
  // Gets the answer number input value from the DOM and converts it to an integer
  const count = parseInt(document.getElementById("answer-number-input").value, 10);
  // Constructs a query object using the program code, query string, count, and a unique ID
  const query = {
    program: codeArea.value,
    query: queryArea.value,
    count: count,
    id: uniqueID(),
  };
  // Sends the query to the server and specifies the function to call when the response is received
  postQuery(query, queryLoadedCallback);
}

// Sends a POST request to the server with the given query object and specifies the function to call when the response is received
function postQuery(query, loadedCallback) {
   consoleArea.print("Executing Query", "", "green");
   const xhttp = new XMLHttpRequest();
   xhttp.addEventListener("load", () => loadedCallback(xhttp));
   xhttp.open("POST", "/api/query");
   xhttp.send(JSON.stringify(query));
}

// Handles the response received from the server and displays the result in the console area
function queryLoadedCallback(xhttp) {
   console.log("Query loaded: ", xhttp.status, xhttp);
   if (xhttp.status == 200) {
      displayResponse(xhttp.responseText);
   } else {
      consoleArea.print("Query request failed: ", xhttp.statusText, "Orange");
   }
}

// Parses the response JSON, builds a table from the solution data, and displays it in the console area
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

// Builds an HTML table from the given data object
function buildAnswerTable(data) {
  const table = document.createElement("table");
  table.classList.add("solutionTable");

  const headerRow = table.createTHead().insertRow();
  headerRow.insertCell().textContent = "#";

  if (data.length === 0 || Object.keys(data[0]).length === 0) {
    headerRow.insertCell().textContent = "Has Solutions";
    data = data.length === 0 ? [{ _: false }] : data.map(obj => Object.keys(obj).length === 0 ? { _: true, ...obj } : obj);
  } else {
    for (const property in data[0]) {
      headerRow.insertCell().textContent = property;
    }
  }
  data.forEach((obj, index) => {
    const row = table.createTBody().insertRow();
    row.insertCell().textContent = index + 1;
    for (const property in obj) {
      row.insertCell().textContent = obj[property];
    }
  });
  return table;
}


// Returns a unique ID string using a random number and base 36 encoding
const uniqueID = () => Math.random().toString(36).substr(2, 12);