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
    const dropList = document.createElement('div');
    dropList.className = 'dropdown-content';
    // Loop through each child element of the custom dropdown element
    for (let child of this.children){
      // Create a button for each child element
      const btn = document.createElement('button');
      btn.textContent = child.textContent; // Use the child element's text as the button text
      btn.id = "header-"+child.textContent+"-button"; // Add an ID to the button
      dropList.appendChild(btn); // Add the button to the dropdown list
    }

    this.innerHTML = ''; // Clear the contents of the custom dropdown element
    this.appendChild(dropButt); // Add the dropdown button to the custom dropdown element
    this.appendChild(dropList); // Add the dropdown list to the custom dropdown element
  }
}

// Register the custom element
customElements.define('custom-dropdown', CustomDropdown);
