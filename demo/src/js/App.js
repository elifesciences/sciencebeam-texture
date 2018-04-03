'use strict';

import FileHandler from './FileHandler';
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

const xmlBaseUrl = '/example-data';

document.querySelectorAll('#example-links .example-link').forEach(link => new ShowExampleLink(
  link, link.href,
  window, messageBoard
));
