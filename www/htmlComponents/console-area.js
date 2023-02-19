class ConsoleArea extends HTMLElement {
  constructor() {
    super();


    this.clear = function () {
      this.innerHTML = '';
    };

    this.write = function (text, color) {
      const line = document.createElement('div');
      line.textContent = text;
      line.style.color = color;
      this.appendChild(line);
      this.scrollToBottom();
    };

    this.print = function(...args) {
  const color = typeof args[args.length - 1] === 'string' ? args.pop() : 'black';
  const strArgs = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg);
  const message = strArgs.join(' ');
  const div = document.createElement('div');
  div.style.color = color;
  div.textContent = message;
      this.appendChild(div);
      this.scrollToBottom();
    }

    this.insert = function (element) {
      this.appendChild(element);
      this.scrollToBottom();
    };

    this.scrollToBottom  = function (){
          this.scrollTo(0, this.scrollHeight);
    }

  }
}


customElements.define('console-area', ConsoleArea);