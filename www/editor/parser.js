function parseTrace(trace) {
   console.log("parsing trace", trace, !trace, trace.length, !trace || trace.length < 1);
   if (!trace || trace.length < 1) return;

   const [istruzione, scope, valore] = trace[0]
      .trim()
      .match(/^(.+):\s\(([^)]+)\)\s(.+)$/)
      .slice(1);

   let cntNodi = 1;

   root = { text: { name: valore, desc: cntNodi++, title: scope, class: istruzione }, children: [], HTMLid: "treeRoot" };

   let currNode = root;
   let currExit = root;

   for (let i = 1; i < trace.length; i++) {
      let [istruzione, scope, valore] = trace[i]
         .trim()
         .replace(/^\^?\s*|\s*:/g, "")
         .split(" ");

      /*const [istruzione, scope, valore] = trace[i]
         .trim()
         .match(/^(.+):\s\(([^)]+)\)\s(.+)$/)
         .slice(1);*/

      const newNode = { text: { name: valore, desc: cntNodi++, title: scope, class: istruzione }, children: [] };
      newNode.HTMLclass = istruzione;
      currNode.children.push(newNode);

      console.log("-", istruzione, "-", scope, "-", valore, "-");

      switch (istruzione) {
         case "Call":
         case "Exit":
         case "Fail":
            currNode = newNode;
            break;
         case "Redo":
            currNode = root;
            while (currNode.children.length && currNode.text.name !== valore) {
            console.log(currNode.call, valore);
               currNode = currNode.children[currNode.children.length - 1];
            }
            break;
      }

      /*switch (istruzione) {
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

            currNode = newNode;
            if (istruzione === "Exit") {
               currExit = currNode;
            } else {
               currNode.HTMLclass = "fail";
            }
            break;
      }*/
   }

   console.log("root", root);

   return root;
}
