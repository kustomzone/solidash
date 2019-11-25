import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class ComponentApp extends LitElement {

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
    console.log(this.agent)
  }

  render() {
    return html`
    <p>${this.name}</p>
    <p>${this.message}</p>
    <p>${this.count}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    `;
  }

  clickHandler(event) {
  this.count++
  //console.log(event.target);
  //console.log(this.agent)
  this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
}

}
// Register the new element with the browser.
customElements.define('component-app', ComponentApp);
