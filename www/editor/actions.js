/*
    This file holds the functions which write to the DOM
    Write to/ clear the console, etc
*/

//-------------------------------------------- CONSOLE UTILITY FUNCTIONS ---------------------------------------------//

let currentTarget;
consoleArea.onSelected = (target) => {
  console.log('SELECTED', target);

  if (currentTarget) {
    currentTarget.removeEventListener('updatedTrace', updatedTrace);
    currentTarget.removeEventListener('finished', finishedTrace);
  }

  clearTrace();
  if(target === null) return;
  target.addEventListener('updatedTrace', updatedTrace);
  target.addEventListener('finished', finishedTrace);
  currentTarget = target;
  finishedTrace();
}

//-------------------------------------------- TRACE DISPLAY FUNCTIONS -----------------------------------------------//


function updatedTrace(e) {
  printToTrace(e.detail);
}

function finishedTrace() {
  clearTrace();
  printToTrace(currentTarget.trace);
  printToTree(currentTarget.trace);
}

function printToTrace(...txt) {
  txt.flat().forEach(t => traceArea.cont.appendChild(document.createElement("div")).appendChild(document.createTextNode(t)));
  traceArea.parentNode.scrollTop = traceArea.parentNode.scrollHeight;
}


function clearTrace() {
   treeChart = null;
   treeArea.name = "";
   treeArea.innerHTML = "";
   downloadButtons.forEach(button => button.disabled = true);

   traceArea.textContent = "";
   traceArea.cont = traceArea.appendChild(document.createElement("div"));
}

//-------------------------------------------- TREE DISPLAY FUNCTIONS ------------------------------------------------//
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
        onTreeLoaded();
      },
   },
};


function printToTree(trace) {
   const root = parseTrace(trace);
   if (!root) return;
   console.log(root);
   treeArea.name = root.name;
   treeArea.style.minHeight  = ``;
   treeArea.style.minWidth = ``;
   treeChart = new Treant({ chart: treeConfig, nodeStructure: root });
downloadButtons.forEach(button => button.disabled = false);
}


function onTreeLoaded() {
   const elem = document.getElementById("treeRoot");
   const pElem = treeArea.parentElement;

   let centerX = elem.offsetLeft + elem.offsetWidth / 2;
   let centerY = elem.offsetTop + elem.offsetHeight / 2;

   let pcenterX = pElem.offsetLeft + pElem.offsetWidth / 2;
   let pcenterY = pElem.offsetTop + pElem.offsetHeight / 2;

   //makeSquare(treeArea);

   panzoom.setOptions({ startX: -centerX + pcenterX });

   panzoom.zoom(1);
   // panzoom.reset();
   setTimeout(() => panzoom.reset({ animate: false }));
   //setTimeout(() => panzoom.pan(-centerX+pcenterX, -centerY+pcenterY/2, { animate: true }),600);
   if (!isVisible(treeArea)) treeArea.innerHTML = "";
}


const isVisible = (element) => !!element && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
const observer = new IntersectionObserver(([entry]) => {
   if (entry.target === treeArea && entry.isIntersecting && !!treeChart && treeArea.innerHTML === "") {
   treeChart.tree.reload();
   }
});
observer.observe(treeArea);


//-------------------------------------------- PAN AND ZOOM FUNCTIONS ------------------------------------------------//


const panzoom = Panzoom(treeArea, {
duration:200,
   contain:"outside",
   maxScale: 1.1,
   canvas:true,
   cursor:"auto"
});

treeArea.classList.add("pan");
treeArea.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);


/*function makeSquare(elem) {

  const parent = elem.parentElement;
  const parentWidth = parent.offsetWidth;
  const parentHeight = parent.offsetHeight;
  const parentRatio = parentWidth / parentHeight;

  const width = elem.offsetWidth;
  const height = elem.offsetHeight;
  const elemRatio = width / height;

  if (width > height) {
    elem.style.minWidth = `${width}px`;
    elem.style.minHeight  = `${width / parentRatio}px`;
  } else {
    elem.style.minHeight  = `${height}px`;
    elem.style.minWidth = `${height * parentRatio}px`;
  }
}*/


//-------------------------------------------- EXAMPLE PROGRAMS FUNCTIONS --------------------------------------------//

function displayProgram(program) {
   console.log(program.title);
   codeArea.value = program.program;
   queryArea.value = program.query;
   document.dispatchEvent(new Event("input"));
}

function populateExamples(programs) {
   programs.sort((a, b) => a.title.localeCompare(b.title)); // sort programs alphabetically by title
   programs.forEach((program) => {
      const button = document.createElement("button");
      button.textContent = program.title;
      button.addEventListener("click", () => displayProgram(program));
      examplesMenu.appendElement(button);
   });
}

//-------------------------------------------- DECORATION FUNCTIONS --------------------------------------------------//

function btn_showAnswer_glow() {
   document.getElementById("answer-show-button").classList.add("pressed");
   if (window.timerId) clearTimeout(window.timerId);
   window.timerId = setTimeout(() => document.getElementById("answer-show-button").classList.remove("pressed"), 200);
}
