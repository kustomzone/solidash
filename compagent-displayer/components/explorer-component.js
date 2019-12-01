import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import { SolidFileHelper } from '../helpers/solid-file-helper.js';

// Extend the LitElement base class
class ExplorerComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      uri: {type: String},
      folder: { type: Object},
      erreur: {type : String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.uri = ""
    this.erreur = ""
    this.folder = {folders: [], files: []}
    this.sfh = new SolidFileHelper()
    //  console.log("SFH",this.sfh)
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "exploreFolder":
          // code block
          app.exploreFolder(message.uri)
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
  }

  render() {

    const folderList = (folder) => html`

    ${folder.folders != undefined ? html`<p>something</p>` : html`<p>not something</p>`}


    folders (${folder.folders.length})<br>
    <ul>
    <li>
    <button @click=${this.clickFolder} uri=${folder.parent} >.. (${folder.parent})</button>
    </li>
    ${folder.folders.map((f) => html`
      <li>
      <button @click=${this.clickFolder} uri=${f.url} >${f.name}</button>
      </li>
      `)}
      </ul>
      `;


      const fileList = (files) => html`
      files (${files.length})<br>
      <ul>
      ${files.map((f) => html`
        <li>
        <button @click=${this.clickFile} uri=${f.url} type=${f.type} >${f.name}</button>
        </li>
        `)}
        </ul>
        `;



        return html`
        <h1>${this.name}</h1>
        <p> exploration de ${this.uri}</p>
        <p>Erreur : ${this.erreur}</p>
        ${folderList(this.folder)}
        ${fileList(this.folder.files)}
        `;
      }

      exploreFolder(uri){
        var app = this
        app.erreur = ""
        this.uri = uri
        console.log(this.uri)
        this.sfh.readFolder(this.uri)
        .then(
          folder => {
            if (folder.url != undefined){
              app.folder = folder
              console.log("FOLDER",app.folder)
            }else{
              app.erreur = folder
            }
          }, err => {
            console.log(err)
          })

        }

        clickFolder(event) {
          var uri = event.target.getAttribute("uri");
          this.exploreFolder(uri)
          var messageMeta = {action:"uriChanged", uri:uri}
          this.agent.send('Acl', messageMeta);
          this.agent.send('Meta', messageMeta);
          this.agent.send('Camera', messageMeta);
        }

        clickFile(event) {
          var uri = event.target.getAttribute("uri");
          var type = event.target.getAttribute("type");
          var file = {uri: uri,type:type}
          var message = {action:"fileUriChanged", file:file}
          this.agent.send('Editor', message);
          var messageMeta = {action:"uriChanged", uri:uri}
          this.agent.send('Acl', messageMeta);
          this.agent.send('Meta', messageMeta);
          if(file.type == "unknown" || this.isFileImage(file)){
            this.agent.send('Image', messageMeta);
          }


        }


        isFileImage(file) {
          return file && file['type'].split('/')[0] === 'image';
        }


      }

      // Register the new element with the browser.
      customElements.define('explorer-component', ExplorerComponent);
