import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import { SolidFileHelper } from '../helpers/solid-file-helper.js';
import { TripledocHelper } from '../helpers/tripledoc-helper.js';

import "./visualization-component.js"
import "./twit-component.js"

// Extend the LitElement base class
class ExplorerComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      uri: {type: String},

      folder: { type: Object},
      file: {type: Object},
      erreur: {type : String},
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.uri = ""
    this.erreur = ""
    this.folder = {folders: [], files: []}
    this.file = {uri:"",type:""}
    this.sfh = new SolidFileHelper()
    this.th = new TripledocHelper()
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

    <!--  ${folder.folders != undefined ? html`<p>something</p>` : html`<p>not something</p>`}-->


    Folders (${folder.folders.length}) <input id="newFolderInput" placeholder="newFolderName" ></input> <button @click=${this.newFolder}>New Folder</button><br>
    <ul>
    <li>
    <button @click=${this.clickFolder} uri=${folder.parent} >.. (${folder.parent})</button>
    </li>
    ${folder.folders.map((f) => html`
      <li>
      <button @click=${this.clickFolder} uri=${f.url} >${f.name}</button>
        <!--<button @click=${this.clickAcl} uri=${f.url} >acl</button> -->
      </li>
      `)}
      </ul>
      `;


      const fileList = (files) => html`
      Files (${files.length})
       <twit-component name="Twit" uri=${this.uri}></twit-component>
       <!--<input id="newFileInput" placeholder="newfilename.ttl"></input>
       <button @click=${this.newFile} disabled>New File</button>--><br>
      <ul>
      ${files.map((f) => html`
        <li>

        ${this.isFileImage(f) ?
          html`<img src=${f.url} style='border:5px solid lightgray' width='50' height='50' @click=${this.clickFile} uri=${f.url} type=${f.type}>`
          : html`<button @click=${this.clickFile} uri=${f.url} type=${f.type} >${f.name}</button>`
        }
       <!--<button @click=${this.clickAcl} uri=${f.url} >acl</button>-->



        </li>
        `)}
        </ul>
        `;



        return html`
        <h1>${this.name}</h1>





        <p> Current Folder <a href="${this.uri}" target="_blank">${this.uri}</a></p>
        <!--<p>Erreur : ${this.erreur}</p>-->
        <table>
        <tr>
        <td>
        ${folderList(this.folder)}
        ${fileList(this.folder.files)}
        </td>
        <td>
        <visualization-component name="Visualization"></visualization-component>
        </td>
        </tr>
        </table>
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
              var messageMeta = {action:"uriChanged", uri:uri}
              app.agent.send('Acl', messageMeta);
              app.agent.send('Meta', messageMeta);
              app.agent.send('EditorTwit', messageMeta);
              app.agent.send('Camera', messageMeta);
              //  console.log("FOLDER",app.folder)
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



        }

        clickFile(event) {
          var uri = event.target.getAttribute("uri");
          var type = event.target.getAttribute("type");
          this.file = {uri: uri,type:type}
          var message = {action:"fileChanged", file: this.file}
          this.agent.send('Visualization', message);
          //  this.agent.send('Image', message);
          /*var messageMeta = {action:"uriChanged", uri:uri}
          this.agent.send('Acl', messageMeta);
          this.agent.send('Meta', messageMeta);
          if(this.file.type == "unknown" || this.isFileImage(this.file)){
          this.agent.send('Image', messageMeta);
        }*/
      }

      newFolder(){
        var folderName = this.shadowRoot.getElementById("newFolderInput").value.trim()
        if (folderName.length >0){
          var uri = this.uri+folderName+"/"
          console.log(uri)
          this.sfh.createFolder(uri)
          .then(
            folder => {
              console.log("RESULT",folder)
              this.exploreFolder(uri)
            }, err => {
              console.log(err)
              alert("ERR2",err)
            })
          }else{
            alert ("You must define a foldername")
          }
        }

        isFileImage(file) {
          return file && file['type'].split('/')[0] === 'image';
        }

        clickAcl(event){
          var uri = event.target.getAttribute("uri");
          console.log(uri)
          this.th.getAcl(uri)
        }

      }

      // Register the new element with the browser.
      customElements.define('explorer-component', ExplorerComponent);
