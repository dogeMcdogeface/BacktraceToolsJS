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

/******      Classe Padre  ******/

class Padre {
   constructor(nome) {
      this.nome = nome;
      this.figli = [];
   }
}

function parseTrace(trace) {
   console.log("parsing trace", trace);

   const hm_callPadre = new Map();
   const hm_padri = new Map();
   let val_call = null;
   let padre_ass = null;

   let padre_att = "";

   const vetPadri = []; //vettore per tenere traccia dei padri nell'hashmap padri

   //***   estraggo stringhe per prima coppia hashmap callPadre  ***/

   let tmpNodo = new Nodo(trace[0]); // TODO:attenzione a possibili spazi prima della prima Call se fanno danni
   console.log(tmpNodo);

   let cntNodi = 0;

   //*salvo padre per campo primo elemento hashmap callPadre
   padre_ass = tmpNodo.valore + "#" + cntNodi++;
   console.log("PRIMO - salvo padre per campo primo elemento hashmap callPadre: " + padre_ass);
   padre_att = padre_ass; //imposto padre attuale per dopo il primo nodo
   hm_padri.set(padre_ass, new Padre(padre_ass)); //salvo in hm_padri il nome padre e un oggetto padre a cui assegnerò i figli (altri nodi)
   console.log(hm_padri);

   vetPadri.push(padre_att);
   console.log(vetPadri);

   for (let i = 1; i < trace.length; i++) {
      tmpNodo = new Nodo(trace[i]);
      if (tmpNodo.istruzione === "Call") {
         //*salvo call(key) per campo primo elemento hashmap callPadre
         val_call = tmpNodo.valore;
         console.log("PRIMO - salvo call per campo primo elemento hashmap callPadre: " + val_call);
         break;
      }
   }

   //*creo ed inserisco prima coppia hashmap
   hm_callPadre.set(val_call, padre_ass);
   root = {
         text: { name: padre_ass },
         call: val_call,
         children: []
    };
    let currNode = root;

   console.log(hm_callPadre);

   /*** estrae stringhe successive alla prima per riempire tutta hashmap ***/
   let i;
   for (i = 1; i < trace.length; i++) {
      tmpNodo = new Nodo(trace[i]);
      if (tmpNodo.istruzione == "Exit") {
         padre_ass = tmpNodo.valore + "#" + cntNodi++;
         //debug console.log("EXIT - "+padre_ass);
         hm_padri.get(padre_att).figli.push(padre_ass);
         //debug console.log(hm_padri.get(padre_att).figli);
         padre_att = padre_ass;

         const newNode = {text: { name: padre_ass }, children: []};
         currNode.children.push(newNode);
         currNode = newNode;


         vetPadri.push(padre_att);


         hm_padri.set(padre_ass, new Padre(padre_ass));
         //debug console.log('HM_PADRI - '); console.log(hm_padri);

         for (let j = i + 1; j < trace.length; j++) {
            tmpNodo = new Nodo(trace[j]);
            if (tmpNodo.istruzione == "Exit") {
               console.log("BREAK - secondo Exit di fila");
               break;
            }
            if (tmpNodo.istruzione == "Call") {
               val_call = tmpNodo.valore;
               hm_callPadre.set(val_call, padre_ass);
               currNode.call = val_call;
               console.log("CALL - trovata");
               console.log(hm_callPadre);
               break;
            }
         }
      }
      if (tmpNodo.istruzione == "Fail") {
         padre_ass = tmpNodo.valore + "#" + cntNodi++;
         hm_padri.get(padre_att).figli.push(padre_ass);

          const newNode = {text: { name: padre_ass }, children: []};
          currNode.children.push(newNode);
          currNode = newNode;


         padre_att = padre_ass;

         vetPadri.push(padre_att);

         hm_padri.set(padre_ass, new Padre(padre_ass));
         console.log("FAIL - trovata");
         console.log(hm_padri);
      }

      if (tmpNodo.istruzione == "Redo") {


         currNode = root;

         while(currNode.children.length >0){

         if(currNode.call === tmpNodo.valore){
         break;
         }

         currNode = currNode.children[currNode.children.length-1];
         }


         padre_att = hm_callPadre.get(tmpNodo.valore);
         console.log("REDO - impostato padre attuale come: " + hm_callPadre.get(tmpNodo.valore));
      }
   }
   console.log("DEBUG FINALE -");
   console.log(hm_callPadre);
   console.log(hm_padri);
   console.log(vetPadri);

   chart = {
      container: "#tree-simple",
      rootOrientation: "NORTH",
   };


console.log("root", root)
   var my_chart = new Treant({ chart: chart, nodeStructure: root });
}

parseTrace(trace);
