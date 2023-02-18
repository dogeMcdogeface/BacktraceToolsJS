class CodeArea extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="container">
        <ol><li></li></ol>
        <textarea></textarea>
      </div>
    `;
    this.textarea = this.querySelector('textarea');
    this.ol = this.querySelector('ol');
    this.autoResize = this.autoResize.bind(this);
  }

  connectedCallback() {
    this.textarea.value = localStorage.getItem('codeAreaContent') || '';
    this.textarea.addEventListener('input', this.autoResize);
    this.autoResize();
    window.addEventListener('beforeunload', () => localStorage.setItem('codeAreaContent', this.textarea.value));
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