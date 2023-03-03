const workerTimeout = 8000;

function canExecQuery() {
   return validateInputs();
}

getNextWorker();
function getNextWorker() {
   const currWorker = window.nextWorker;
   window.nextWorker = new Worker("./wasm/prolog-worker.js");
   return currWorker;
}

function executeQuery() {
   console.log("Executing query");

   if (!canExecQuery()) {
      console.log("Cannot start query");
      return;
   }

   const request = {
      program: codeArea.value,
      goal: queryArea.value.trim().replace(/\.$/, ""),
      count: queryNumb.value.trim(),
   };
   const block = createAnswerBlock();
   block.title = request.goal + ".";

   //const worker = new Worker("./wasm/prolog-worker.js");
   const worker = getNextWorker();
   worker.addEventListener("message", handle_response);

   let timer = setTimeout(handle_timeout, workerTimeout);
   function handle_response(response) {
      const result = response.data;
     // console.info("Worker says ", result);
      if (result.error && result.error === true) {
         handle_error(result);
      } else if (result.done && result.done === true) {
         handle_answer(result);
         handle_done(result);
      } else if (result.done === false) {
         handle_answer(result);
      } else if (result.trace) {
         handle_trace(result);
      }
   }

   function handle_error(data) {
      console.warn("Error occurred:", data);
      clearTimeout(timer); //Reset the hanged worker timeout
      worker.terminate();
      block.setError(data.message);
      // Do something to handle the error
   }

   function handle_done(data) {
      console.info("Worker finished processing:", data);
      clearTimeout(timer); //Reset the hanged worker timeout
      worker.terminate();
      // Do something after worker finishes processing
   }

   function handle_answer(data) {
      console.info("Worker returned answer:", data);
      clearTimeout(timer); //Reset the hanged worker timeout
      timer = setTimeout(handle_timeout, workerTimeout);

      const { $tag, ...rowData } = data.value || {};
      const hasSolutions = Object.keys(rowData).length === 0;
      block.addRow(hasSolutions ? { "Has Solutions": !!data.value } : rowData);
   }

   function handle_trace(data) {
      //console.log("Worker returned trace:", data);
      printToTrace(data.trace);
      // Do something with the worker's answer
   }

   function handle_timeout() {
      console.warn("Worker timed out");
      worker.terminate();
      handle_error({error:true, message:"Runtime error: Query timed out"});
   }

   worker.postMessage(request);
}

const uniqueID = () => Math.random().toString(36).substr(2, 12);
