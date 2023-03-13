

/******     Classe Nodo     ******/

class Nodo  {

  constructor(riga){
    this.istruzione = "";
    this.scope = "";
    this.valore = "";
    this.genitore = null; //TODO: CANCELLA CHE NON SERVE, vedere se serve  vetPadri
    this.nd_str = [];


    // prende riga input e la divide assegnandola ai campi del nodo
    this.nd_str = riga.split(": (");
    this.istruzione = this.nd_str[0]; //
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

class Elemento{
  constructor(nome){
    this.nome = nome;
    this.genitore = "";
    this.colore = false;
  }
}


/******     Parser input    ******/
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
const vetElem = [];
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


//crea oggetto Elemento per il primo e lo salva in vetElem(non ha un genitore)
vetElem.push( new Elemento(padre_ass));
console.log(vetElem);

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

    //credo oggetto elemento con nome e gli assegno come genitore padre_ass e poi lo inserisco in vetElem
    tmpElem = new Elemento(padre_ass);
    tmpElem.genitore = padre_att;
    vetElem.push(tmpElem);
    console.log(vetElem);


    padre_att=padre_ass;

    vetPadri.push(padre_att);



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


    tmpElem = new Elemento(padre_ass);
    tmpElem.genitore = padre_att;
    tmpElem.colore = true;
    vetElem.push(tmpElem);
    console.log(vetElem);

    padre_att=padre_ass;

    vetPadri.push(padre_att);


    console.log("FAIL - trovata");

  }

  if(tmpNodo.istruzione == 'Redo'){
    padre_att=hm_callPadre.get(tmpNodo.valore);
    console.log("REDO - impostato padre attuale come: "+hm_callPadre.get(tmpNodo.valore));
  }

}
console.log("DEBUG FINALE -");
console.log(hm_callPadre);
console.log(vetElem);
console.log(vetPadri);

/*** PARTE CREAZIONE ALBERO ***/



var config = {
        container: "#basic-example",

        connectors: {
            type: 'straight'
        },
        node: {
            HTMLclass: 'nodeExample1'
        }
    },






    ceo = {
        text: {
            name: "Mark Hill",
            title: "Chief executive officer",
            contact: "Tel: 01 213 123 134",
        },
        image: "../headshots/2.jpg"
    },

    cto = {
        parent: ceo,
        text:{
            name: "Joe Linux",
            title: "Chief Technology Officer",
        },
        stackChildren: true,
        image: "../headshots/1.jpg"
    },
    cbo = {
        parent: ceo,
        stackChildren: true,
        text:{
            name: "Linda May",
            title: "Chief Business Officer",
        },
        image: "../headshots/5.jpg"
    },
    cdo = {
        parent: ceo,
        text:{
            name: "John Green",
            title: "Chief accounting officer",
            contact: "Tel: 01 213 123 134",
        },
        image: "../headshots/6.jpg"
    },
    cio = {
        parent: cto,
        text:{
            name: "Ron Blomquist",
            title: "Chief Information Security Officer"
        },
        image: "../headshots/8.jpg"
    },
    ciso = {
        parent: cto,
        text:{
            name: "Michael Rubin",
            title: "Chief Innovation Officer",
            contact: {val: "we@aregreat.com", href: "mailto:we@aregreat.com"}
        },
        image: "../headshots/9.jpg"
    },
    cio2 = {
        parent: cdo,
        text:{
            name: "Erica Reel",
            title: "Chief Customer Officer"
        },
        link: {
            href: "http://www.google.com"
        },
        image: "../headshots/10.jpg"
    },
    ciso2 = {
        parent: cbo,
        text:{
            name: "Alice Lopez",
            title: "Chief Communications Officer"
        },
        image: "../headshots/7.jpg"
    },
    ciso3 = {
        parent: cbo,
        text:{
            name: "Mary Johnson",
            title: "Chief Brand Officer"
        },
        image: "../headshots/4.jpg"
    },
    ciso4 = {
        parent: cbo,
        text:{
            name: "Kirk Douglas",
            title: "Chief Business Development Officer"
        },
        image: "../headshots/11.jpg"
    }

    chart_config = [
        config,
        ceo,
        cto,
        cbo,
        cdo,
        cio,
        ciso,
        cio2,
        ciso2,
        ciso3,
        ciso4
    ];




 


