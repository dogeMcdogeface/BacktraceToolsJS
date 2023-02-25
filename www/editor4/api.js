let Prolog;
const Module = {
 // Provide options for customization
 arguments: ["-q"],
 on_output: console.info,
};

SWIPL(Module).then((module) => {
 Prolog = Module.prolog;

 // Start using Prolog
 /*Prolog.load_string("loves(ass, mia).\nloves(asts, mia).", "a1.pl");

 Prolog.call("leash(-all).");
 Prolog.call("trace.");*/
});



function canExecQuery() {
   return isQueryAreaValid() && queryNumb.checkValidity() && Prolog != null;
}

let queryOpen = false;
async function executeQuery() {
   if (queryOpen) {     //code to stop the query?
      return;
   } else if (!canExecQuery()) {
      console.log("Executing query. All fields valid: ", canExecQuery());
      return;
   }
  queryOpen = true;

  const program = codeArea.value;
  const count = queryNumb.value.trim();
  const goal = queryArea.value.trim().replace(/\.$/, '');
  const limitedGoal = `limit(${count}, (${goal}))`;
    console.log(limitedGoal);

  Prolog.load_string(program, "program.pl")
    .then(() => Prolog.forEach(limitedGoal))
    .then(parseAnswer)
    .then(displayAnswer)
    .catch(displayError)
    .finally(() => {
      queryOpen = false;
      console.log("Query completed");
    });
}

function queryNAnswers(query, count) {
   let answers = [];
   do {
      answer = query.next();
      answers.push(answer);
   } while (!answer.done && answers.length < count);
   return answers;
}

function parseAnswer(answers) {
console.log(answers);
   const parsedAnswers = answers.map(({ $tag, ...answer }) => (Object.keys(answer).length === 0 ? { "Has Solutions": true } : answer));
   return parsedAnswers.length ? parsedAnswers : [{ "Has Solutions": false }];
}

function displayError(err) {
   consoleArea.write(err, "red");
}

// Prints the solutions, builds a table from the solution data, and displays it in the console area
function displayAnswer(solutions) {
   //consoleArea.print("Query: ", responseObj.query, "Black");
   consoleArea.print("Debug: Solutions=", solutions, "LightSteelBlue");
   const table = buildAnswerTable(solutions);
   consoleArea.insert(table);
   //displayTrace(responseObj.trace);
}
