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

  update(message) {
    this.$elm.innerHTML += `<br />${message}`;
  }
};

export { MessageBoard as default };
