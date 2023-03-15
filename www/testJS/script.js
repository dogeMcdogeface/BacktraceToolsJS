setTimeout(function () {
   location.reload();
}, 3000);

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

/******     Classe Nodo     ******/

class Nodo {
   constructor(riga) {
      this.istruzione = "";
      this.scope = "";
      this.valore = "";
      this.genitore = null; //TODO: possibile non serva
      this.nd_str = [];
      // TODO: nel caso istruzione sia Fail, mettere un boolean true per poi usarlo per cambiare font al nodo albero ********************

      // prende riga input e la divide assegnandola ai campi del nodo
      this.nd_str = riga.trim().split(": (");
      this.istruzione = this.nd_str[0];
      console.debug(`NODO - assegno istruzione: ${this.istruzione}`);

      this.nd_str = this.nd_str[1].split(") ");
      this.scope = this.nd_str[0];
      console.debug(`NODO - assegno scope: ${this.scope}`);
      this.valore = this.nd_str[1];
      console.debug(`NODO - assegno valore: ${this.valore}`);
   }
}

function parseTrace(trace) {
   console.log("parsing trace", trace);


   //***   estraggo stringhe per prima coppia hashmap callPadre  ***/

   let tmpNodo = new Nodo(trace[0]); // TODO:attenzione a possibili spazi prima della prima Call se fanno danni
   console.log(tmpNodo);

   let cntNodi = 1;

   //*salvo padre per campo primo elemento hashmap callPadre

   root = {
      text: { name: tmpNodo.valore, desc: cntNodi },
      cnt: cntNodi,
      children: [],
   };

   for (let i = 1; i < trace.length; i++) {
      tmpNodo = new Nodo(trace[i]);
      if (tmpNodo.istruzione === "Call") {
         //*salvo call(key) per campo primo elemento hashmap callPadre
         root.call = tmpNodo.valore;
         break;
      }
   }

   //*creo ed inserisco prima coppia hashmap

   let currNode = root;

   /*** estrae stringhe successive alla prima per riempire tutta hashmap ***/
   let i;
   for (i = 1; i < trace.length; i++) {
      tmpNodo = new Nodo(trace[i]);
      if (tmpNodo.istruzione == "Exit") {
         const newNode = { text: { name: tmpNodo.valore }, children: [] };
         currNode.children.push(newNode);
         currNode = newNode;

         //debug console.log('HM_PADRI - '); console.log(hm_padri);

         for (let j = i + 1; j < trace.length; j++) {
            tmpNodo = new Nodo(trace[j]);
            if (tmpNodo.istruzione == "Exit") {
               console.log("BREAK - secondo Exit di fila");
               break;
            }
            if (tmpNodo.istruzione == "Call") {
               currNode.call = tmpNodo.valore;
               console.log("CALL - trovata");
               break;
            }
         }
      }
      if (tmpNodo.istruzione == "Fail") {
         const newNode = { text: { name: tmpNodo.valore }, children: [] };
         currNode.children.push(newNode);
         currNode = newNode;

         console.log("FAIL - trovata");
      }

      if (tmpNodo.istruzione == "Redo") {
         currNode = root;

         while (currNode.children.length > 0) {
            if (currNode.call === tmpNodo.valore) {
               break;
            }

            currNode = currNode.children[currNode.children.length - 1];
         }
      }
   }

   chart = {
      container: "#tree-simple",
      rootOrientation: "NORTH",
   };

   console.log("root", root);
   var my_chart = new Treant({ chart: chart, nodeStructure: root });
}

parseTrace(trace);
