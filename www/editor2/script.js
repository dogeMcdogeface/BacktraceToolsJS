class CodeArea extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <style>
        .container {
          display: flex;
          height: 50vh;
          background:silver;
          overflow: auto;
        }

        ol {
          font-family: monospace;
          white-space: pre;
          height: 100%;
          max-width: 4ch;
          flex: 1;
          margin: 0px;
        }

        li::marker {
          font-size: 10px;
          color: grey;
        }

        textarea {
          flex: 1;
          border: none;
          overflow: hidden;
          resize: none;
          height: 100%;
        }
      </style>
      <div class="container">
        <ol><li></li></ol>
        <textarea></textarea>
      </div>
    `;
  }

  connectedCallback() {
    const textarea = this.shadowRoot.querySelector('textarea');
    textarea.value = localStorage.getItem('codeAreaContent') || '';
    textarea.addEventListener('input', () => this.autoResize(textarea));
    this.autoResize(textarea);
    window.addEventListener('beforeunload', () => localStorage.setItem('codeAreaContent', textarea.value));
  }

  autoResize(element) {
    element.style.height = "auto";
    element.style.height = (element.scrollHeight) + "px";
    const lines = element.value.split("\n").length;

    const olElement = this.shadowRoot.querySelector("ol");
    olElement.innerHTML = "";
    for (let i = 0; i < lines; i++) {
      const listItem = document.createElement("li");
      olElement.appendChild(listItem);
    }
  }
}

customElements.define('code-area', CodeArea);
