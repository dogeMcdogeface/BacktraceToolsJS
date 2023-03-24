/*
    This file holds the functions which write to the DOM
    Write to/ clear the console, etc
*/

//-------------------------------------------- CONSOLE UTILITY FUNCTIONS ---------------------------------------------//

let currentTarget;
consoleArea.onSelected = (target) => {
    console.log("SELECTED", target);

    if (currentTarget) {
        currentTarget.removeEventListener("updatedTrace", updatedTrace);
        currentTarget.removeEventListener("finished", finishedTrace);
    }

    clearTrace();
    if (target === null) return;
    target.addEventListener("updatedTrace", updatedTrace);
    target.addEventListener("finished", finishedTrace);
    currentTarget = target;
    finishedTrace();
};

//-------------------------------------------- TRACE DISPLAY FUNCTIONS -----------------------------------------------//

function updatedTrace(e) {
    printToTrace(e.detail);
}

function finishedTrace() {
    if (!currentTarget) return;
    clearTrace();
    printToTrace(currentTarget.trace);
    printToTree(currentTarget.trace);
}

function printToTrace(...txt) {
    txt.flat().forEach((t) => traceArea.cont.appendChild(document.createElement("div")).appendChild(document.createTextNode(t)));
    traceArea.parentNode.scrollTop = traceArea.parentNode.scrollHeight;
}

function clearTrace() {
    treeArea.name = "";
    treeArea.innerHTML = "";
    downloadButtons.forEach((button) => (button.disabled = true));

    traceArea.textContent = "";
    traceArea.cont = traceArea.appendChild(document.createElement("div"));
}

//-------------------------------------------- TREE DISPLAY FUNCTIONS ------------------------------------------------//
const treeConfig = {
    container: "#treeHolder",
    rootOrientation: "NORTH",
    siblingSeparation: 300,
    subTeeSeparation: 30,
    connectors: {
        type: "step",
        style: {
            "stroke-width": 5,
            stroke: "#606060", // Set the stroke color to red
        },
    },
};

function printToTree(trace) {
    const scope = parseInt(scopeNum.value.trim());
    const root = parseTrace(trace, scope);
    console.log("Requested Scope", parseInt(scopeNum.value.trim()));
    if (!root) return;
    treeArea.name = root.name;
    treeArea.scope = root.maxScope;
    new Treant({ chart: treeConfig, nodeStructure: root });
    const cloneHolder = treeHolder.cloneNode(true);
    treeArea.appendChild(cloneHolder);

    cloneHolder.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            cloneHolder.observer.disconnect();
            const { offsetLeft: eX, offsetWidth: eW, offsetTop: eY, offsetHeight: eH } = document.getElementById("treeRoot");
            const { offsetLeft: pX, offsetWidth: pW, offsetTop: pY, offsetHeight: pH } = treeArea.parentElement;
            panzoom.setOptions({ startX: pX - eX + (pW - eW) / 2, startY: pY - eY + (pH - eH) / 2 });
            //panzoom.zoom(0.1, { animate: false });
            console.log("zoomin1", panzoom.getScale(), panzoom.getPan());
            panzoom.zoom(1, { animate: false });
            console.log("zoomin2", panzoom.getScale(), panzoom.getPan());
                panzoom.pan(pX - eX + (pW - eW) / 2, pY - eY + (pH - eH) / 2, { animate: true });

            /*setTimeout(() => panzoom.reset({ animate: true },00));
            setTimeout(() => panzoom.reset({ animate: true },100));*/
            let count = 5;
            const func = () => {
              if (count > 0) {
                panzoom.pan(pX - eX + (pW - eW) / 2, pY - eY + (pH - eH) / 2);
                console.log("zoomin3", panzoom.getScale(), panzoom.getPan(), pX - eX + (pW - eW) / 2, pY - eY + (pH - eH) / 2);
                count--;
                setTimeout(func, 100);
              }
            }
            setTimeout(func, 100);
        }
    });
    cloneHolder.observer.observe(cloneHolder);
    downloadButtons.forEach((button) => (button.disabled = false));
}

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

//-------------------------------------------- PAN AND ZOOM FUNCTIONS ------------------------------------------------//

const panzoom = Panzoom(treeArea, {
    duration: 200,
    contain: "outside",
    maxScale: 1.1,
    //canvas: true,
    //cursor: "auto",
});

treeArea.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

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
