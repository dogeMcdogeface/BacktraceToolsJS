
var trace = [
   "   Call: (3) jealous(_17586, _17588)\n",
   "   Call: (4) loves(_17586, _18826)\n",
   "   Exit: (4) loves(vincent, mia)\n",
   "   Call: (4) loves(_17588, mia)\n",
   "   Exit: (4) loves(vincent, mia)\n",
   "   Call: (4) vincent\\==vincent\n",
   "   Fail: (4) vincent\\==vincent\n",
   "   Redo: (4) loves(_17588, mia)\n",
   "   Exit: (4) loves(marcellus, mia)\n",
   "   Call: (4) vincent\\==marcellus\n",
   "   Exit: (4) vincent\\==marcellus\n",
   "   Exit: (3) jealous(vincent, marcellus)\n",
   "   Redo: (4) loves(_17586, _18826)\n",
   "   Exit: (4) loves(marcellus, mia)\n",
   "   Call: (4) loves(_17588, mia)\n",
   "   Exit: (4) loves(vincent, mia)\n",
   "   Call: (4) marcellus\\==vincent\n",
   "   Exit: (4) marcellus\\==vincent\n",
   "   Exit: (3) jealous(marcellus, vincent)\n",
   "   Redo: (4) loves(_17588, mia)\n",
   "   Exit: (4) loves(marcellus, mia)\n",
   "   Call: (4) marcellus\\==marcellus\n",
   "   Fail: (4) marcellus\\==marcellus\n",
   "   Redo: (4) loves(_17586, _18826)\n",
   "   Exit: (4) loves(pumpkin, honey_bunny)\n",
   "   Call: (4) loves(_17588, honey_bunny)\n",
   "   Exit: (4) loves(pumpkin, honey_bunny)\n",
   "   Call: (4) pumpkin\\==pumpkin\n",
   "   Fail: (4) pumpkin\\==pumpkin\n",
   "   Redo: (4) loves(_17586, _18826)\n",
   "   Exit: (4) loves(honey_bunny, pumpkin)\n",
   "   Call: (4) loves(_17588, pumpkin)\n",
   "   Exit: (4) loves(honey_bunny, pumpkin)\n",
   "   Call: (4) honey_bunny\\==honey_bunny\n",
   "   Fail: (4) honey_bunny\\==honey_bunny\n",
   "   Fail: (3) jealous(_17586, _17588)\n",
];

function parseTrace(trace) {
   console.log("parsing trace", trace);
   if (trace.length < 1) return;

   const [istruzione, scope, valore] = trace[0]
      .trim()
      .match(/^(.+):\s\(([^)]+)\)\s(.+)$/)
      .slice(1);

   let cntNodi = 1;

   root = { text: { name: valore, desc: cntNodi++, title: scope, class: istruzione }, children: [] };

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
            const newNode = {text: { name: valore, desc: cntNodi++, title: scope, class: istruzione }, children: [] };
            currNode.children.push(newNode);
            currNode = newNode;
            if(istruzione === "Exit"){
             currExit = currNode;
            }else{
            currNode.HTMLclass =  'fail';
            }
            break;
      }
   }

   chart = {
      container: "#tree-simple",
      rootOrientation: "NORTH",
      connectors: {
                  type: 'step',
                   style: {
                              "stroke-width": 5,
                              "stroke": "#606060" // Set the stroke color to red
                          }
              },
   };

   console.log("root", root);
   var my_chart = new Treant({ chart: chart, nodeStructure: root });
   return root;
}

parseTrace(trace);
