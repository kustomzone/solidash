import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class MetaComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number},
      uri: {type: String}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
    this.uri = ""

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
    <p>${this.count}</p>
    <p> Show .meta of ${this.uri}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    `;
  }

  uriChanged(uri){
    console.log(uri)
    this.uri = uri
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }
}

// Register the new element with the browser.
customElements.define('meta-component', MetaComponent);
