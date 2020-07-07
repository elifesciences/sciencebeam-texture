import {
  Component, DefaultDOMElement, parseKeyEvent,
  InMemoryDarBuffer, substanceGlobals,
  platform
} from 'substance'
import {
  Texture, JATSImportDialog, TextureArchive
} from 'substance-texture'

/* Sample integration of Texture */
class ScienceBeamTextureEditor extends Component {

  didMount() {
    this._init()
    DefaultDOMElement.getBrowserWindow().on('keydown', this._keyDown, this)
    DefaultDOMElement.getBrowserWindow().on('drop', this._supressDnD, this)
    DefaultDOMElement.getBrowserWindow().on('dragover', this._supressDnD, this)
  }

  dispose() {
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  getInitialState() {
    return {
      archive: undefined,
      error: undefined
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-app')
    let archive = this.state.archive
    let err = this.state.error
    console.log('render, filename:', this.props.filename);
    console.log('render, archive:', archive);

    if (archive) {
      el.append(
        $$(Texture, {archive})
      )
    } else if (err) {
      if (err.type === 'jats-import-error') {
        el.append(
          $$(JATSImportDialog, { errors: err.detail })
        )
      } else {
        el.append(
          'ERROR:',
          err.message
        )
      }
    } else {
      // LOADING...
    }
    return el
  }

  localStorageClient() {

    return {

      read: () => {

        return {

          resources: {

            'manifest.xml': {
              encoding: 'utf8',
              data: '<dar><documents>'
                    + '<document id="manuscript" type="article" path="manuscript.xml" />'
                    + '</documents><assets></assets></dar>'
            },

            'manuscript.xml': {
              encoding: 'utf8',
              data: JSON.parse(window.localStorage.transformedFileData)
            }
          }
        }
      }
    };
  }

  reloadArchive() {
    let storage = this.localStorageClient();

    let buffer = new InMemoryDarBuffer();
    let archive = new TextureArchive(storage, buffer);

    let promise = archive.load('dummy')
                         .then(() => {
                           setTimeout(() => {
                             console.log('archive loaded:', archive);
                             this.setState({archive})
                           }, 0)
                         });

    if (!platform.devtools) {
      promise.catch(error => {
        console.error(error);
        this.setState({error});
      })
    }
  }

  _init() {
    this.reloadArchive();
  }

  /*
    We may want an explicit save button, that can be configured on app level,
    but passed down to editor toolbars.
  */
  _save() {
    this.state.archive.save().then(() => {
      console.info('successfully saved')
    }).catch(err => {
      console.error(err)
    })
  }

  _keyDown(event) {
    if ( event.key === 'Dead' ) return
    // Handle custom keyboard shortcuts globally
    let archive = this.state.archive
    if (archive) {
      let manuscriptSession = archive.getEditorSession('manuscript')
      let handled = manuscriptSession.keyboardManager.onKeydown(event)
      if (!handled) {
        let key = parseKeyEvent(event)
        // CommandOrControl+S
        if (key === 'META+83' || key === 'CTRL+83') {
          this._save()
          event.preventDefault()
        }
      }
    }
  }

  /*
    Prevent app and browser from loading a dnd file
  */
  _supressDnD(event) {
    event.preventDefault()
  }
}

let editor;

const scrollEditorIntoView = () => {
  document.querySelector('.sc-app').scrollIntoView();
};

const showEditor = filename => {
  if (!editor) {
    editor = ScienceBeamTextureEditor.mount({filename}, window.document.body);
    window.setTimeout(() => {
      document.querySelector('.grid--section').appendChild(document.querySelector('.sc-app'));
      scrollEditorIntoView();
    }, 200);
  } else {
    editor.setProps({filename});
    editor.reloadArchive();
    scrollEditorIntoView();
  }
};

window.addEventListener('datastored', event => {
  substanceGlobals.DEBUG_RENDERING = platform.devtools;
  const filename = event.detail;
  showEditor(filename);
});
