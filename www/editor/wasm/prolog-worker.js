importScripts("./swipl-bundle.js");

let Prolog;
const Module = {
  // Provide options for customization
  arguments: ["-q"],
  on_output: passTrace, //console.info,
};


const loadPrologModule = SWIPL(Module).then((module) => {
  Prolog = module.prolog;
  Prolog.call("leash(-all).");
});


self.addEventListener("message", async (event) => {
  const request = event.data;
  //const startTime = new Date();
  await loadPrologModule;
  //console.log("seconds" + ((new Date())-startTime)/1000  );
  const results = await handleRequest(request);
  //self.postMessage(results);
  self.close();
});


async function handleRequest(request) {
  console.log("Request:", request);

  const program = request.program;
  const count = parseInt(request.count);
  const goal = request.goal;
  const tracedGoal = `(trace, (${goal}))`;

  //----------------------------------------- LOAD PROGRAM ---------------------------------------------------------
  await Prolog.load_string(program, "program.pl"); // Load program

  //----------------------------------------- TEST GOAL ------------------------------------------------------------
  let query = Prolog.query(goal);
  const result = query.next();
  query.close();

  if (result.error && result.error === true) {
    self.postMessage(result);
    return;
  }

  //----------------------------------------- SOLVE QUERY ----------------------------------------------------------
  query = Prolog.query(tracedGoal);
  for (let i = 0; i < count; i++) {
    const answer = query.next();
    self.postMessage(answer);

    if (answer.done === true) return;
  }
  self.postMessage({ done: true, value: { _: "Continues..." } });
  return 0;
}

function passTrace(txt, err) {
   if (txt.includes("wasm_call_string")) return;
  self.postMessage({ trace: txt });
}
