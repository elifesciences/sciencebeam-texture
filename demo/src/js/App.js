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
  const biorxivModel = document.querySelector('[aria-label="biorxiv"]');
  const otherModel = document.querySelector('[aria-label="other"]');
  if (!event.target.checked) {
    biorxivModel.classList.add('selected-model');
    otherModel.classList.remove('selected-model');
    fileHandler.setConvertApiUrl(BIORXIV_MODEL_CONVERT_API_URL);
  } else {
    biorxivModel.classList.remove('selected-model');
    otherModel.classList.add('selected-model');
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
