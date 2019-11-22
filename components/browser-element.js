// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
import  './solid-login.js';

// Extend the LitElement base class
class BrowserElement extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      path: {type: String}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! Browser-Element';
    this.name = "unknown"
    this.path = "nopath"

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
    console.log("UPDATE BROWSER TO ",path)
    this.path = path
  }

  render() {
    return html`
    <p>Name : ${this.name}, <solid-login></solid-login></p>
    <p>Path : ${this.path}</p>
    <p>${this.message}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
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
