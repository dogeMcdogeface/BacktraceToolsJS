/*
    This file holds the callbacks for actions initiated by the user
    eg pressing buttons, keyboard shortcuts...
*/

//-------------------------------------------- CONSTANTS AND ELEMENTS ------------------------------------------------//

const programFiles = ["example1.xml", "example2.xml", "example3.xml", "example4.xml", "example5.xml"];

const workerTimeout = 10000;
const treeMaxNodes  = 500;

const codeArea = document.getElementById("codeArea");
const queryArea = document.getElementById("queryArea");
const queryNumb = document.getElementById("answer-number-input");
const consoleArea = document.getElementById("consoleArea");
const traceArea = document.getElementById("traceArea");
const treeArea = document.getElementById("treeArea");
const examplesMenu = document.getElementById("examplesMenu");
const downloadButtons = document.querySelectorAll(".download-btn");


//-------------------------------------------- LISTENERS -------------------------------------------------------------//
document.addEventListener("input", validateInputs);

document.getElementById("answer-show-button").onclick = btn_showAnswer;
document.getElementById("clear-console-button").onclick = btn_clearConsole;
document.getElementById("save-tree-svg-button").onclick = () => btn_saveTree("svg");
document.getElementById("save-tree-png-button").onclick = () => btn_saveTree("png");
document.getElementById("zoom-in-btn").onclick = () => btn_zoomTree(1);
document.getElementById("zoom-out-btn").onclick = () => btn_zoomTree(-1);

queryArea.customKeyBehaviour("Enter", queryArea_enter); // Assign a custom action to the query area. Pressing enter executes the query

validateInputs();
loadPrograms();
clearTrace();

//-------------------------------------------- BUTTON FUNCTIONS ------------------------------------------------------//

function btn_saveTree(ext) {
   console.log("btn_downloadTree");
   saveTreeAs(treeArea.name, ext);
}

function btn_showAnswer() {
   console.log("btn_showAnswer");
   executeQuery();
}

function btn_zoomTree(val) {
   console.log("btn_zoomTree", val);
   if (val > 0) {
      panzoom.zoomIn();
   } else {
      panzoom.zoomOut();
   }
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

//-------------------------------------------- DATA UTILITY FUNCTIONS ------------------------------------------------//

function validateInputs() {
   const validQuery = queryArea.value.trim() !== "";
   queryArea.classList.toggle("invalid", !validQuery);
   const validNumber = queryNumb.checkValidity();
   const valid = validQuery && validNumber;
   document.getElementById("answer-show-button").disabled = !valid;
   return valid;
}

async function loadPrograms() {
   const storedPrograms = [];
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
   populateExamples(storedPrograms);
}

function saveTreeAs(filename, format) {
   if (treeArea.innerHTML === "") return;
   treeArea.classList.remove("pan");
   const options = { style: { transform: "none", cursor: "default", skipFonts: true } };
   const toImage = format === "svg" ? htmlToImage.toSvg : htmlToImage.toPng;
   toImage(treeArea, options).then((dataUrl) => {
      treeArea.classList.add("pan");
      const link = Object.assign(document.createElement("a"), { href: dataUrl, download: filename.replace(/\./g, "") });
      document.body.appendChild(link).click();
      link.remove();
   });
}
