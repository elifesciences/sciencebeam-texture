'use strict';

import FileHandler from './FileHandler';
import MessageBoard from './MessageBoard';
import './Editor';

document.querySelector('body').classList.add('js');

const messageBoard = new MessageBoard(document.querySelector('#messageBoard'));
const fileHandler = new FileHandler(window, messageBoard);
document.querySelector('#filePicker').addEventListener('change', (e) => {
  messageBoard.clear();
  fileHandler.handleUpload(e.target.files[0]);
});

