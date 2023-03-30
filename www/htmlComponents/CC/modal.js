class Modal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // create the modal element
        const modal = this;
        modal.hide();
        const content = modal.innerHTML;

        modal.innerHTML = "";
        modal.classList.add("modal");


        // create the modal content element
        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");


        // create the modal header element
        const modalHeader = document.createElement("span");
        modalHeader.classList.add("modal-header");
        const closeSpan = document.createElement("button");
        closeSpan.classList.add("close");
        closeSpan.innerHTML = "&times;";
        modalHeader.appendChild(closeSpan);
        modalContent.appendChild(modalHeader);



        // create the modal body element
         modal.body = document.createElement("div");
         modal.body.classList.add("modal-body");
         modal.body.innerHTML = content;
         modalContent.appendChild(modal.body);


        // create the modal footer element
         modal.footer = document.createElement("div");
         modal.footer.classList.add("modal-footer");
         modalContent.appendChild(modal.footer);




        // add the modal content to the modal element
        modal.appendChild(modalContent);

        closeSpan.onclick = function () {
           modal.hide();
        };
        window.onclick = function (event) {
            if (event.target == modal) {
           modal.hide();
            }
        };
    }

      hide() {
      this.classList.add("hide");
      }

      show() {
        this.classList.remove("hide");
        this.style.display = "block";
      }
}




// Register the custom element
customElements.define("custom-modal", Modal);
