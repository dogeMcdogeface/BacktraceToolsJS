let Prolog;
const Module = {
 // Provide options for customization
 arguments: ["-q"],
 on_output: prologOut,
};

SWIPL(Module).then((module) => {
 Prolog = Module.prolog;
    Prolog.call("leash(-all).");
});



let trace = [];
function prologOut(txt, err){
    console.log(txt, err);
    if(txt.includes("wasm_call_string"))return;
    trace.push(txt);
}



function canExecQuery() {
   return isQueryAreaValid() && queryNumb.checkValidity() && Prolog != null;
}

let queryOpen = false;
let queryYeld = false;
async function executeQuery() {
   if (queryOpen) {     //code to stop the query?
      queryYeld = true;
      return;
   } else if (!canExecQuery()) {
      console.log("Executing query. All fields valid: ", canExecQuery());
      return;
   }
  queryOpen = true;

  const program = codeArea.value;
  const count = queryNumb.value.trim();
  const goal = queryArea.value.trim().replace(/\.$/, '');
  const tracedGoal = `(trace, (${goal}))`;
  //const limitedGoal = `limit(${count}, (${goal}))`;
  console.log(tracedGoal);
  Prolog.load_string(program, "program.pl")
    //.then(() => Prolog.forEach(limitedGoal))
    .then(() => queryNAnswers(tracedGoal, count))
    .then(parseAnswer)
    .then(displayAnswer)
   // .catch(displayError)
    .finally(() => {
      queryOpen = false;
      console.log("Query completed");
    });
}

function queryNAnswers(goal, count) {
  let query = Prolog.query(goal);
   let answers = [];

  return new Promise((resolve, reject) => {
  //Prolog.call("trace.");
  trace = [];
   do {
      answer = query.next();
      answers.push(answer);
   } while (!answer.done && answers.length < count);
    query.close();
    Prolog.call("notrace.");
   resolve(answers);
   });
   //return answers;
}

function parseAnswer(answers) {
  let parsedAnswers = [];

  if (answers[0].error) {
    parsedAnswers = [{ "Error": answers[0].message }];
  } else if (answers[0].value === undefined) {
    parsedAnswers = [{ "Has Solutions": false }];
  } else {
    parsedAnswers = answers
      .filter(answer => answer.value !== undefined)
      .map(answer => {
        const { $tag, ...parsedAnswer } = answer.value;
        return Object.keys(parsedAnswer).length === 0
          ? { "Has Solutions": true }
          : parsedAnswer;
      });
    if (answers[answers.length - 1].done === false) {
      parsedAnswers.push({ _: "Continues..." });
    }
  }

  console.log("parsedAnswers", parsedAnswers);
  return parsedAnswers;
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
   displayTrace(trace);
}
