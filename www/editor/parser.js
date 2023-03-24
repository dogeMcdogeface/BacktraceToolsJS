const nodeHTML = (istruzione, valore, scope, cntNodi) => `<div class="instruction"><p>${istruzione}</p></div><div class="text"><p>${valore}</p><p>Scope: ${scope}</p><p>Step:${cntNodi++}</p></div>`;
const dashConnectors = { style: { stroke: "#bbb", "stroke-dasharray": "-" } };

function parseTrace(trace, maxScope) {
    //console.log("parsing trace", trace, maxScope, !trace, trace.length, !trace || trace.length < 1);
    if (!trace || trace.length < 1) return;

    if(isNaN(maxScope)) maxScope = 0;
    let cntNodi = 1;
    let initialScope = -1;
    let root = null;

    for (let i = 0; i < trace.length && i < treeMaxNodes; i++) {
        let cleaned = trace[i].replace(/^(\^ )?/, "").trim();
        let match = cleaned.match(/^(.*):\s*\((\d+)\)\s*(.*)$/);
        if (!match) continue;
        let istruzione = match[1];
        initialScope < 0 && (initialScope = match[2]);
        let scope = match[2] - initialScope + 1;
        let valore = match[3];

        let newNode = {
            innerHTML: nodeHTML(istruzione, valore, scope, cntNodi++),
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
