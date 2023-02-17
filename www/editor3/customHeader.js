class CustomHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {

      const buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('custom-header-buttons');

      // Create the buttons and their dropdown menus
      const buttonNames = [
        {
          name: "File",
          subMenus: ["New", "Open", "Save", "Save As"],
        },
        {
          name: "Edit",
          subMenus: ["Cut", "Copy", "Paste"],
        },
        {
          name: "View",
          subMenus: ["Zoom In", "Zoom Out", "Full Screen"],
        },
      ];

      buttonNames.forEach((buttonData) => {
        const button = document.createElement('button');
        button.textContent = buttonData.name;
        buttonsContainer.appendChild(button);

        const subMenu = document.createElement('div');
        subMenu.classList.add('custom-header-submenu');

        buttonData.subMenus.forEach((subMenuName) => {
          const subMenuButton = document.createElement('button');
          subMenuButton.textContent = subMenuName;
          subMenu.appendChild(subMenuButton);
        });

        button.addEventListener('focusin', () => {
          subMenu.classList.toggle('show', true);
        });
        button.addEventListener('focusout', () => {
          subMenu.classList.toggle('show', false);
        });

        buttonsContainer.appendChild(subMenu);
      });

    const textContainer = document.createElement('div');
    textContainer.textContent = this.textContent;
    textContainer.classList.add('custom-header-text');

    this.innerHTML = '';
    this.appendChild(buttonsContainer);
    this.appendChild(textContainer);
  }
}

customElements.define('custom-header', CustomHeader);
