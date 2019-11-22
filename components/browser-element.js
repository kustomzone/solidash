// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
import  './solid-login.js';
import  { SolidTool } from '../js/helpers/solid-tool.js';

// Extend the LitElement base class
class BrowserElement extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      path: {type: String},
      folder: {type: Object}
    };
  }

  constructor() {
    super();
    this.st = new SolidTool();
    this.message = 'Hello world! Browser-Element';
    this.name = "unknown";
    this.path = "nopath";
    this.folder = {folders:[], files:[]};

  }

  firstUpdated(changedProperties) {
    var app = this
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      console.log(this.id+" RECEIVE "+JSON.stringify(message))
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        //var cont = app.shadowRoot.getElementById("browsernetwork")

        console.log(this.id+" receive webId "+app.webId)
        if (app.webId != null){
          //  app.getUserData()
          app.logged = true
          //  app.getUserData(app.webId)
          //  app.dataToVis(cont,app.webId)
        }else{
          app.logged = false
          //    app.friends = [];
          //  app.username = "";
          //  app.notes = []
        }
      }else   if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "browse":
          // code block
          app.browse(message.path)
          break;

          default:
          // code block
          console.log("action inconnue")
        }
      }
    };

  }

  browse(path){
    var app = this
    console.log("UPDATE BROWSER TO ",path)
    this.path = path;
    this.st.readFolder(path).then(folder =>{
      console.log(folder)
      app.folder = folder;
      app.agent.send('Spoggy', {action:"updateFromFolder", folder:folder});
      //app.updateBrowser(app.folder)
    },err =>{alert(err)})

  }

  clickInBrowser(e){
    console.log(e)
    console.log(e.target)
    var path = e.target.getAttribute("path")
    var type = e.target.getAttribute("type")
    console.log(path)
    if (type == "folder"){
      this.browse(path)
    }else{
      this.agent.send('Editor', {action:"updateFromPath", path:path, type:type});

    }

  }

  /*
  updateBrowser(data){
  console.log("UPDATE WITH ", data)
}*/

render() {

  const folderList = (folders) => html`
  Folders List(${folders.length})<br>
  <ul>
  ${folders.map((f) => html`
    <li>
    <button @click="${this.clickInBrowser}" path=${f.url} type="${f.type}">${f.name}</button>
    </li>
    `)}
    </ul>
    `;

    const fileList = (files) => html`
    Files List(${files.length})<br>
    <ul>
    ${files.map((f) => html`
      <li>
      <button @click="${this.clickInBrowser}" path=${f.url} type="${f.type}">${f.name}, ${f.label} </button> ${f.type}
      </li>
      `)}
      </ul>
      `;

      return html`

      <fieldset>
      <legend>
      ${this.name}, <solid-login></solid-login></legend>
      <p>Path :<br> ${this.path}</p>

      <div>

      <p> Parent : <button @click="${this.clickInBrowser}" type="folder" path=${this.folder.parent}>${this.folder.parent}</button></p>
      <p> Current :<br>
      ${this.folder.name}, ${this.folder.url}</p>
      <p>
      ${folderList(this.folder.folders)}
      </p>
      <p>
      ${fileList(this.folder.files)}
      </p>


      </div>

      </fieldset>


      `;
    }



    clickHandler(event) {
      //console.log(event.target);
      console.log(this.agent)
      this.agent.send('Messages', 'Click from BrowserElement!');
    }

  }
  // Register the new element with the browser.
  customElements.define('browser-element', BrowserElement);
