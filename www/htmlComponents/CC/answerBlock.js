class AnswerBlock extends HTMLElement {
   constructor() {
      super();
   }

connectedCallback() {
  // Create the header bar with label and buttons
  this.setAttribute('tabindex', '0');

  const header = document.createElement("div");
  header.classList.add("header");

  this.labelElement = document.createElement("span");
  this.labelElement.textContent = this.getAttribute("title") || "New Query";
  header.appendChild(this.labelElement);

  const addButton = document.createElement("button");
  addButton.textContent = "Stop";
  addButton.addEventListener("click", this.addRow.bind(this));
  header.appendChild(addButton);

  const hideButton = document.createElement("button");
  hideButton.id = "hideButton";
  hideButton.textContent = "⌵";
  hideButton.addEventListener("click", this.toggleTable.bind(this));
  header.appendChild(hideButton);

  this.appendChild(header);

  // Create the table body
  const tableDiv = document.createElement("div");
  tableDiv.classList.add("body");

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);
  tableDiv.appendChild(table);

  // Save the table body for later use
  this.thead = thead;
  this.tbody = tbody;

  // Add error label at the bottom of the table body
  const errorLabel = document.createElement("div");
  errorLabel.classList.add("errorlabel");
  tableDiv.appendChild(errorLabel);

  this.appendChild(tableDiv);

  // Save the error label for later use
  this.errorLabel = errorLabel;
}

// Function to set the value of the error label
setError(value) {
  this.errorLabel.textContent = value;
}


   set title(value) {
      this.labelElement.textContent = value;
   }

   addRow(data) {
      const keys = Object.keys(data);
      if (this.thead.innerHTML === "") {
         const headerRow = document.createElement("tr");
         headerRow.insertCell().textContent = "#";
         for (const key of keys) {
            headerRow.insertCell().textContent = key;
         }
         this.thead.appendChild(headerRow);
      }
      const row = document.createElement("tr");
      row.insertCell().textContent = this.tbody.childElementCount + 1;
      for (const value of Object.values(data)) {
         const txt = typeof value === "object" && value.hasOwnProperty("v") ? '"' + value.v + '"' : typeof value === "object" ? JSON.stringify(value) : value;
         row.insertCell().textContent = txt;
      }
      this.tbody.appendChild(row);
   }

   toggleTable() {
      const table = this.querySelector("table");
      this.classList.toggle("hidden");
   }
}

// Define the custom element
customElements.define("answer-block", AnswerBlock);
