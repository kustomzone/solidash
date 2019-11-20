// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class MessagesElement extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      messages: {type: Array}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.messages =  []

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    this.agent.receive = function(from, message) {
      console.log(message)
      app.messages = [... app.messages, {message: message, from: from}]
      console.log("messages",app.messages)
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        console.log(this.id+" receive webId "+app.webId)
      }
    };
  }

  render() {
    return html`
    <p>Name : ${this.name}</p>
    <pre class="pre-scrollable">
    <ul id="messageslist">
    ${this.messages.map((m) => html`<li><b>Agent ${m.from}</b> says "${m.message}"</li>`)}
    </ul>
    </pre>
    <!--  <p>${this.message}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>-->
    `;
  }

  clickHandler(event) {
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('agent1', 'Hello agent1!');
  }

}
// Register the new element with the browser.
customElements.define('messages-element', MessagesElement);
