
const outputText = document.getElementById('outputText');

function SubmitRun() {
  PrintToConsole("Running Program");
}

function PrintToConsole(txt, color){
outputText.innerHTML += "\n" + txt;
outputText.scrollTop = outputText.scrollHeight;
//TODO: aggiungere colori alle linee stampate (vedi trace di swi prolog)
}