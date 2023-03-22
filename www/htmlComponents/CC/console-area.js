class ConsoleArea extends HTMLElement {
   constructor() {
      super();

      this.clear = function () {
         //this.innerHTML = "";
         this.selectElement(null);
         while (this.firstChild) this.removeChild(this.firstChild);
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
      bottomer.classList.add("bottomer");

      this.insert = function (element) {
         this.appendChild(element);
         this.appendChild(bottomer);
      };

      let isAtBottom = true;
      this.addEventListener("scroll", () => {
         isAtBottom = !(this.scrollHeight > this.clientHeight) || this.isInViewport(bottomer);
         if (this.scrollHeight > this.clientHeight && isAtBottom) {
            bottomer.classList.add("expand");
         } else {
            bottomer.classList.remove("expand");
         }
         //console.log(isAtBottom);
      });

      this.scrollToBottom = function () {
         this.scrollTo(0, this.scrollHeight);
      };

      const observer = new MutationObserver((mutationsList) => {
         if (mutationsList.some((mutation) => mutation.type === "childList" && isAtBottom)) {
            this.scrollToBottom();
         }
      });
      observer.observe(this, { childList: true, subtree: true });

      this.lastSelected;
      this.addEventListener("click", function (event) {
         if (event.button !== 0) return; // Check if it is a left click
         let target = event.target.closest(".selectable");
         this.selectElement(target);
      });
   }

   selectElement(target) {
      if (target === null || (target?.classList.contains("selectable") && target !== this.lastSelected)) {
         this.lastSelected && (this.lastSelected.selected = false);
         target && (target.selected = true);
         this.lastSelected = target;
         setTimeout(() => this.onSelected(target), 0);
      }
   }

   onSelected(target) {}

   isInViewport(element) {
      const parentRect = element.parentNode.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Check if the element is vertically visible within its parent
      const isVerticallyVisible = elementRect.top >= parentRect.top && elementRect.bottom <= parentRect.bottom;

      // Check if the element is horizontally visible within its parent
      const isHorizontallyVisible = elementRect.left >= parentRect.left && elementRect.right <= parentRect.right;

      // Return true if the element is both vertically and horizontally visible within its parent
      return isVerticallyVisible && isHorizontallyVisible;
   }
}

customElements.define("console-area", ConsoleArea);
