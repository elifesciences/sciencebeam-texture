'use strict';

import {
  FileHandler,
  BIORXIV_MODEL_CONVERT_API_URL,
  OTHER_MODEL_CONVERT_API_URL
} from './FileHandler';
import MessageBoard from './MessageBoard';
import ShowExampleLink from './ShowExampleLink';
import './Editor';

document.querySelector('body').classList.add('js');

const messageBoard = new MessageBoard(document.querySelector('#messageBoard'), window);
const fileHandler = new FileHandler(window, messageBoard);
document.querySelector('#filePicker').addEventListener('change', (e) => {
  messageBoard.clear();
  fileHandler.handleUpload(e.target.files[0]);
});

document.getElementById('type-of-model').onclick = function(event) {
  if (!event.target.checked) {
    fileHandler.setConvertApiUrl(BIORXIV_MODEL_CONVERT_API_URL);
  } else {
    fileHandler.setConvertApiUrl(OTHER_MODEL_CONVERT_API_URL);
  }
  document.querySelector('#filePicker').value = null;
  messageBoard.clear();
}

const xmlBaseUrl = '/example-data';

document.querySelectorAll('#example-links .example-link').forEach(link => new ShowExampleLink(
  link, link.href,
  window, messageBoard
));
