class ConsoleArea extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    /*const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'console-area.css');
    shadow.appendChild(link);*/

    this.writeToConsole = function (color, text) {
      const line = document.createElement('div');
      line.textContent = text;
      line.style.color = color;
      shadow.appendChild(line);
    };
  }
}

customElements.define('console-area', ConsoleArea);