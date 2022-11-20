
const OutputText    = document.getElementById('OutputText');
const ProgramEditor = document.getElementById('ProgramEditor');
const QueryEditor   = document.getElementById('QueryEditor');
function SubmitRun() {
    PrintToConsole("Running Program");

    var query = {
    "program"   : ProgramEditor.value,
    "query"     : QueryEditor.value,
    };

    PostQuery(JSON.stringify(query));
}

function PrintToConsole(txt, color){
    OutputText.value += "\n" + txt;
    OutputText.scrollTop = OutputText.scrollHeight;
    //TODO: aggiungere colori alle linee stampate (vedi trace di swi prolog) (vedi /docs/todo5.png)
}



function PostQuery(query) {
  console.log(query);
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    PrintToConsole(this.responseText);
  }
  xhttp.open("POST", "/api/query");
  xhttp.send(query);
}