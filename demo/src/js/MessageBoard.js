'use strict';

const MessageBoard = class MessageBoard {
  constructor($elm) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
  }

  showBusy() {
    this.$elm.classList.add('busy');
  }

  showIdle() {
    this.$elm.classList.remove('busy');
  }

  updateWithError(message) {
    this.update(message, 'message--error');
  }

  updateWithSuccess(message) {
    this.update(message, 'message--success');
  }

  update(message, cssClass = '') {
    this.$elm.innerHTML += `<div class="message ${cssClass}">${message}</div>`;
  }
};

export { MessageBoard as default };
