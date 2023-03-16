function parseTrace(trace) {
   console.log("parsing trace", trace, !trace, trace.length, !trace || trace.length < 1);
   if (!trace || trace.length < 1) return;

   const [istruzione, scope, valore] = trace[0]
      .trim()
      .match(/^(.+):\s\(([^)]+)\)\s(.+)$/)
      .slice(1);

   let cntNodi = 1;
   let root = null;

   for (let i = 0; i < trace.length; i++) {
      let [istruzione, scope, valore] = trace[i]
         .trim()
         .replace(/^\^?\s*|\s*:/g, "")
         .split(" ");

      //console.log("-", istruzione, "-", scope, "-", valore, "-");
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

   console.log("root", root);

   return root;
}
