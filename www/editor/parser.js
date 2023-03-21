function parseTrace(trace) {
   console.log("parsing trace", trace, !trace, trace.length, !trace || trace.length < 1);
   if (!trace || trace.length < 1) return;

   let cntNodi = 1;
   let root = null;

for (let i = 0; i < trace.length && i < treeMaxNodes; i++) {
      let cleaned = trace[i].replace(/^(\^ )?/, "").trim();
      let match = cleaned.match(/^(.*):\s*\((\d+)\)\s*(.*)$/);
      let istruzione = match[1];
      let scope = match[2];
      let valore = match[3];
      // console.log("-", istruzione, "-", scope, "-", valore, "-");
      const newNode = { text: { name: valore, desc: cntNodi++, title: scope, class: istruzione }, HTMLclass: istruzione, children: [] };

      if (i === 0) {
         root = { ...newNode, HTMLid: "treeRoot", HTMLclass: "Root" };
      } else {
         currNode.children.push(newNode);
      }
      switch (istruzione) {
         default:
         case "Call":
         case "Exit":
         case "Fail":
            currNode = newNode;
            break;
         case "Redo":
            currNode = root;
            while (currNode.children.length && currNode.text.name !== valore) {
               currNode = currNode.children[currNode.children.length - 1];
            }
            break;
      }
   }
   return root;
}