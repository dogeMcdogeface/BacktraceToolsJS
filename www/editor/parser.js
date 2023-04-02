/*
    This file contains the prolog output parser to create the tree nodes
*/

//-------------------------------------------- CONSTANTS AND ELEMENTS ------------------------------------------------//
const nodeHTML = (istruzione, valore, scope, cntNodi) => `
<div class="instruction">
    <p>${istruzione}</p>
</div>
<div class="text">
    <p>${valore}</p>
    <p>Scope: ${scope}</p>
    <p>Step:${cntNodi++}</p>
</div>`;
const dashConnectors = { style: { stroke: "#bbb", "stroke-dasharray": "-" } };


//-------------------------------------------- PARSER FUNCTION -----------------------------------------------//
function parseTrace(trace, maxScope) {
    //console.log("parsing trace", trace, maxScope, !trace, trace.length, !trace || trace.length < 1);

    //------    Initial trace check     ------
    if (!trace || trace.length < 1) return;

    if(isNaN(maxScope)) maxScope = 0;
    let cntNodi = 1;
    let initialScope = -1;
    let root = null;

    //------     Parse the output and assign node values     ------
    for (let i = 0; i < trace.length && i < treeMaxNodes; i++) {
        let cleaned = trace[i].replace(/^(\^ )?/, "").trim();
        let match = cleaned.match(/^(.*):\s*\((\d+)\)\s*(.*)$/);
        if (!match) continue;   //in case the match does not exist it passes to the next iteration, eg: warning in the trace
        let istruzione = match[1];
        initialScope < 0 && (initialScope = match[2]);
        let scope = match[2] - initialScope + 1;    //reset the scope to start from 0
        let valore = match[3];

        let newNode = {
            innerHTML: nodeHTML(istruzione, valore, scope, cntNodi++),  //create the node using the tree-library properties by html
            name: valore,
            HTMLclass: istruzione,
            children: [],
        };

        if (!root) {
            root = { ...newNode, maxScope:0,  HTMLid: "treeRoot", HTMLclass: "Root" };
        } else if (maxScope !== 0 && scope > maxScope) {
            currNode.children.push({ ...newNode, connectors: dashConnectors, pseudo: true });
        } else {
            currNode.children.push(newNode);
        }

        if(scope > root.maxScope)   root.maxScope = scope;

        switch (istruzione) {
            default:
            case "Call":
            case "Exit":
            case "Fail":
                currNode = newNode;
                break;
            case "Redo":
                currNode = root;
                while (currNode.children.length && currNode.name !== valore) {
                    currNode = currNode.children[currNode.children.length - 1];
                }
                break;
        }
    }
    return root;
}
