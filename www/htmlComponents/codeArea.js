class CodeArea extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="container">
        <ol><li></li></ol>
        <textarea placeholder="${this.innerText}"></textarea>
      </div>
    `;
    this.textarea = this.querySelector('textarea');
    this.ol = this.querySelector('ol');
    this.autoResize = this.autoResize.bind(this);

    let sideTextValue = getComputedStyle(this).getPropertyValue('--side-text-value');
    sideTextValue = sideTextValue.replace(/[^"]*"([^"]*)"[^"]*/g, '$1').trim();
    this.ol.style.maxWidth = `${4 + sideTextValue.length}ch`;
  }

  connectedCallback() {
    this.textarea.value = localStorage.getItem('codeAreaContent'+this.className) || '';
    this.textarea.addEventListener('input', this.autoResize);
    window.addEventListener('resize', this.autoResize);
    this.autoResize();

    window.addEventListener('beforeunload', () => localStorage.setItem('codeAreaContent'+this.className, this.textarea.value));
  }

  autoResize() {
    const lines = this.textarea.value.split('\n').length;
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    this.ol.innerHTML = `<li></li>`.repeat(lines);
  }

    get value() {
      return this.textarea.value;
    }

    set value(value) {
      this.textarea.value = value;
      this.autoResize();
    }
}

customElements.define('code-area', CodeArea);
