'use strict';


const BIORXIV_MODEL_CONVERT_API_URL = '/api_biorxiv/convert';
const OTHER_MODEL_CONVERT_API_URL = '/api/convert';

const DEFAULT_CONVERT_API_URL = BIORXIV_MODEL_CONVERT_API_URL;


const FileHandler = class FileHandler {
  constructor(window, messageBoard) {
    this.window = window;
    this.messageBoard = messageBoard;
    this.convertApiUrl = DEFAULT_CONVERT_API_URL;
  }

  storeTransformedFileData(data) {
    this.window.localStorage.transformedFileData = JSON.stringify(data);
    this.messageBoard.announceSuccess('File data processed, stored in local storage');
  }

  setConvertApiUrl(convertApiUrl) {
    this.convertApiUrl = convertApiUrl;
  }

  postFileData(data, filename) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${this.convertApiUrl}?filename=${encodeURIComponent(filename)}`);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
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
    const getResponseToFile = this.postFileData(data, filename);
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
      this.handleFileData(e.currentTarget.result, file.name);
    };

    reader.readAsArrayBuffer(file);
  }
};

export {
  FileHandler as default,
  FileHandler,
  BIORXIV_MODEL_CONVERT_API_URL,
  OTHER_MODEL_CONVERT_API_URL
};
