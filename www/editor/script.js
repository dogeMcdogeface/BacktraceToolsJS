/*
    This file holds the callbacks for actions initiated by the user
    eg pressing buttons, keyboard shortcuts...
*/

//-------------------------------------------- CONSTANTS AND ELEMENTS ------------------------------------------------//
const url = window.location.href.split("?")[0];
const encodeParam = "?encoded=";

const programFiles = ["example1.xml", "example2.xml", "example3.xml", "example4.xml", "example5.xml", "example6.xml"];
const exampleEncoded = "https://domain/editor/index.html?encoded=PGV4YW1wbGU%2BCiAgICAgICAgICAgPHRpdGxlPjEtU2FuaXR5IENoZWNrPC90aXRsZT4KICAgICAgICAgICA8cHJvZ3JhbT48IVtDREFUQVtdXT48L3Byb2dyYW0%2BCiAgICAgICAgICAgPHF1ZXJ5PmN1cnJlbnRfbW9kdWxlKE0pPC9xdWVyeT4KICAgICAgIDwvZXhhbXBsZT4%3D";
let randomWords = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"];

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
const shareCodeModal = document.getElementById("shareCodeModal");
const shareCodeModalLink = document.getElementById("shareCodeModalLink");

//-------------------------------------------- LISTENERS -------------------------------------------------------------//
document.addEventListener("input", validateInputs);
scopeNum.addEventListener("input", inp_scopeNum);

document.getElementById("new-file-button").onclick = btn_headerNew;
document.getElementById("load-local-button").onclick = btn_loadLocal;
document.getElementById("load-file-button").onclick = btn_loadFile;
document.getElementById("load-string-button").onclick = btn_loadString;

document.getElementById("save-local-button").onclick = btn_saveLocal;
document.getElementById("save-file-button").onclick = btn_saveFile;
document.getElementById("share-code-button").onclick = btn_shareCode;
document.getElementById("hdr-share-code-button").onclick = btn_shareCode;

document.getElementById("answer-show-button").onclick = btn_showAnswer;
document.getElementById("clear-console-button").onclick = btn_clearConsole;
document.getElementById("save-tree-svg-button").onclick = () => btn_saveTree("svg");
document.getElementById("save-tree-png-button").onclick = () => btn_saveTree("png");
document.getElementById("zoom-in-btn").onclick = () => btn_zoomTree(1);
document.getElementById("zoom-out-btn").onclick = () => btn_zoomTree(-1);

queryArea.customKeyBehaviour("Enter", queryArea_enter); // Assign a custom action to the query area. Pressing enter executes the query

const urlParams = new URLSearchParams(window.location.search);
const encodedString = urlParams.get("encoded");
if (encodedString) {
    // do something with the encoded value, such as decoding it
    let XmlString = atob(decodeURIComponent(encodedString));
    console.log("Encoded value:", encodedString, XmlString);
    displayProgram(parseProgramXML(XmlString));

    console.log(url);
    history.replaceState({}, "", url);
}

loadCodeTitle();
validateInputs();
loadExamples();
clearTrace();
document.querySelector('body').style.display = 'initial';
//-------------------------------------------- BUTTON FUNCTIONS ------------------------------------------------------//

//---------------------------------- LOAD PROGRAM BTN --------------------------------------------//

function btn_loadLocal() {
    console.log("btn_loadLocal");
    //return localStorage.getItem("exampleXml");
}

function btn_loadString() {
    console.log("btn_loadString");
    let encodedString = prompt("Please enter the encoded string:", exampleEncoded);

    try {
        const urlParams = new URLSearchParams(new URL(encodedString).search);
        if (urlParams.get("encoded")) {
            encodedString = urlParams.get("encoded");
        }
    } catch (_) {}

    console.log(window.location.search, urlParams);
    let XmlString = atob(decodeURIComponent(encodedString));
    displayProgram(parseProgramXML(XmlString));
}

function btn_loadFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xml,.pl";
    input.addEventListener("change", () => {
        const reader = new FileReader();
        reader.onload = () => displayProgram(parseProgramXML(reader.result));
        reader.readAsText(input.files[0]);
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

function btn_shareCode() {
    console.log("btn_shareCode");
    const xmlString = getAsXML(titleArea.value, codeArea.value, queryArea.value);
    const encodedString = encodeURIComponent(btoa(xmlString));
    console.log(url + encodeParam + encodedString);
    try {
        navigator.clipboard.writeText(url + encodeParam + encodedString);
    } catch (_) {}
    //window.alert("A link to your code has been copied to your clipboard\nYou can share this link, or paste it into the Load String menu\n\n" + url + encodeParam + encodedString);
    shareCodeModalLink.href = (url + encodeParam + encodedString);
    shareCodeModal.show();

    let timeoutID = setTimeout(() => {shareCodeModal.hide();}, 1500);
    shareCodeModal.body.addEventListener("mouseenter", () => clearTimeout(timeoutID));
    shareCodeModal.body.addEventListener("mouseleave", () => timeoutID = setTimeout(() => shareCodeModal.hide(), 1000));
}

//---------------------------------- INTERFACE BUTTONS -------------------------------------------//

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

//----------------------------------------- PROGRAM UTILITY FUNCTIONS ------------------------------------------------//

function getAsXML(title, program, query) {
    return `<example>
           <title>${title}</title>
           <program><![CDATA[${program}]]></program>
           <query>${query}</query>
       </example>`;
}

function loadCodeTitle() {
    titleArea.value = localStorage.getItem("titleAreaContent" + titleArea.id) || "";
    window.addEventListener("beforeunload", () => localStorage.setItem("titleAreaContent" + titleArea.id, titleArea.value));
    fetch("../examples/words.txt")
        .then((response) => response.text())
        .then((wordsText) => {
            randomWords = wordsText
                .trim()
                .split("\n")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
            titleArea.value = titleArea.checkValidity() ? titleArea.value : generateTitle();
        });
}

function generateTitle() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const randomWord1 = randomWords[Math.floor(Math.random() * randomWords.length)];
    const randomWord2 = randomWords[Math.floor(Math.random() * randomWords.length)];
    return `untitled-${year}-${month}-${day}-${randomWord1}${randomWord2}`;
}

function parseProgramXML(xmlString) {
    const xml = new DOMParser().parseFromString(xmlString, "application/xml");
    const title = xml.querySelector("title").textContent;
    const programText = xml.querySelector("program").textContent;
    const query = xml.querySelector("query").textContent;
    return { title, program: programText, query };
}

async function loadExamples() {
    const storedPrograms = [];
    const folder = "../examples/";
    const programRequests = programFiles.map((file) =>
        fetch(folder + file)
            .then((response) => response.text())
            .then((program) => storedPrograms.push(parseProgramXML(program)))
            .catch((error) => console.warn(error))
    );
    await Promise.all(programRequests);
    console.log("Stored programs ", storedPrograms);
    populateExamples(storedPrograms);
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
