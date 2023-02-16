var codeTextArea = document.getElementById("code");
var lineNumbersDiv = document.getElementById("line-numbers");

codeTextArea.addEventListener("input", updateLineNumbers);
codeTextArea.addEventListener("scroll", updateLineNumbers);

function updateLineNumbers() {
  lineNumbersDiv.innerHTML = "";

  var lines = codeTextArea.value.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = document.createElement("div");
    line.innerText = i + 1;
    lineNumbersDiv.appendChild(line);
  }
}
