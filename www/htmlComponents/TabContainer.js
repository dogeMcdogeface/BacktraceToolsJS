class TabContainer extends HTMLElement {
   connectedCallback() {
     const btnContainer = document.createElement("div");
     btnContainer.className = "btns";
     btnContainer.style.marginRight = `${getScrollbarWidth(this)}px`;
     const Container = document.createElement("div");
     Container.className = "tabs";


      this.tabs = [...this.children];

      this.tabs.forEach((tab, i) => {
         tab.classList.add("tab");
         Container.appendChild(tab);

         const btn = document.createElement("div");
         btn.innerText = tab.id;
         btn.id = `${tab.id}-btn`;
         btn.classList.add("btn");
         btn.onclick = () => {
            this.setActiveTab(i);
         };
         btnContainer.appendChild(btn);
      });

      this.btns = [...btnContainer.children];

      this.prepend(btnContainer, Container);
      let as = Number(localStorage.getItem("TabContainerValue" + this.id)) || 0;
      //console.log("retreived", as);
      this.setActiveTab(as);
   }

   setActiveTab(index) {
      this.tabs.forEach((tab, i) => {
         tab.classList.toggle("active", i === index);
         this.btns[i].classList.toggle("active", i === index);
      });
      //console.log("storing", index);
      window.addEventListener("beforeunload", () => localStorage.setItem("TabContainerValue" + this.id, index));
   }
}

customElements.define("tab-container", TabContainer);

function getScrollbarWidth(element) {
  // Create an element with a scrollbar to calculate the width
  const scrollElement = document.createElement('div');
  scrollElement.style.overflow = 'scroll';
  scrollElement.style.width = '50px';
  scrollElement.style.height = '50px';
  scrollElement.style.visibility = 'hidden';
  element.appendChild(scrollElement);

  // Calculate the width of the scrollbar
  const scrollbarWidth = scrollElement.offsetWidth - scrollElement.clientWidth;

  // Remove the temporary element
  element.removeChild(scrollElement);

  return scrollbarWidth;
}