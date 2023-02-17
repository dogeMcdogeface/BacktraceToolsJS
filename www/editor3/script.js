const consoleArea = document.querySelector('console-area');
document.querySelectorAll('button').forEach(button => button.addEventListener('click', event => {
//console.log(event.target.id);
switch (event.target.id) {
  case 'answer-request-button':
    answerRequest();
    break;
  case 'clear-console-button':
    clearConsole();
    break;
  case 'show-tree-button':
    showTree();
    break;
  case 'header-New-button':
    headerNew();
    break;
  case 'header-Open-button':
    headerOpen();
    break;
  case 'header-Save-button':
    headerSave();
    break;
  default:
  console.log("Button with undefined behaviour, id="+event.target.id);
}
}));

function answerRequest() {
  console.log("answerRequest");
  consoleArea.write('green', 'Success: Operation completed');
}

function clearConsole() {
  console.log("clearConsole");
  consoleArea.clear();
}

function showTree() {
  console.log("showTree");
}

function headerNew() {
  console.log("headerNew");
}

function headerOpen() {
  console.log("headerOpen");
}

function headerSave() {
  console.log("headerSave");
}



//Print random error messages to the console, as an example
const htmlColors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'brown', 'gray', 'black'];
const errorMessages = ['Fatal Exception', 'Undefined Variable', 'Syntax Error', 'Index Out of Bounds', 'Memory Overflow'];
for (let i = 0; i < 15; i++) {
  const color = htmlColors[Math.floor(Math.random() * htmlColors.length)];
  const message = `${errorMessages[Math.floor(Math.random() * errorMessages.length)]}: ${Math.random().toString(36).substring(2, 15)}`;
  consoleArea.write(color, message);
}
const t=document.createElement`table`,s=t.style;s.border='1px solid black';for(let i=2;i--;)for(let r=t.insertRow(),j=3;j--;)r.insertCell().style.cssText='border:1px solid black;padding:10px',r.cells[2-j].textContent=`Row ${i+1}, Column ${j+1}`;
consoleArea.insert(t);