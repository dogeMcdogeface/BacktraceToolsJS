/*
    This file holds the callbacks for actions initiated by the user
    eg pressing buttons, keyboard shortcuts...
*/

//-------------------------------------------- CONSTANTS AND ELEMENTS ------------------------------------------------//

const programFiles = ["example1.xml", "example2.xml", "example3.xml", "example4.xml", "example5.xml", "example6.xml"];

const workerTimeout = 10000;
const treeMaxNodes = 500;

const titleArea = document.getElementById("titleInput");
const codeArea = document.getElementById("codeArea");
const queryArea = document.getElementById("queryArea");
const queryNum = document.getElementById("answer-number-input");
const scopeNum = document.getElementById("tree-scope-input");
const consoleArea = document.getElementById("consoleArea");
const traceArea = document.getElementById("traceArea");
const treeArea = document.getElementById("treeArea");
const treeHolder = document.getElementById("treeHolder");
const examplesMenu = document.getElementById("examplesMenu");
const downloadButtons = document.querySelectorAll(".download-btn");

//-------------------------------------------- LISTENERS -------------------------------------------------------------//
document.addEventListener("input", validateInputs);
scopeNum.addEventListener("input", inp_scopeNum);

document.getElementById("new-file-button").onclick      = btn_headerNew;
document.getElementById("load-local-button").onclick    = btn_loadLocal;
document.getElementById("load-file-button").onclick     = btn_loadFile;
document.getElementById("load-string-button").onclick   = btn_loadString;

document.getElementById("save-local-button").onclick    = btn_saveLocal;
document.getElementById("save-file-button").onclick     = btn_saveFile;
document.getElementById("share-string-button").onclick   = btn_shareString;

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

//---------------------------------- LOAD PROGRAM BTN --------------------------------------------//

function btn_loadLocal() {
    console.log("btn_loadLocal");
    //return localStorage.getItem("exampleXml");
}

function btn_loadString() {
    console.log("btn_loadString");
    let encodedString = prompt("Please enter the encoded string:", "");
    let XmlString = atob(encodedString);
    console.log(XmlString);
}

function btn_loadFile() {
    console.log("btn_loadFile");
    readFile((contents) => {
        console.log(contents);
    });
}

function readFile(callback) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xml, .pl";
    input.addEventListener("change", () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => callback(reader.result);
        reader.readAsText(file);
    });
    input.click();
}



//---------------------------------- SAVE PROGRAM BTN --------------------------------------------//

function btn_saveFile() {
    console.log("btn_saveFile");
    const xmlString = getAsXML(titleArea.value, codeArea.value, queryArea.value);
    const blob = new Blob([xmlString], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    saveToFile(titleArea.value + ".xml", url);
}

function btn_saveLocal() {
    console.log("btn_saveLocal");
       const xmlString = getAsXML(titleArea.value, codeArea.value, queryArea.value);
   localStorage.setItem("exampleXml", xmlString);
}

function btn_shareString() {
    console.log("btn_shareString");
        const xmlString = getAsXML(titleArea.value, codeArea.value, queryArea.value);
      const encodedString = btoa(xmlString);
      console.log(encodedString);
}


//----------------------------------                  --------------------------------------------//

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
    displayProgram({ program: "", query: "" });
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

let inpScopeTimer;
function inp_scopeNum() {
    if (scopeNum.value === "0") scopeNum.value = "";
    if (inpScopeTimer) clearTimeout(inpScopeTimer);
    if (!scopeNum.checkValidity()) return;
    inpScopeTimer = setTimeout(finishedTrace, 400);
}

//-------------------------------------------- DATA UTILITY FUNCTIONS ------------------------------------------------//


function getAsXML(title, program, query) {
    return `<example>
           <title>${title}</title>
           <program><![CDATA[${program}]]></program>
           <query>${query}</query>
       </example>`;
}
function generateTitle() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `untitled-${year}-${month}-${day}-${hours}${minutes}${seconds}-${randomSuffix}`;
}


//-------------------------------------------- DATA UTILITY FUNCTIONS ------------------------------------------------//


function validateInputs() {
    const validQuery = queryArea.value.trim() !== "";
    queryArea.classList.toggle("invalid", !validQuery);
    const validNumber = queryNum.checkValidity();
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
  const treeElement = treeHolder;
  if (treeElement.innerHTML === "") return;
  const options = { style: { transform: "none", cursor: "default", skipFonts: true } };
  const toImage = format === "svg" ? htmlToImage.toSvg : htmlToImage.toPng;
  toImage(treeElement, options)
    .then((dataUrl) => {
      saveToFile(filename.replace(/\./g, ""), dataUrl);
    })
    .catch((error) => {
      console.error("Error saving tree image:", error);
    });
}



function saveToFile(filename, data) {
  const link = Object.assign(document.createElement("a"), { href: data, download: filename, style: "display: none" });
  document.body.appendChild(link).click();
  link.remove();
}