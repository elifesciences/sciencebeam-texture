'use strict';

const FileHandler = class FileHandler {
  constructor(window, messageBoard) {
    this.window = window;
    this.messageBoard = messageBoard;
  }

  storeTransformedFileData(data) {
    this.window.localStorage.setItem('transformedFileData', data);
    this.messageBoard.showIdle();
  }

  handleFileData(data) {
    const getResponseToFile = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '[REPLACE ME WITH THE CORRECT URL]');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.enctype = 'text/plain';
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(data);
    });

    getResponseToFile.then((responseData) => {
      this.messageBoard.update('File data processed, storing in local storage');
      this.storeTransformedFileData(responseData);
    }).catch((reason) => {
      this.messageBoard.update(`Failed to process file due to a network problem. ${reason}`);
      this.messageBoard.showIdle();
    });
  }

  handleUpload(file) {
    this.messageBoard.showBusy();
    const reader = new FileReader();
    reader.onload = (e) => {
      this.messageBoard.update(`Read file ${file.name}`);
      this.handleFileData(e.currentTarget.result);
    };

    reader.readAsText(file);
  }
};

export { FileHandler as default };
