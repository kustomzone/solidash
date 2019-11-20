// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
//import  *  as vis from "../vendor/visjs/vis.js"; //import "../vendor/visjs/vis-network.min.js";

import  { catchCommande } from "../minimal/js/spoggy.js";
import   "../minimal/js/solid.js";

//new
import { Spoggy } from "../minimal/js/spoggy1.js";


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
    this.spoggy = new Spoggy();
    console.log("SP",this.spoggy)
    this.spoggy.parle();

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      console.log(this.id+" RECEIVE "+JSON.stringify(message))
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId

        console.log(this.id+" receive webId "+app.webId)
        if (app.webId != null){
          //  app.getUserData()
          app.logged = true
        }else{
          app.logged = false
          //  app.notes = []
        }
      }
    };
    this.init();
  }

  render() {
    return html`
    <!-- Graph Vis -->
    <!--<link href="../vendor/visjs/vis-network.min.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="../vendor/vis-network.min.js"></script>-->
    <!--   <script type="text/javascript" src="./js/network.js"></script> -->
      <link href="../vendor/visjs/dist/vis-network.css" rel="stylesheet" type="text/css">
    <style type="text/css">
    #mynetwork {
      width: 600px;
      height: 400px;
      border: 1px solid lightgray;
    }
    </style>
    <!-- Spoggy -->
    <!--  <script type="text/javascript" src="./js/levels.js"></script> -->

    <!--
    <script type="text/javascript" src="./js/import-export.js"></script>
    <script type="text/javascript" src="./js/spoggy.js"></script>
    <script type="text/javascript" src="./js/solid.js"></script>-->
    <p>Name : ${this.name}</p>
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
  

    <div id="mynetwork" bgcolor="#E6E6FA">  </div>
    <br>

    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>

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
    this.spoggy.network(container)
console.log("SPOGGY PEUPLE", this.spoggy)
  }

}
// Register the new element with the browser.
customElements.define('spoggy-element', SpoggyElement);
