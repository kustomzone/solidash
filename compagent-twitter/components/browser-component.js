import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import  '../vendor/@lit-element-bootstrap/bs-list-group.bundle.js';

// Extend the LitElement base class
class BrowserComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number},
      testUris :{type: Array}
    };
  }

  constructor() {
    super();
    this.message = "Some example than you can browse or login to explore your pod";
    this.name = "unknown"
    this.count = 0;
    this.testUris = [
      "https://agora.solid.community/profile/card",
      "https://cdr.solid.community/profile/card",
      "https://holacratie.solid.community/profile/card",
      //    "https://smag0.solid.community/profile/card",
      "https://thewebalyst.solid.community/profile/card",
      "https://jeffz.solid.community/profile/card"
    ]

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "updateUriInput":
          app.shadowRoot.getElementById("uriInput").value = message.uri
          app.uriChanged()
          break;
          case "sessionChanged":
          app.updateSession(message.webId)

          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
  }

  render() {

    const testList = (test) => html`
    Pods (${test.length})<br>
    <bs-list-group-action>
    ${test.map((t) => html`
      <bs-list-group-item-action-button @click=${this.clickTest} uri=${t} >${t}</bs-list-group-item-action-button>
      `)}
      </bs-list-group-action>
      `;


      return html`
      <div>
      ${this.message} <br>
      <p> ${testList(this.testUris)}  </p>






      <p>
      Card or WebId :
      <input id="uriInput" placeholder="https://mypod.solid.community/profile/card"  value="${this.testUris[0]}" size="35"></input>
      <button @click=${this.uriChanged}>Browse</button>
      </p>
      </div>
      `;
    }

    updateSession(webId){
      var app = this
      this.webId = webId;

      if(!app.testUris.includes(webId) && webId != null){
        app.testUris = [... app.testUris, webId];
      }
      if (webId != null){
        app.shadowRoot.getElementById("uriInput").value = webId
      }else{
        app.shadowRoot.getElementById("uriInput").value = this.testUris[0]
      }
      app.uriChanged()
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
      //  this.agent.send('Acl', message);
      //  this.agent.send('Meta', message);
    }

    clickTest(event) {
      var uri = event.target.getAttribute("uri");
      this.shadowRoot.getElementById("uriInput").value = uri
      this.uriChanged()
    }

  }

  // Register the new element with the browser.
  customElements.define('browser-component', BrowserComponent);
