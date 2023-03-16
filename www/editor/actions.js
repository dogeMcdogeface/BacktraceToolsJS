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
        onTreeLoaded();
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
   treeArea.innerHTML = "";
   treeChart = null;
   traceArea.textContent = "";
   traceArea.cont = document.createElement("div");
   traceArea.appendChild(traceArea.cont);
}

function printToTrace(...txt) {
   for (let t of txt.flat()) {
      const div = document.createElement("div");
      const textNode = document.createTextNode(t);
      div.appendChild(textNode);
      traceArea.cont.appendChild(div);
   }
}

function printToTree(trace) {
   const root = parseTrace(trace);
   if (!root) return;
   console.log("root", root);
       treeArea.style.minHeight  = ``;
       treeArea.style.minWidth = ``;
   treeChart = new Treant({ chart: treeConfig, nodeStructure: root });
}

function onTreeLoaded(){



       const elem = document.getElementById("treeRoot");
       const pElem = treeArea.parentElement;

        let centerX = elem.offsetLeft + elem.offsetWidth / 2;
        let centerY = elem.offsetTop + elem.offsetHeight / 2;

        let pcenterX = pElem.offsetLeft + pElem.offsetWidth / 2;
        let pcenterY = pElem.offsetTop + pElem.offsetHeight / 2;


        makeSquare(treeArea);

       console.log(centerX, centerY,pcenterX,pcenterY);
        panzoom.setOptions({ startX:(-centerX+pcenterX) })



    panzoom.zoom(1);
      // panzoom.reset();
       setTimeout(() => panzoom.reset({ animate: false }));
        //panzoom.setOptions({ focal: {x:-centerX,y:-centerY} })
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


const elem = document.getElementById("treeArea");
const panzoom = Panzoom(treeArea, {
duration:500,
   contain:"outside",
   maxScale: 1.1,
   minScale: 0.01,
   canvas:true
});
/*panzoom.pan(10, 10);
panzoom.zoom(1, { animate: true });*/

elem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

elem.addEventListener('panzoomchange', (event) => {
  console.log(event.detail) // => { x: 0, y: 0, scale: 1 }
})

function makeSquare(elem) {

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
}



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
