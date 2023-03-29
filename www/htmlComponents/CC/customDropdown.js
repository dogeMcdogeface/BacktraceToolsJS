class CustomDropdown extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Create a button for the dropdown
    const dropButt = document.createElement('button');
    dropButt.textContent = this.title; // Use the title attribute as the button text
    dropButt.className = 'dropdown-button'; // Add a class to the button

    // Create a list to hold the dropdown items
    this.dropList = document.createElement('div');
    this.dropList.className = 'dropdown-content';
    // Loop through each child element of the custom dropdown element
    for (let child of Array.from(this.children)) {
      this.dropList.appendChild(child);
    }

    this.innerHTML = ''; // Clear the contents of the custom dropdown element
    this.appendChild(dropButt); // Add the dropdown button to the custom dropdown element
    this.appendChild(this.dropList); // Add the dropdown list to the custom dropdown element
  }
  appendElement(child) {
        this.dropList.appendChild(child);
      }
}

// Register the custom element
customElements.define('custom-dropdown', CustomDropdown);
