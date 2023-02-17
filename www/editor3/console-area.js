class ConsoleArea extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this.writeToConsole = function (color, text) {
      const line = document.createElement('div');
      line.textContent = text;
      line.style.color = color;
      shadow.appendChild(line);
    };
  }
}

customElements.define('console-area', ConsoleArea);