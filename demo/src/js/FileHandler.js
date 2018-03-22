'use strict';

const FileHandler = class FileHandler {
  constructor(window, messageBoard) {
    this.window = window;
    this.messageBoard = messageBoard;
  }

  storeTransformedFileData(data) {
    this.window.localStorage.transformedFileData = JSON.stringify(data);
    this.messageBoard.announceSuccess('File data processed, stored in local storage');
  }

  postFileData(data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '[REPLACE ME WITH THE CORRECT URL]');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.enctype = 'text/plain';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(`XHR failed: "${xhr.status}: ${xhr.statusText}"`));
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(data);
    });
  }

  handleFileData(data, filename) {
    const getResponseToFile = this.postFileData(data);
    getResponseToFile.then((responseData) => {
      this.storeTransformedFileData(responseData);
      this.messageBoard.emitEvent(new CustomEvent('datastored', { detail: filename }));
      this.messageBoard.showIdle();
    }).catch((reason) => {
      this.messageBoard.announceError(`Failed to process file due to a network problem. ${reason}`);
      this.messageBoard.showIdle();
    });
  }

  handleUpload(file) {
    this.messageBoard.showBusy();
    const reader = new FileReader();
    reader.onload = (e) => {
      this.messageBoard.announceSuccess(`Successfully read file "${file.name}"`);
      this.handleFileData(e.currentTarget.result, file.name);
    };

    reader.readAsText(file);
  }
};

export { FileHandler as default };
