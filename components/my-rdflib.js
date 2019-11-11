// Import the LitElement base class and html helper function
//https://github.com/inrupt/solid-lib-comparison
//https://github.com/inrupt/solid-lib-comparison/blob/rdflib/src/services/getFriendList.ts
//https://github.com/linkeddata/rdflib.js/
//https://linkeddata.github.io/rdflib.js/Documentation/webapp-intro.html


import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import  '../libs/rdflib.min.js';
import { HelloAgent } from '../js/agents/HelloAgent.js';

// Extend the LitElement base class
class MyRdflib extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      source: {type: String},
      webId: {type: String},
      username: {type: String},
      friends: {type: Number},
      names: {type: Array}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From my-element';
    this.name = "unknown"
    this.source = "unknown"
    this.username = "unknown"
    this.friends = 0
    this.names = []
    this.store  = $rdf.graph();
    this.fetcher = new $rdf.Fetcher(this.store, {});
    console.log("RDFLIB STORE",this.store)
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        console.log(this.id+"receive webId "+app.webId)
        if (app.webId != null){
          app.testlib(app.webId)


        }

      }
    };

  }

  testWithRuben(){
    this.webId = "https://ruben.verborgh.org/profile/#me"
    this.testlib(this.webId)
  }
  async testlib(webId){
    const person = this.store.sym(webId);
    console.log("RDFLIB person",person)
    const profile = person.doc();       //i.e. store.sym(''https://example.com/alice/card#me')
    console.log("RDFLIB Profile",profile)
    const VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    const FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
    //
    await this.fetcher.load(webId);
    this.friends = this.store.each(person, FOAF('knows'), null, person.doc())
    console.log(this.friends)


    await Promise.all(this.friends.map(((friendWebId) => this.fetcher.load(friendWebId.value))));
    this.names = this.friends.map((friend) => this.store.any(friend, FOAF('name'), null, friend.doc()));
    console.log("RDFLIB names",this.names)


    let name = this.store.any(person, VCARD('fn'));
    console.log(name)




    if (name) {
      this.username =  name.value; // name is a Literal object
    }

    let pic = this.store.any(person, VCARD('hasPhoto'));
    console.log(pic)
    if (pic) {
      this.shadowRoot.getElementById('picture').setAttribute('src', pic.uri); // pic is a NamedNode
      this.shadowRoot.getElementById('picture').setAttribute('alt', pic.uri);
      console.log(pic)
    }



    /*const friendWebIds = this.store.each(person, new $rdf.NamedNode(FOAF.knows), null, person.doc());
    console.log("RDFLIB friends webids",friendWebIds)*/
    /*await Promise.all(friendWebIds.map(((friendWebId) => this.fetcher.load(friendWebId.value))));
    const names = friendWebIds.map((friend) => this.store.any(friend, new NamedNode(FOAF.name), null, (friend as NamedNode).doc()));
    console.log("RDFLIB names",names)*/

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
    <p>WebId : <a href="${this.webId}" target="_blank">${this.webId}</a></p>
    <p> Username : ${this.username}</p>

    <p>
    <!--
    <img id="picture" style = 'max-width: 3em; min-width: 3em; border-radius: 0.6em;'
    src = '@@default person image from github.io'>-->
    </p>
    <p> Friends : ${this.friends.length}</p>

    <pre class="pre-scrollable">
      <ul id="messageslist">
    ${this.names.map((item) => html`<li>${item}</li>`)}
      </ul>
    </pre>

    <p>${this.message} à ${this.source}</p>

    <button @click=${this.testWithRuben}>Test with Ruben</button>
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
customElements.define('my-rdflib', MyRdflib);
