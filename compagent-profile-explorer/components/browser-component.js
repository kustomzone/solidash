import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

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
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
    this.testUris = ["https://smag0.solid.community/profile/card#me", "https://thewebalyst.solid.community/profile/card",

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
  Tests (${test.length})<br>
  <ul>
  ${test.map((t) => html`
    <li>
    <button @click=${this.clickTest} uri=${t} >${t}</button>
    </li>
    `)}
    </ul>
    `;


    return html`
    <h1>${this.name}</h1>
    Click on one of the following button or type a pod card url above and click 'Browse button' <br>
    <p> ${testList(this.testUris)}  </p>
    <p>
    Card or WebId :
    <input id="uriInput" placeholder="https://mypod.solid.community/profile/card"></input>
    <button @click=${this.uriChanged}>Browse</button>
    </p>



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

  clickTest(event) {
    var uri = event.target.getAttribute("uri");
    this.shadowRoot.getElementById("uriInput").value = uri
  }

}

// Register the new element with the browser.
customElements.define('browser-component', BrowserComponent);
