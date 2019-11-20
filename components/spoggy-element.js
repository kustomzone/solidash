// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';

// Extend the LitElement base class
class SpoggyElement extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! Spoggy-Element';
    this.name = "unknown"

  }

  firstUpdated(changedProperties) {
    this.agent = new HelloAgent(this.name);

  }

  render() {
    return html`
    <p>Name : ${this.name}</p>
    <p>${this.message}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    `;
  }

  clickHandler(event) {
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', 'Click from SpoggyElement!');
  }

}
// Register the new element with the browser.
customElements.define('spoggy-element', SpoggyElement);
