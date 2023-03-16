function parseTrace(trace) {
   console.log("parsing trace", trace, !trace,trace.length,!trace || trace.length < 1 );
   if (!trace || trace.length < 1) return;

   const [istruzione, scope, valore] = trace[0]
      .trim()
      .match(/^(.+):\s\(([^)]+)\)\s(.+)$/)
      .slice(1);

   let cntNodi = 1;

   root = { text: { name: valore, desc: cntNodi++, title: scope, class: istruzione }, children: [], HTMLid : "treeRoot" };

   let currNode = root;
   let currExit = root;

   for (let i = 1; i < trace.length; i++) {
      const [istruzione, scope, valore] = trace[i]
         .trim()
         .match(/^(.+):\s\(([^)]+)\)\s(.+)$/)
         .slice(1);

      switch (istruzione) {
         case "Call":
            currExit.call = valore;
            break;

         case "Redo":
            currNode = root;
            while (currNode.children.length && currNode.call !== valore) {
               currNode = currNode.children[currNode.children.length - 1];
            }
            break;
         case "Exit":
         case "Fail":
            const newNode = { text: { name: valore, desc: cntNodi++, title: scope, class: istruzione }, children: [] };
            currNode.children.push(newNode);
            currNode = newNode;
            if (istruzione === "Exit") {
               currExit = currNode;
            } else {
               currNode.HTMLclass = "fail";
            }
            break;
      }
   }

   console.log("root", root);

   return root;
}
