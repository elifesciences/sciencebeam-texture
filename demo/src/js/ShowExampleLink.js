const rejectIfNotOk = response => {
  if (!response.ok) {
    return Promise.reject(`request failed with status ${response.status}`);
  }
  return response;
};

const extractXmlData = response => response.text();

const downloadXml = xmlUrl => fetch(xmlUrl).then(rejectIfNotOk).then(extractXmlData);

export class ShowExampleLink {
  constructor(linkElement, xmlUrl, window, messageBoard) {
    this.window = window;
    this.messageBoard = messageBoard;
    this.xmlUrl = xmlUrl;
    linkElement.addEventListener('click', event => {
      event.stopPropagation();
      event.preventDefault();
      this.showExampleForUrl(xmlUrl);
    });
  }

  showExampleForUrl(xmlUrl) {
    console.log('showing example', xmlUrl);
    downloadXml(xmlUrl).then(xml => this.showExampleForXml(xml));
  }
  
  showExampleForXml(xml) {
    console.log('downloaded xml:', xml.length);
    this.window.localStorage.transformedFileData = JSON.stringify(xml);
    this.messageBoard.emitEvent(new CustomEvent('datastored', { detail: this.xmlUrl }));
  }
}

export default ShowExampleLink;
