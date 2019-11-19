// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';

// Extend the LitElement base class
class PadElement extends LitElement {

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
    this.agent = new HelloAgent(this.name);

  }

  render() {
    return html`
    <p>Name : ${this.name}</p>
    <p>Count: ${this.count}</p>
    <p>${this.message}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    `;
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }

}
// Register the new element with the browser.
customElements.define('pad-element', PadElement);
