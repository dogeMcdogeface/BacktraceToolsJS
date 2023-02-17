class ConsoleArea extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this.clear = function () {
      shadow.innerHTML = '';
    };

    this.write = function (color, text) {
      const line = document.createElement('div');
      line.textContent = text;
      line.style.color = color;
      shadow.appendChild(line);
      this.scrollToBottom();
    };

    this.insert = function (element) {
      shadow.appendChild(element);
      this.scrollToBottom();
    };

    this.scrollToBottom  = function (){
          this.scrollTo(0, this.scrollHeight);
    }

  }
}


customElements.define('console-area', ConsoleArea);