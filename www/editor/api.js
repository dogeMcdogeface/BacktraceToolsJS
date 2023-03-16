const workerTimeout = 10000;
const animateTree = false;

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

   const block = document.createElement("answer-block");
   consoleArea.insert(block);

   block.title = request.goal + ".";
   block.status = "Starting.";
   block.trace = [];
   block.onSelected = () => {
      clearTrace();
      printToTrace(block.trace);
       printToTree(block.trace);
   };
   consoleArea.selectElement(block);

   //const worker = new Worker("./wasm/prolog-worker.js");
   const worker = getNextWorker();
   worker.addEventListener("message", handle_response);
   worker.postMessage(request);
   block.status = "Executing.";

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
      //console.warn("Error occurred:", data);
      clearTimeout(timer); //Reset the hanged worker timeout
      worker.terminate();
      block.setError(data.message);
      block.status = "Aborted.";
      // Do something to handle the error
   }

   function handle_done(data) {
      //console.info("Worker finished processing:", data);
      clearTimeout(timer); //Reset the hanged worker timeout
      worker.terminate();
      block.status = "Finished.";
      if (block.selected ) printToTree(block.trace);
   }

   function handle_answer(data) {
      //console.info("Worker returned answer:", data);
      clearTimeout(timer); //Reset the hanged worker timeout
      timer = setTimeout(handle_timeout, workerTimeout);

      const { $tag, ...rowData } = data.value || {};
      const hasSolutions = Object.keys(rowData).length === 0;
      block.addRow(hasSolutions ? { "Has Solutions": !!data.value } : rowData);
   }

   request.traceCount = 0;
   function handle_trace(data) {
      block.trace.push(data.trace);
      block.progress = request.traceCount++;
      if (block.selected) printToTrace(data.trace);
      if (block.selected && animateTree) printToTree(block.trace);
   }

   function handle_timeout() {
      console.warn("Worker timed out");
      worker.terminate();
      handle_error({ error: true, message: "Runtime error: Query timed out" });
   }
   block.stopButton.onclick = function () {
      worker.terminate();
      handle_error({ error: true, message: "Query manually stopped" });
   };
}

const uniqueID = () => Math.random().toString(36).substr(2, 12);
