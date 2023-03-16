/*
    This file holds the functions which write to the DOM
    Write to/ clear the console, etc
*/

var treeChart;
const treeConfig = {
   container: "#treeArea",
   rootOrientation: "NORTH",
   siblingSeparation: 300,
   connectors: {
      type: "step",
      style: {
         "stroke-width": 5,
         stroke: "#606060", // Set the stroke color to red
      },
   },
   callback: {
      onTreeLoaded: function () {
         if (!isVisible(treeArea)) treeArea.innerHTML = "";
      },
   },
};

function btn_showAnswer_glow() {
   document.getElementById("answer-show-button").classList.add("pressed");
   if (window.timerId) clearTimeout(window.timerId);
   window.timerId = setTimeout(() => document.getElementById("answer-show-button").classList.remove("pressed"), 200);
}

clearTrace();
function clearTrace() {
   traceText.textContent = "";
   traceText.cont = document.createElement("div");
   traceText.appendChild(traceText.cont);
}

function printToTrace(...txt) {
   for (let t of txt.flat()) {
      const div = document.createElement("div");
      const textNode = document.createTextNode(t);
      div.appendChild(textNode);
      traceText.cont.appendChild(div);
   }
}

function printToTree(trace) {
   const root = parseTrace(trace);
   if (!root) return;
   console.log("root", root);
   treeChart = new Treant({ chart: treeConfig, nodeStructure: root });
}

const isVisible = (element) => !!element && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
const observer = new IntersectionObserver(([entry]) => {
   if (entry.target === treeArea && entry.isIntersecting && !!treeChart && treeArea.innerHTML === "") treeChart.tree.reload();
});
observer.observe(treeArea);


function displayProgram(program) {
   console.log(program.title);
   codeArea.value = program.program;
   queryArea.value = program.query;
   document.dispatchEvent(new Event("input"));
}

const storedPrograms = [];
function populateExamples() {
   storedPrograms.sort((a, b) => a.title.localeCompare(b.title)); // sort storedPrograms alphabetically by title
   storedPrograms.forEach((program) => {
      const button = document.createElement("button");
      button.textContent = program.title;
      button.addEventListener("click", () => displayProgram(program));
      examplesMenu.appendElement(button);
   });
}
