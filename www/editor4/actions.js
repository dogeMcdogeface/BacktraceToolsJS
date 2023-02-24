/*
    This file holds the functions which write to the DOM
    Write to/ clear the console, etc
*/


function btn_showAnswer_glow(){

   document.getElementById("answer-show-button").classList.add("pressed");
   if (window.timerId) clearTimeout(window.timerId);
   window.timerId = setTimeout(() => document.getElementById("answer-show-button").classList.remove("pressed"), 200);
}

function isQueryAreaValid() {
  if (queryArea.value.trim() === '') {
    queryArea.classList.add('invalid');
    queryArea.addEventListener('animationend', () => {
       queryArea.classList.remove('invalid');
    });
    return false;
  }
    queryArea.classList.remove('invalid');
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
row.insertCell().textContent = (typeof obj[property] === 'object') ? JSON.stringify(obj[property]) : obj[property];
    }
  });
  return table;
}