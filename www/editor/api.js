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

let currentQuery = {
   open: false,
   trace: [],
   state: "Done",
};

function prologOut(txt, err) {
   if (txt.includes("wasm_call_string")) return;
   //console.log(txt);
   printToTrace(txt);
   currentQuery.trace.push(txt);
}

function canExecQuery() {
   return isQueryAreaValid() && queryNumb.checkValidity() && Prolog != null && !currentQuery.open;
}

async function executeQuery() {
   console.log("Starting query");
   if (!canExecQuery()) {
      console.log("Cannot start query");
      return;
   }
   currentQuery = {
      open: true,
      trace: [],
      state: "Loading Program",
   };
   updateGUI();

   const program = codeArea.value;
   const count = queryNumb.value.trim();
   const goal = queryArea.value.trim().replace(/\.$/, "");
   const tracedGoal = `(trace, (${goal}))`;
    currentQuery.goal = goal;
   try {
      await Prolog.load_string(program, "program.pl"); // Load program
      let results = await queryTest(goal);
      currentQuery.trace = [];
      currentQuery.state = "Executing...";
      updateGUI();
      clearTrace();
      results = await queryNAnswers(tracedGoal, count);
      currentQuery.state = "Displaying Results...";
      updateGUI();
      console.log("results", results);
      displayAnswer(parseAnswer(results));
      displayTraceTree(currentQuery.trace);
   } catch (error) {
      displayError(error);
      console.error(error);
   } finally {
      currentQuery.open = false;
      currentQuery.state = "Done";
      updateGUI();
      console.log("Query completed");
   }
}

//window.prompt = function (){console.error("Prompts are disabled on this page");return ""};
function queryNAnswers(goal, count, onAnswerReceived) {
   let query = Prolog.query(goal);
   let answers = [];

   return new Promise((resolve, reject) => {
      function getNextAnswer() {
         setTimeout(() => {
            const answer = query.next();
            answers.push(answer);
            if (onAnswerReceived) {
               onAnswerReceived(answer);
            }
            currentQuery.state = "Executing     " + answers.length + "  /   " + count;
            if (answer.error && answer.error === true) {
               reject(new Error(answer.message));
            } else if (answer.done || answers.length >= count || currentQuery.stop) {
               query.close();
               Prolog.call("notrace.");
               resolve(answers);
            } else {
               currentQuery.trace.push(answer); // optional, for debugging purposes
               getNextAnswer();
            }
         }, 0);
      }
      getNextAnswer();
   });
}

function queryTest(goal) {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
         console.log("Testing query ", goal);
         let query = Prolog.query(goal);
         let result = query.next();
         query.close();
         console.log(result);

         if (result.error && result.error === true) {
            reject(new Error(result.message));
         } else {
            resolve(result);
         }
      }, 0);
   });
}

function parseAnswer(answers) {
   let parsedAnswers = [];

   if (answers[0].error) {
      parsedAnswers = [{ Error: answers[0].message }];
   } else if (answers[0].value === undefined) {
      parsedAnswers = [{ "Has Solutions": false }];
   } else {
      parsedAnswers = answers
         .filter((answer) => answer.value !== undefined)
         .map((answer) => {
            const { $tag, ...parsedAnswer } = answer.value;
            return Object.keys(parsedAnswer).length === 0 ? { "Has Solutions": true } : parsedAnswer;
         });
      if (answers[answers.length - 1].done === false) {
         parsedAnswers.push({ _: "Continues..." });
      }
   }

   console.log("parsedAnswers", parsedAnswers);
   return parsedAnswers;
}


// Prints the solutions, builds a table from the solution data, and displays it in the console area
function displayAnswer(solutions) {
   //consoleArea.print("Query: ", responseObj.query, "Black");
   //consoleArea.print("Debug: Solutions=", solutions, "LightSteelBlue");
   const table = buildAnswerTable(solutions);
   consoleArea.insert(document.createElement("br"));
   consoleArea.write("Query: " + currentQuery.goal, "darkblue");
   consoleArea.insert(table);
}


function displayTraceTree(trace){
    //console.info(trace);
}

function displayError(err) {
   consoleArea.write(err, "red");
}
