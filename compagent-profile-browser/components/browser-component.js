import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class BrowserComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "doSomething":
          // code block
          app.doSomething(message.params)
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
    <p>${this.name}</p>
    <p>${this.message}</p>
    <p>${this.count}</p>
    <p>
    Card or WebId :
    <input id="uriInput" placeholder="https://mypod.solid.community/profile/card"></input>
    <button @click=${this.uriChanged}>Browse</button>
    </p>
    <p>
    some uri for tests </br>
    https://thewebalyst.solid.community/profile/card<br>
    https://smag0.solid.community/profile/card</br>
    </p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    `;
  }

  doSomething(params){
    console.log(params)
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }

  uriChanged(){
    var uri = this.shadowRoot.getElementById("uriInput").value.trim();
    var message = {action:"uriChanged", uri:uri}
    this.agent.send('TripledocProfile', message);
  }


}

// Register the new element with the browser.
customElements.define('browser-component', BrowserComponent);
