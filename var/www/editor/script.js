
const outputText = document.getElementById('outputText');

function SubmitRun() {
    PrintToConsole("Running Program");
    loadDoc();
}

function PrintToConsole(txt, color){
    outputText.innerHTML += "\n" + txt;
    outputText.scrollTop = outputText.scrollHeight;
    //TODO: aggiungere colori alle linee stampate (vedi trace di swi prolog) (vedi /docs/todo5.png)
}


function loadDoc() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    PrintToConsole(this.responseText);
  }
  xhttp.open("POST", "/api/test");
  xhttp.send();
}