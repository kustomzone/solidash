// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';

// Extend the LitElement base class
class MyCard extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      source: {type: String},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From my-element';
    this.name = "unknown"
    this.source = "unknown"

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        console.log(this.id+"receive webId "+app.webId)
      }
    };

  }

  render() {
    return html`
    <!-- Custom fonts for this template-->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.min.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">

    <!--<div class="col-xl-4 col-lg-5">-->
    <div class="card shadow mb-4">
    <!-- Card Header - Dropdown -->
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
    <h6 class="m-0 font-weight-bold text-primary">Name : ${this.name}</h6>
    <div class="dropdown no-arrow">
    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
    </a>
    <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
    <div class="dropdown-header">Dropdown Header:</div>
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#">Something else here</a>
    </div>
    </div>
    </div>
    <!-- Card Body -->
    <div class="card-body">
    <p>Name : ${this.name}</p>
    <p>WebId : ${this.webId}</p>
    <p>${this.message} à ${this.source}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    </div>
    </div>
    <!--  </div>-->




    `;
  }

  clickHandler(event) {
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('agent1', 'Hello agent1!');
  }

}
// Register the new element with the browser.
customElements.define('my-card', MyCard);
