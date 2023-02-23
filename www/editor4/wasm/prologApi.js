let Prolog;

const Module = {
 // Provide options for customization
 on_output: console.info,
};

SWIPL(Module).then((module) => {
 Prolog = Module.prolog;

 // Start using Prolog
 /*Prolog.load_string("loves(ass, mia).\nloves(asts, mia).", "a1.pl");

 Prolog.call("leash(-all).");
 Prolog.call("trace.");

 let q = Prolog.query("loves(I,O)");
 do {
  r = q.next();
  console.log(r);
 } while (!r.done);
 q.close();*/
});
