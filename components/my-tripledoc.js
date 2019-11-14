// Import the LitElement base class and html helper function
//https://github.com/inrupt/solid-lib-comparison
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
import { showFileInConsole } from '../js/helpers/debug.js';
/*
import 'https://unpkg.com/rdflib/dist/rdflib.min.js';
import 'https://unpkg.com/tripledoc@2.4/umd/index.js*/


// Extend the LitElement base class
class MyTripledoc extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      source: {type: String},
      webId: {type: String},
      username: {type: String},
      friends: {type: Array}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From my-element';
    this.name = "unknown"
    this.source = "unknown"
    this.username = "unknown"
    this.friends = []
    this.VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    this.FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
    this.SOLID = new $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
    this.SCHEMA = new $rdf.Namespace('http://schema.org/');
    this.SPACE = new $rdf.Namespace('http://www.w3.org/ns/pim/space#');
    this.RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        console.log(this.id+"receive webId "+app.webId)
        if (app.webId != null){
          app.getUserData()
          app.initNotePod()
        }
      }
    };
  }


  getUserData(){
    var app = this;
    showFileInConsole(app.webId)
    //showFileInConsole('https://vincentt.inrupt.net/profile/card')
    Tripledoc.fetchDocument(app.webId).then(
      doc => {
        //    console.log("DOC",doc)
        //    console.log(doc.getStatements())
        const person = doc.getSubject(app.webId);
            console.log("personne",person)
        app.username = person.getString(app.FOAF('name'))
        app.friends = person.getAllRefs(app.FOAF('knows'))
        console.log("Friends",app.friends)

      }
    );
  }

  initNotePod(){

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
    <p>UserName : ${this.username}</p>
    <p>WebId : ${this.webId}</p>
    <p> Friends : ${this.friends.length}</p>

    <pre class="pre-scrollable">
    <ul id="messageslist">
    ${this.friends.map((f) => html`<li>${f}</li>`)}
    </ul>
    </pre>



    <p>${this.message} à ${this.source}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    </div>
    <small>https://forum.solidproject.org/t/notepod-a-note-taking-app-for-solid/2371</small><br>
    <small>https://github.com/jeff-zucker/solid-file-client</small><br>
    <small>https://solidproject.org/for-developers/apps/first-app/2-understanding-solid</small>
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
customElements.define('my-tripledoc', MyTripledoc);
