class ConsoleArea extends HTMLElement {
   constructor() {
      super();

      this.clear = function () {
         this.innerHTML = "";
      };

      this.write = function (text, color) {
         const line = document.createElement("div");
         line.textContent = text;
         line.style.color = color;
         this.insert(line);
         //this.scrollToBottom();
      };

      this.print = function (...args) {
         const color = typeof args[args.length - 1] === "string" ? args.pop() : "black";
         const strArgs = args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg));
         const message = strArgs.join(" ");
         const div = document.createElement("div");
         div.style.color = color;
         div.textContent = message;
         this.insert(div);
         this.scrollToBottom();
      };

      const bottomer = document.createElement("div");

      this.insert = function (element) {
         this.appendChild(element);
         this.appendChild(bottomer);

         //this.scrollToBottom();
      };

      this.scrollToBottom = function () {
         this.scrollTo(0, this.scrollHeight);
      };



let isAtBottom = true;
this.addEventListener('scroll', () => {
  isAtBottom = this.isInViewport(bottomer);
  //console.log(isAtBottom);
});


const observer = new MutationObserver((mutationsList) => {
  if (mutationsList.some((mutation) => mutation.type === 'childList' && isAtBottom)) {
    this.scrollToBottom();
  }
});
      observer.observe(this, { childList: true, subtree: true });
   }


   isInViewport(element) {
       const rect = element.getBoundingClientRect();
       return (
           rect.top >= 0 &&
           rect.left >= 0 &&
           rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
           rect.right <= (window.innerWidth || document.documentElement.clientWidth)
       );
   }
}

customElements.define("console-area", ConsoleArea);
