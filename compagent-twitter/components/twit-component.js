import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import "./camera-component.js"
import "./editor-component.js"
import  '../vendor/@lit-element-bootstrap/bs-modal.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';

// Extend the LitElement base class
class TwitComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      uri: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.uri = "rien"
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
    <bs-button primary id="modalLauncher" @click=${this.modalOpen}>New Twit</bs-button primary>

    <bs-modal id="myModal"  animated dismissable>
    <bs-modal-header slot="header">
    <h5>Twit</h5>
    </bs-modal-header>
    <bs-modal-body slot="body" style="height: 30vw; overflow-y: scroll;">
    <editor-component name="EditorTwit" uri=${this.uri}></editor-component>
    <camera-component name="Camera" uri=${this.uri}></camera-component>
    </bs-modal-body>
    <bs-modal-footer slot="footer">
    <bs-button secondary id="closeModal" @click=${this.modalClose} data-dismiss="modal">Close</bs-button>
    <!--<bs-button primary id="saveChanges">Save changes</bs-button>-->
    </bs-modal-footer>
    </bs-modal>

    `;
  }



  modalOpen(event) {
    this.shadowRoot.getElementById('myModal').open();
  }
  modalClose(event) {
    this.shadowRoot.getElementById('myModal').close();
  }
}

// Register the new element with the browser.
customElements.define('twit-component', TwitComponent);
