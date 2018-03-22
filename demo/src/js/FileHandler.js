'use strict';

const FileHandler = class FileHandler {
  constructor(window, messageBoard) {
    this.window = window;
    this.messageBoard = messageBoard;
  }

  storeTransformedFileData(data) {
    this.window.localStorage.setItem('transformedFileData', JSON.stringify(data));
    this.messageBoard.announceSuccess('File data processed, storing in local storage');
  }

  postFileData(data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '[REPLACE ME WITH THE CORRECT URL]');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.enctype = 'text/plain';
      xhr.onload = () => {
        this.window.console.log('xhr.status', xhr.status);
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(`XHR failed: "${xhr.statusText}"`));
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(data);
    });
  }

  handleFileData(data) {
    const getResponseToFile = this.postFileData(data);
    getResponseToFile.then((responseData) => {
      this.storeTransformedFileData(responseData);
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
      this.handleFileData(e.currentTarget.result);
    };

    reader.readAsText(file);
  }
};

export { FileHandler as default };
