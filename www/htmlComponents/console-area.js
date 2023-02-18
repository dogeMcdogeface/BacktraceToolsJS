class ConsoleArea extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this.clear = function () {
      shadow.innerHTML = '';
    };

    this.write = function (text, color) {
      const line = document.createElement('div');
      line.textContent = text;
      line.style.color = color;
      shadow.appendChild(line);
      this.scrollToBottom();
    };

    this.print = function(...args) {
  const color = typeof args[args.length - 1] === 'string' ? args.pop() : 'black';
  const strArgs = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg);
  const message = strArgs.join(' ');
  const div = document.createElement('div');
  div.style.color = color;
  div.textContent = message;
      shadow.appendChild(div);
      this.scrollToBottom();
    }

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