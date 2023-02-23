

function canExecQuery(){
    return (isQueryAreaValid() && queryNumb.checkValidity() && Prolog != null);
}

let queryOpen = false;
function executeQuery(){
    if(queryOpen) return;
    queryOpen = true;

    console.log("Executing query. All fields valid: ", canExecQuery());
    if(!canExecQuery())return;

    const program = codeArea.value;
    const goal = queryArea.value;
    const count = queryNumb.value;
    //console.log(program, goal, count);
    //load program
    const loadedProgram = Prolog.load_string(program, "program.pl");    //Can throw ERROR
    loadedProgram.then( function(result){
        console.log(result, loadedProgram);
         //execute the query
             query = Prolog.query(goal);
             let answers = [];
             do {
              answer = query.next();
              answers.push(answer);
              //console.log(answer);
             } while (!answer.done && answers.length < count);
             query.close();
             console.log(query);
             const parsedAnswers = parseAnswer(answers);
             displayAnswer(parsedAnswers);
             queryOpen = false;
    });
}

function parseAnswer(answers) {
     var parsedAnswers = [];

     for(answer of answers){
          var parsed={};
        if(answer.error == true){
            parsed.error = answer.message;
        }else if(!answer.value){
            parsed['Has Solutions'] = false;
        }else{
            parsed = { ...answer.value };
            delete parsed["$tag"];
        }
        parsedAnswers.push(parsed);
    }

        //console.log(parsedAnswers);

 return parsedAnswers;
}


// Prints the solutions, builds a table from the solution data, and displays it in the console area
function displayAnswer(solutions) {
   //consoleArea.print("Query: ", responseObj.query, "Black");
   consoleArea.print("Debug: Solutions=", solutions, "LightSteelBlue");
   const table = buildAnswerTable(solutions);
   consoleArea.insert(table);
   //displayTrace(responseObj.trace);
}