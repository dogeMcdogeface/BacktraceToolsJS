/*
    This file holds the callbacks for actions initiated by the user
    eg pressing buttons, keyboard shortcuts...
*/

const programFiles = ["example1.xml", "example2.xml", "example3.xml", "example4.xml", "example5.xml"];

const codeArea = document.getElementById("codeArea");
const queryArea = document.getElementById("queryArea");
const queryNumb = document.getElementById("answer-number-input");
const consoleArea = document.getElementById("consoleArea");
const traceArea = document.getElementById("traceArea");
const treeArea = document.getElementById("treeArea");
const examplesMenu = document.getElementById("examplesMenu");
const downloadButtons = document.querySelectorAll('.download-btn');

clearTrace();

const buttonHandlers = {
   "answer-show-button": btn_showAnswer,
   "clear-console-button": btn_clearConsole,
   "save-tree-svg-button": () => btn_saveTree("svg"),
   "save-tree-png-button": () => btn_saveTree("png"),
   "zoom-in-btn": () => zoom_tree(1),
      "zoom-out-btn": () =>  zoom_tree(-1),
   //"header-New-button": btn_headerNew,
   //"header-Open-button": btn_headerOpen,
   //"header-Save-button": btn_headerSave,
};

document.addEventListener("input", validateInputs);
queryArea.customKeyBehaviour("Enter", queryArea_enter); // Assign a custom action to the query area. Pressing enter executes the query

for (const elementId in buttonHandlers) {
   const element = document.getElementById(elementId);
   //console.log(element, elementId);
   const handler = buttonHandlers[elementId];
   element.onclick = handler;
}

validateInputs();
loadPrograms();

//-------------------------------------------- BUTTON FUNCTIONS ------------------------------------------------------//

function btn_saveTree(ext) {
   console.log("btn_downloadTree");
   saveAsImg("treeArea", treeArea.title, ext);
}

function saveAsImg(id, title, format) {
  treeArea.classList.remove("pan");
  var options = {
    style: {
      transform: "none",
      cursor: "default",
      skipFonts :true,
    },
  };
  var toImage = format === "svg" ? htmlToImage.toSvg : htmlToImage.toPng;
  toImage(document.getElementById(id), options)
    .then(function (dataUrl) {
      treeArea.classList.add("pan");
      saveAs(dataUrl, title.replace(/\./g, "") );
    });
}

function saveAs(uri, filename) {
   var link = document.createElement("a");

   if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);
   } else {
      window.open(uri);
   }
}

function btn_showAnswer() {
   console.log("btn_showAnswer");
   executeQuery();
}

function btn_clearConsole() {
   console.log("btn_clearConsole");
   consoleArea.clear();
   clearTrace();
}

function btn_clearTrace() {
   console.log("btn_clearTrace");
   clearTrace();
}

function btn_stopQuery() {
   console.log("btn_stopQuery");
   currentQuery.stop = true;
}

function btn_headerNew() {
   console.log("btn_headerNew");
}

function btn_headerOpen() {
   console.log("btn_headerOpen");
}

function btn_headerSave() {
   console.log("btn_headerSave");
}

function unknownButton() {
   console.log("Button with undefined behaviour");
}

function queryArea_enter() {
   console.log("queryArea_Enter");
   btn_showAnswer_glow();
   btn_showAnswer();
}

function validateInputs() {
   const validQuery = queryArea.value.trim() !== "";
   queryArea.classList.toggle("invalid", !validQuery);
   const validNumber = queryNumb.checkValidity();
   const valid = validQuery && validNumber;
   document.getElementById("answer-show-button").disabled = !valid;
   return valid;
}

async function loadPrograms() {
   const folder = "../examples/";
   const xmlParser = new DOMParser();
   const programRequests = programFiles.map((file) =>
      fetch(folder + file)
         .then((response) => response.text())
         .then((program) => xmlParser.parseFromString(program, "application/xml"))
         .then((xml) => {
            const title = xml.querySelector("title").textContent;
            const programText = xml.querySelector("program").textContent;
            const query = xml.querySelector("query").textContent;
            storedPrograms.push({ title, program: programText, query });
         })
         .catch((error) => console.warn(error))
   );
   await Promise.all(programRequests);
   console.log("Stored programs ", storedPrograms);
   populateExamples();
}

function  zoom_tree(val) {
    console.log("zoom_tree",val);
    if(val>0){
        panzoom.zoomIn();
       }else{
        panzoom.zoomOut();
        }

}