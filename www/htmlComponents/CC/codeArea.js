class CodeArea extends HTMLElement {
   constructor() {
      super();
      this.innerHTML = `
      <div class="container">
        <ol><li></li></ol>
        <textarea placeholder="${this.innerText}"></textarea>
      </div>
    `;
      this.textarea = this.querySelector("textarea");
      this.ol = this.querySelector("ol");
      this.autoResize = this.autoResize.bind(this);

      let sideTextValue = getComputedStyle(this).getPropertyValue("--side-text-value");
      sideTextValue = sideTextValue.replace(/[^"]*"([^"]*)"[^"]*/g, "$1").trim();
      this.ol.style.maxWidth = `${4 + sideTextValue.length}ch`;
   }

   connectedCallback() {
      this.textarea.value = localStorage.getItem("codeAreaContent" + this.id) || "";
      this.textarea.addEventListener("input", this.autoResize);
      window.addEventListener("resize", this.autoResize);
      setTimeout(this.autoResize);

      window.addEventListener("beforeunload", () => localStorage.setItem("codeAreaContent" + this.id, this.textarea.value));
   }

   autoResize() {
      const lines = this.textarea.value.split("\n").length;
      this.textarea.style.height = "auto";
      this.textarea.style.height = `${this.textarea.scrollHeight}px`;
      this.ol.innerHTML = `<li></li>`.repeat(lines);
   }

   /*addNewLine() {
      const currentPos = this.textarea.selectionStart;
      const currentValue = this.textarea.value;
      this.textarea.value = currentValue.substring(0, currentPos) + "\n" + currentValue.substring(currentPos, currentValue.length);
      this.textarea.selectionStart = currentPos + 1;
      this.textarea.selectionEnd = currentPos + 1;
      this.textarea.dispatchEvent(new Event('change', { bubbles: true }));
      this.autoResize();
   }*/

customKeyBehaviour(keys, callback) {
  const keysArray = keys.split("+").map(key => key.trim().toLowerCase());

  this.textarea.addEventListener('keydown', (event) => {
    const pressedKeys = keysArray.every(key => {
      switch(key) {
        case 'ctrl': return event.ctrlKey;
        case 'alt': return event.altKey;
        case 'shift': return event.shiftKey;
        default: return event.key?.toLowerCase() === key;
      }
    });

    if (pressedKeys && keysArray.length === (event.ctrlKey + event.altKey + event.shiftKey + (event.key ? 1 : 0))) {
      event.preventDefault();
      callback();
    }
  });
}

   get value() {
      return this.textarea.value;
   }

   set value(value) {
      this.textarea.value = value;
      this.autoResize();
      document.dispatchEvent(new Event("input"));
   }
}

customElements.define("code-area", CodeArea);