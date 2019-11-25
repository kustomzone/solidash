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
      folder: { type: Object}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.uri = ""
    this.folder = {folders: [], files: []}
    this.sfh = new SolidFileHelper()
    console.log("SFH",this.sfh)
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

    const folderList = (folders) => html`
    folders (${folders.length})<br>
    <ul>
    ${folders.map((f) => html`
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
        <button @click=${this.clickFile} uri=${f} >${f.name}</button>
        </li>
        `)}
        </ul>
        `;



        return html`
        <h1>${this.name}</h1>
        <p> exploration de ${this.uri}</p>
        ${folderList(this.folder.folders)}
        ${fileList(this.folder.files)}
        `;
      }

      exploreFolder(uri){
        var app = this
        this.uri = uri
        console.log(this.uri)
        this.sfh.readFolder(this.uri)
        .then(
          folder => {
            app.folder = folder
            console.log("FOLDER",this.folder)
          }, err => {
            console.log(err)
          })

        }

        clickFolder(event) {
          var uri = event.target.getAttribute("uri");
          this.exploreFolder(uri)

        }


      }

      // Register the new element with the browser.
      customElements.define('explorer-component', ExplorerComponent);
