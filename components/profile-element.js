// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
import  './solid-login.js';

// Extend the LitElement base class
class ProfileElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      friends: {type: Array},
      username: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.webId = null;
    this.username = "";
    this.friends = [];
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
      console.log(this.id+" RECEIVE "+JSON.stringify(message))
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        var cont = app.shadowRoot.getElementById("browsernetwork")

        console.log(this.id+" receive webId "+app.webId)
        if (app.webId != null){
          //  app.getUserData()
          app.logged = true
          app.getUserData(app.webId)
          //  app.dataToVis(cont,app.webId)
        }else{
          app.logged = false
          app.friends = [];
          app.username = "";
          //  app.notes = []
        }
      }else   if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "test":
          // code block
          app.test(message.params)
          break;

          default:
          // code block
          console.log("action inconnue")
        }
      }
    };

  }


  getUserData(){
    var app = this;
    console.log(app.webId)
    //showFileInConsole('https://vincentt.inrupt.net/profile/card')
    Tripledoc.fetchDocument(app.webId).then(
      doc => {
        console.log("DOC",doc)
        console.log(doc.getStatements())
        app.doc = doc;
        /*  var data = statements2vis(doc.getStatements())
        app.spoggy.updateGraph(data);*/

        app.person = doc.getSubject(app.webId);

        console.log("personne",app.person)
        /*  var data = statements2vis(app.person.getStatements())
        var message = {}
        message.data = data
        app.browser.updateGraph(message);*/

        app.username = app.person.getString(app.FOAF('name'))
        app.friends = app.person.getAllRefs(app.FOAF('knows'))
        console.log("Friends",app.friends)
        //app.getTypeIndex()
        app.getStorage()

      },
      err => {
        console.log(err)
      }
    );
  }

  getStorage(){
    var app  = this;
    const storage = this.person.getRef(this.SPACE('storage'))
    console.log("storage",storage)
    app.publicStorage = storage + 'public/'
    //  app.privateStorage = storage + 'private/'
    //  app.browser.network.body.data.nodes.clear();
    //  app.browser.network.body.data.edges.clear();
    //  var cont = app.shadowRoot.getElementById("browsernetwork")
    //  this.rdfAgent.fetchRemote(app.publicStorage)
    this.agent.send('Browser', {action:'browse', path:app.publicStorage});
    this.agent.send('Spoggy', {action:'browse', path:app.publicStorage});
    //    this.fileAgent.readFolder(app.publicStorage)
    //  app.dataToVis(cont, app.privateStorage, false)
    /*  var cont = app.shadowRoot.getElementById("browsernetwork")
    app.dataToVis(cont,app.publicStorage)*/


  }

  render() {
    const friendsList = (friends) => html`
    Friends List (${friends.length})<br>
    <ul>
    ${friends.map((f) => html`
      <li>
      - ${f}
      </li>
      `)}
      </ul>
      `;
    return html`
    <fieldset>
    <legend>Name : ${this.name} <solid-login></solid-login></legend>
    <p>WebId : ${this.webId}</p>
    <p>Username : ${this.username} <solid-login></solid-login></p>
    ${friendsList(this.friends)}
    </fieldset>
    `;
  }

  clickHandler(event) {

    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur");
  }

}
// Register the new element with the browser.
customElements.define('profile-element', ProfileElement);
