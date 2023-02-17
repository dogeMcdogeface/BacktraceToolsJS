
class LineNumberedTextarea extends HTMLTextAreaElement {
  constructor() {
    super();

    // Add a shadow DOM to the element
    const shadow = this.attachShadow({ mode: 'open' });

    // Create a container for the line numbers and the text area
    const container = document.createElement('div');

    // Create a line number container and add it to the container
    const lineNumberContainer = document.createElement('div');
    lineNumberContainer.setAttribute('style', 'display: inline-block; width: 30px; color: gray; text-align: right;');
    container.appendChild(lineNumberContainer);

    // Create the text area and add it to the container
    const textarea = document.createElement('textarea');
    textarea.setAttribute('style', 'display: inline-block; width: calc(100% - 30px); border: none; resize: none; padding: 5px;');
    container.appendChild(textarea);

    // Append the container to the shadow DOM
    shadow.appendChild(container);

    // Set the initial value of the line numbers and the text area
    this._updateLineNumbers();
    textarea.value = this.value;

    // Add event listeners to update the line numbers and the text area
    textarea.addEventListener('input', () => {
      this.value = textarea.value;
      this._updateLineNumbers();
    });
    this.addEventListener('input', () => {
      textarea.value = this.value;
      this._updateLineNumbers();
    });
  }

  _updateLineNumbers() {
    const textarea = this.shadowRoot.querySelector('textarea');
    const lineNumberContainer = this.shadowRoot.querySelector('div:nth-child(1)');
    lineNumberContainer.innerHTML = '';
    const lines = textarea.value.split('\n');
    for (let i = 1; i <= lines.length; i++) {
      const lineNumber = document.createElement('div');
      lineNumber.innerText = i;
      lineNumberContainer.appendChild(lineNumber);
    }
  }
}


customElements.define('line-numbered-textarea', LineNumberedTextarea, { extends: 'textarea' });