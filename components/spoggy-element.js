// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import '../vendor/solid-file-client/solid-file-client.bundle.js';
import { HelloAgent } from '../js/agents/HelloAgent.js';
import { RdfAgent } from '../js/agents/RdfAgent.js';
import { FileAgent } from '../js/agents/FileAgent.js';
//import  *  as vis from "../vendor/visjs/vis.js"; //import "../vendor/visjs/vis-network.min.js";

import  { catchCommande } from "../minimal/js/spoggy.js";
import   "../minimal/js/solid.js";
import  './solid-login.js';
import  { importer , statements2vis } from '../minimal/js/import-export.js';

//new
import { Spoggy } from "../minimal/js/spoggy1.js";





// Extend the LitElement base class
class SpoggyElement extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      webId: {type: String},
      friends: {type: Array},
      username: {type: Array}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! Spoggy-Element';
    this.name = "unknown"
    this.spoggy = new Spoggy();
    this.browser= new Spoggy();
    console.log("SP",this.spoggy)

    this.spoggy.parle();
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
    this.rdfAgent = new RdfAgent('rdfAgent');
    this.fileAgent = new FileAgent('fileAgent');

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
          case "editNode":
          // code block
          app.editNode(message.params)
          break;
          case "editEdgeWithoutDrag":
          // code block
          app.editEdgeWithoutDrag(message.params)
          break;
          case "updateGraph":
          // code block
          app.browser.updateGraph(message.params)
          break;
          default:
          // code block
          console.log("action inconnue")
        }
      }
    };
    this.init();
  }


  dataToVis(container,data,replace=true){
    var app = this;
    console.log(container);
    console.log(typeof data, data)
    if (typeof data == "string"){
      var params={source : data };
      params.rdfAgent = app.rdfAgent;
      params.fileAgent = app.fileAgent;
      console.log(params)
      importer(params,app.spoggy.updateGraph);
    }


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
    app.browser.network.body.data.nodes.clear();
    app.browser.network.body.data.edges.clear();
    var cont = app.shadowRoot.getElementById("browsernetwork")
    this.rdfAgent.fetchRemote(app.publicStorage)
    this.agent.send('Browser', {action:'browse', path:app.publicStorage});
    //    this.fileAgent.readFolder(app.publicStorage)
    //  app.dataToVis(cont, app.privateStorage, false)
    /*  var cont = app.shadowRoot.getElementById("browsernetwork")
    app.dataToVis(cont,app.publicStorage)*/


  }

  getTypeIndex(){

    var app = this;
    app.publicTypeIndexUrl = app.person.getRef(app.SOLID('publicTypeIndex'))
    console.log("publicTypeIndexUrl",app.publicTypeIndexUrl)
  }


  editNode(params){
    console.log("open",params)
    var data = params.data;
    var cancelAction = params.cancelAction ;
    var callback = params.callback ;
    this.shadowRoot.getElementById('node-id').value = data.id || "";
    this.shadowRoot.getElementById('node-label').value = data.label;
    //  this.shadowRoot.getElementById('node-shape').value = data.shape || "ellipse";
    this.shadowRoot.getElementById('node-saveButton').onclick = this.saveNodeData.bind(this, data, callback);
  //  this.shadowRoot.getElementById('node-cancelButton').onclick = this.cancelAction.bind(this, callback);
    this.shadowRoot.getElementById('nodePopUp').style.display = 'block';
    this.shadowRoot.getElementById('node-label').onkeyup = this.nodeNameChanged.bind(this, data, callback);
  }

  nodeNameChanged(event,data, callback) {
    if(event.key === 'Enter') {
      event.preventDefault();
      //  document.getElementById("valider").click();
      this.saveNodeData(data, callback)
    }
  }

  edgeNameChanged(event,data, callback) {
    if(event.key === 'Enter') {
      event.preventDefault();
      //  document.getElementById("valider").click();
      this.saveEdgeData(data, callback)
    }
  }
  saveNodeData(data, callback) {
    data.label = this.shadowRoot.getElementById('node-label').value;
    /*  console.log(this.shadowRoot.getElementById('node-shape'))
    data.shape = this.shadowRoot.getElementById('node-shape').value;
    console.log(data.shape)
    data.color = {};
    data.color.background = this.shadowRoot.getElementById('colpicbody').value;
    data.color.border =  this.shadowRoot.getElementById('colpicborder').value;
    this.shadowRoot.getElementById('bodycolorpicker').value = this.shadowRoot.getElementById('colpicbody').value;
    this.shadowRoot.getElementById('bordercolorpicker').value = this.shadowRoot.getElementById('colpicborder').value;
    var image_url = this.shadowRoot.getElementById('node-image-url').value || "";
    if (data.shape == "image" || data.shape == "circularImage" && image_url.length > 0){
    data.image = image_url;
  }
  */
  console.log(data)
  //  this.fitAndFocus(data.id)
  this.clearNodePopUp();
  callback(data);
}


// Callback passed as parameter is ignored
clearNodePopUp() {
  this.shadowRoot.getElementById('node-saveButton').onclick = null;
  this.shadowRoot.getElementById('node-cancelButton').onclick = null;
  this.shadowRoot.getElementById('nodePopUp').style.display = 'none';
  this.shadowRoot.getElementById('node-label').onkeyup = null;
}

cancelNodeEdit(callback) {
  this.clearNodePopUp();
  callback(null);
}







editEdgeWithoutDrag(params) {
  var data = params.data
  var callback = params.callback
  // filling in the popup DOM elements
  this.shadowRoot.getElementById('edge-label').value = data.label || "";
  this.shadowRoot.getElementById('edge-saveButton').onclick = this.saveEdgeData.bind(this, data, callback);
  this.shadowRoot.getElementById('edge-cancelButton').onclick = this.cancelEdgeEdit.bind(this,callback);
  this.shadowRoot.getElementById('edge-popUp').style.display = 'block';
  this.shadowRoot.getElementById('edge-label').onkeyup = this.edgeNameChanged.bind(this, data, callback);
}

clearEdgePopUp() {
  this.shadowRoot.getElementById('edge-saveButton').onclick = null;
  this.shadowRoot.getElementById('edge-cancelButton').onclick = null;
  this.shadowRoot.getElementById('edge-label').onkeyup = null;
  this.shadowRoot.getElementById('edge-popUp').style.display = 'none';

}

cancelEdgeEdit(callback) {
  this.clearEdgePopUp();
  callback(null);
}

saveEdgeData(data, callback) {
  if (typeof data.to === 'object')
  data.to = data.to.id
  if (typeof data.from === 'object')
  data.from = data.from.id
  data.label = this.shadowRoot.getElementById('edge-label').value;
  data.color = {};
  data.color.inherit='both';
  this.clearEdgePopUp();
  callback(data);
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
    <!-- Graph Vis -->
    <!--<link href="../vendor/visjs/vis-network.min.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="../vendor/vis-network.min.js"></script>-->
    <!--   <script type="text/javascript" src="./js/network.js"></script> -->
    <link href="../vendor/visjs/dist/vis-network.css" rel="stylesheet" type="text/css">
    <style type="text/css">
    .network {
      width: 800px;
      height: 400px;
      /*  width: 100%;
      height: 800px;*/
      border: 1px solid lightgray;
    }
    #operation {
      font-size:28px;
    }
    #nodePopUp {
      display:none;
      position:absolute;
      top:350px;
      left:170px;
      z-index:299;
      width:250px;
      height:120px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    #edge-popUp {
      display:none;
      position:absolute;
      top:350px;
      left:170px;
      z-index:299;
      width:250px;
      height:90px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    </style>
    <!-- Spoggy -->
    <!--  <script type="text/javascript" src="./js/levels.js"></script> -->

    <!--
    <script type="text/javascript" src="./js/import-export.js"></script>
    <script type="text/javascript" src="./js/spoggy.js"></script>
    <script type="text/javascript" src="./js/solid.js"></script>-->

    <fieldset>
    <legend>${this.name}</legend>
    <p>WebId : ${this.webId}</p>
    <p>Username : ${this.username} <solid-login></solid-login></p>
    ${friendsList(this.friends)}
    <p>${this.message}</p>

    <div>
    <fieldset>
    <legend>Outils</legend>
    <button
    id="nouveau_graph"
    @click=${this.attrappeCommande}

    >Nouveau</button> /n
    <!--  <button id="importer_btn" onclick="catchCommande({value:'/i'})">Ouvrir</button> /i-->
    <button id="save_to_pod" onclick="open_ub()">Universal Browser</button> /a
    <button id="capture_graphe"  @click=${this.attrappeCommande}>Capturer jpg</button> /c
    </fieldset>
    </div>

    <div id="nodePopUp">
    <span id="node-operation">node</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>id</td><td><input id="node-id" value="new value" /></td>
    </tr>
    <tr>
    <td>label</td><td><input id="node-label" value="new value" /></td>
    </tr>
    </table>
    <input type="button" value="save" id="node-saveButton" />
    <input type="button" value="cancel" id="node-cancelButton" />
    </div>

    <div id="edge-popUp">
    <span id="edge-operation">edge</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>label</td><td><input id="edge-label" value="new value" /></td>
    </tr></table>
    <input type="button" value="save" id="edge-saveButton" />
    <input type="button" value="cancel" id="edge-cancelButton" />
    </div>

    <div class="network" id="mynetwork" bgcolor="#E6E6FA">  </div>

    <div class="network" id="browsernetwork" bgcolor="#E6E6FA">  </div>

    <br>
</fieldset>
    `;
  }

  clickHandler(event) {
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', 'Click from SpoggyElement!');
  }

  attrappeCommande(){
    catchCommande({value:'/c'})
    console.log("catc")
  }

  init(){
    // create a network
    var container = this.shadowRoot.getElementById('mynetwork');
    //  this.spoggy.agent(this.agent)
    this.spoggy.network(container)

    var browsercontainer = this.shadowRoot.getElementById('browsernetwork');
    //  this.spoggy.agent(this.agent)
    this.browser.network(browsercontainer)
    console.log("SPOGGY PEUPLE", this.spoggy)
  }

}
// Register the new element with the browser.
customElements.define('spoggy-element', SpoggyElement);
