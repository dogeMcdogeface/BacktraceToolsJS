const button = document.getElementById("myButton");
const message = document.getElementById("message");

button.addEventListener("click", function() {
  message.innerHTML = "Hello, world!";
  console.log(hm_callPadre);
  console.log(vetstr);
});

/******     Classe Nodo     ******/

class Nodo  {

  constructor(riga){
    this.istruzione = "";
    this.scope = "";
    this.valore = ""; 
    this.genitore = null; //TODO: possibile non serva
    this.nd_str = [];
    // TODO: nel caso istruzione sia Fail, mettere un boolean true per poi usarlo per cambiare font al nodo albero ********************

    // prende riga input e la divide assegnandola ai campi del nodo
    this.nd_str = riga.split(": (");
    this.istruzione = this.nd_str[0]; // TODO:attenzione a possibili spazi prima della prima Call se fanno danni
    console.debug(`NODO - assegno istruzione: ${this.istruzione}`);

    this.nd_str = this.nd_str[1].split(") ");
    this.scope = this.nd_str[0];
    console.debug(`NODO - assegno scope: ${this.scope}`);
    this.valore = this.nd_str[1];
    console.debug(`NODO - assegno valore: ${this.valore}`);
  }
}
/******      Incrementale  ******/

let cntNodi = 0;
function next(){
  console.log('NEXT - chiamata');
  return cntNodi++;
}
/******      Classe Padre  ******/

class Padre{
  constructor(nome){
    this.nome = nome;
    this.figli = [];
  }
}


/******     Parser input    ******/     //TODO: STARE ATTENTI AI \ E FAR SI CE NE SIANO 2 (\\)
console.log("Inizializza Programma");
let input = `   Call: (1) jealous(_25826, _25828)
Unify: (1) jealous(_25826, _25828)
Call: (2) loves(_25826, _26942)
Unify: (2) loves(vincent, mia)
Exit: (2) loves(vincent, mia)
Call: (2) loves(_25828, mia)
Unify: (2) loves(vincent, mia)
Exit: (2) loves(vincent, mia)
Call: (2) vincent\\==vincent
Fail: (2) vincent\\==vincent
Redo: (2) loves(_25828, mia)
Unify: (2) loves(marcellus, mia)
Exit: (2) loves(marcellus, mia)
Call: (2) vincent\\==marcellus
Exit: (2) vincent\\==marcellus
Exit: (1) jealous(vincent, marcellus)
Redo: (2) loves(_25826, _26942)
Unify: (2) loves(marcellus, mia)
Exit: (2) loves(marcellus, mia)
Call: (2) loves(_25828, mia)
Unify: (2) loves(vincent, mia)
Exit: (2) loves(vincent, mia)
Call: (2) marcellus\\==vincent
Exit: (2) marcellus\\==vincent
Exit: (1) jealous(marcellus, vincent)
Redo: (2) loves(_25828, mia)
Unify: (2) loves(marcellus, mia)
Exit: (2) loves(marcellus, mia)
Call: (2) marcellus\\==marcellus
Fail: (2) marcellus\\==marcellus
Redo: (2) loves(_25826, _26942)
Unify: (2) loves(pumpkin, honey_bunny)
Exit: (2) loves(pumpkin, honey_bunny)
Call: (2) loves(_25828, honey_bunny)
Unify: (2) loves(pumpkin, honey_bunny)
Exit: (2) loves(pumpkin, honey_bunny)
Call: (2) pumpkin\\==pumpkin
Fail: (2) pumpkin\\==pumpkin
Redo: (2) loves(_25826, _26942)
Unify: (2) loves(honey_bunny, pumpkin)
Exit: (2) loves(honey_bunny, pumpkin)
Call: (2) loves(_25828, pumpkin)
Unify: (2) loves(honey_bunny, pumpkin)
Exit: (2) loves(honey_bunny, pumpkin)
Call: (2) honey_bunny\\==honey_bunny
Fail: (2) honey_bunny\\==honey_bunny
Fail: (1) jealous(_25826, _25828)`
;

const hm_callPadre = new Map();
const hm_padri = new Map();
let val_call = null;
let padre_ass = null;

let padre_att = "";

const vetPadri = []; //vettore per tenere traccia dei padri nell'hashmap padri

//***   estraggo stringhe per prima coppia hashmap callPadre  ***/
const vetstr = input.split('\n');
let tmpNodo = new Nodo(vetstr[0]);
console.log(tmpNodo);

//*salvo padre per campo primo elemento hashmap callPadre
padre_ass=tmpNodo.valore+'#'+next();     
console.log('PRIMO - salvo padre per campo primo elemento hashmap callPadre: '+padre_ass);
padre_att=padre_ass;      //imposto padre attuale per dopo il primo nodo
hm_padri.set(padre_ass, new Padre(padre_ass));   //salvo in hm_padri il nome padre e un oggetto padre a cui assegnerò i figli (altri nodi)
console.log(hm_padri);

vetPadri.push(padre_att);
console.log(vetPadri);


for(let i=1; i<vetstr.length;i++){
  tmpNodo = new Nodo(vetstr[i]);
  // debug console.log("FOR PP - valore: "+i)
  if(tmpNodo.istruzione === 'Call'){
    //*salvo call(key) per campo primo elemento hashmap callPadre
    val_call = tmpNodo.valore;
    console.log('PRIMO - salvo call per campo primo elemento hashmap callPadre: '+val_call);
    break; 
  }
}

//*creo ed inserisco prima coppia hashmap
hm_callPadre.set(val_call,padre_ass);
console.log(hm_callPadre);

/*** estrae stringhe successive alla prima per riempire tutta hashmap ***/
let i;
for(i=1;i<vetstr.length;i++){
  tmpNodo = new Nodo(vetstr[i]);
  if(tmpNodo.istruzione == 'Exit'){
    padre_ass=tmpNodo.valore+"#"+next();
    //debug console.log("EXIT - "+padre_ass);
    hm_padri.get(padre_att).figli.push(padre_ass);
    //debug console.log(hm_padri.get(padre_att).figli);
    padre_att=padre_ass;

    vetPadri.push(padre_att);

    hm_padri.set(padre_ass, new Padre(padre_ass));
    //debug console.log('HM_PADRI - '); console.log(hm_padri);

    for(let j=i+1;j<vetstr.length;j++){
      tmpNodo = new Nodo(vetstr[j]);
      if(tmpNodo.istruzione == 'Exit'){
        console.log("BREAK - secondo Exit di fila");
        break;
      }
      if(tmpNodo.istruzione == 'Call'){
        val_call=tmpNodo.valore;
        hm_callPadre.set(val_call,padre_ass);
        console.log("CALL - trovata");
        console.log(hm_callPadre);
        break;
      }
    }
  }
  if(tmpNodo.istruzione == 'Fail'){
    padre_ass=tmpNodo.valore+"#"+next();
    hm_padri.get(padre_att).figli.push(padre_ass);
    padre_att=padre_ass;

    vetPadri.push(padre_att);

    hm_padri.set(padre_ass, new Padre(padre_ass));
    console.log("FAIL - trovata");
    console.log(hm_padri);
  }

  if(tmpNodo.istruzione == 'Redo'){
    padre_att=hm_callPadre.get(tmpNodo.valore);
    console.log("REDO - impostato padre attuale come: "+hm_callPadre.get(tmpNodo.valore));
  }

}
console.log("DEBUG FINALE -");
console.log(hm_callPadre);
console.log(hm_padri);
console.log(vetPadri);



 


