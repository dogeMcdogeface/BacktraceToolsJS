const workerTimeout = 8000;

function canExecQuery() {
  return validateInputs();
}

function executeQuery() {
  console.log("Executing query");

  if (!canExecQuery()) {
    console.log("Cannot start query");
    return;
  }

  const request = {
    //id: uniqueID(),
    program: codeArea.value,
    goal: queryArea.value.trim().replace(/\.$/, ""),
    count: queryNumb.value.trim(),
  };

  const worker = new Worker("./wasm/prolog-worker.js");
  worker.addEventListener("message", handle_response);

  let timer = setTimeout(handle_timeout, workerTimeout);
  function handle_response(response) {
    const result = response.data;
    //console.info("Worker says ", result);


    if (result.error && result.error === true) {
      handle_error(result);
    } else if (result.done && result.done === true) {
      handle_done(result);
    } else if (result.done === false) {
      handle_answer(result);
    } else if (result.trace) {
      handle_trace(result);
    }
  }

  function handle_error(data) {
    console.error("Error occurred:", data);
    clearTimeout(timer); //Reset the hanged worker timeout
    worker.terminate();
    // Do something to handle the error
  }

  function handle_done(data) {
    console.log("Worker finished processing:", data);
    clearTimeout(timer); //Reset the hanged worker timeout
    worker.terminate();
    // Do something after worker finishes processing
  }

  function handle_answer(data) {
    console.log("Worker returned answer:", data);
    clearTimeout(timer); //Reset the hanged worker timeout
    timer = setTimeout(handle_timeout, workerTimeout);

    // Do something with the worker's answer
  }

  function handle_trace(data) {
    //console.log("Worker returned trace:", data);
    // Do something with the worker's answer
  }

  function handle_timeout() {
    console.log("Worker timed out");
    worker.terminate();
  }

  worker.postMessage(request);
}

const uniqueID = () => Math.random().toString(36).substr(2, 12);
