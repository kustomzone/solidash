// voir https://developers.google.com/web/fundamentals/media/capturing-images

import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
import { SolidFileHelper } from '../helpers/solid-file-helper.js';

// Extend the LitElement base class
class CameraComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      uri: {type: String},
      res: {type: String}
    };
  }

  constructor() {
    super();
    this.message = 'Use your camera or your browser to post picture to Pod';
    this.name = "unknown"
    this.uri = "";
    this.sfh = new SolidFileHelper()
    this.res = ""

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "uriChanged":
          // code block
          app.uriChanged(message.uri)
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
  }

  render() {
    return html`
    <h1>${this.name}</h1>
    <p>${this.message}</p>
    <p>Current folder ${this.uri} (if none, use the browser)</p>
    <input id="myFileInput" @change=${this.sendPic} type="file" accept="image/*;capture=camera">
    <br>${this.res}
    `;
  }

  uriChanged(uri){
    console.log(uri)
    this.uri = uri
  }

  sendPic(event) {
    var app = this
    var file = this.shadowRoot.getElementById("myFileInput").files[0];
    console.log("todo : send ", file)
    var path = this.uri+file.name;
    var content = file
    console.log(path)
    this.sfh.updateFile(path, content, file.type).then( res=> {
      console.log(res);
      app.res = res
    }, err=>{console.log("upload error : "+err)});
  }
}

// Register the new element with the browser.
customElements.define('camera-component', CameraComponent);
