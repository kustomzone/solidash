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
      name: {type: String},
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.spoggy = new Spoggy();
    this.browser= new Spoggy();
    console.log("SP",this.spoggy)

    this.spoggy.parle();
    this.webId = null;
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
      //  console.log(this.id+" RECEIVE "+JSON.stringify(message))
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        var cont = app.shadowRoot.getElementById("browsernetwork")

        console.log(this.id+" receive webId "+app.webId)
        if (app.webId != null){
          //  app.getUserData()
          app.logged = true
          //  app.getUserData(app.webId)
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
          case "updateFromFolder":
          app.updateFromFolder(message.folder)
          break;
          case "updateFromFile":
          app.updateFromFile(message.file)
          break;
          case "updateEditorFromNetwork":
          app.updateEditorFromNetwork(message.data)
          break;
          default:
          // code block
          console.log("action inconnue")
        }
      }
    };
    this.init();
  }

  updateFromFolder(folder){
    console.log(folder)
    this.folder2vis(folder)
  }

  updateFromFile(file){
    var app =this;
    switch (file.type) {
      case 'application/json':
      var data = JSON.parse(file.content)
      app.spoggy.updateGraph({data:data})

      break;
      case 'text/turtle':
      let doc = $rdf.sym(file.path);
      let store = $rdf.graph()
      console.log(store)
      try {
        $rdf.parse(file.content, store, doc.uri, 'text/turtle');
      }
      catch(error) {
        alert(error);
      }

      /*  $rdf.parse(result, store,base, mimeType)
      console.log("STORE",store)*/
      var data = statements2vis(store.statements);
      app.spoggy.updateGraph({data:data})
      break;
      default:
      console.log("Ce type de fichier ("+file.type+") n'est pas encore traité")


    }
  }



  folder2vis(sfolder){
    var app = this;
    //  this.clear()
    console.log('sfolder')
    //  console.log(sfolder)
    var name = sfolder.name;
    var url = sfolder.url;
    var parent = sfolder.parent;
    //  var folders = sfolder.folders||"Folders";
    //  var files = sfolder.files|| "Files";
    var nodes = [];
    var edges = [];
    nodes.push({id: url, label: name, type: "folder", cid:1, shape: "image", image: "../assets/folder.png" });
    //nodes.push({id:'folders', label:"Folder"});
    //edges.push({from:url, to: 'folders', arrows: 'to', label:"type"});
    //console.log("PAREnT", parent)
    if (parent != undefined){
      //  console.log("undef")
      nodes.push({id: parent, label: parent, type: "folder", cid:1, shape: "image", image: "../assets/parentfolder.png" });
      edges.push({from: url, to: parent, cid:1, arrows:'to', label: "parent"});
    }
    //  {id: "urlNode"+url, label: url},
    /*,
    {id: "folderCluster", label: folders},
    {id: "fileCluster", label: files}*/
    // create an array with edges
    //{from: url, to: "urlNode"+url, arrows:'to', label: "url"},
    /*,
    {from: url, to: "folderCluster", arrows:'to', label: "folders"},
    {from: url, to: "fileCluster", arrows:'to', label: "files"},*/
    if (sfolder.folders && sfolder.folders.length >0){
      sfolder.folders.forEach(function(fo){
        if(fo.name != ".."){
          app.folder2vis(fo)
          var node = {id:fo.url, label:fo.name, type: 'folder',cid:1, shape: "image", image: "../assets/folder.png" }
          //  console.log(node)
          nodes.push(node);
          edges.push({from:url, to: fo.url, cid:1, arrows: 'to', label:"folder"});
          edges.push({from:fo.url, to: 'folders', cid:1, arrows: 'to', label:"type"});
        }
      })
    }
    if (sfolder.files && sfolder.files.length > 0){
      //  nodes.push({id:'files', label:"File"});
      sfolder.files.forEach(function(fi){
        //  console.log(fi)
        //  app.file2vis(fi)
        var node = {id:fi.url, label:fi.label, type: 'file' , cid:1, shape: "image", image: "../assets/document.png" };
        //  console.log(node)
        nodes.push(node);
        edges.push({from:url, to: fi.url, cid:1, arrows: 'to', label:"file"});
        //  edges.push({from:fi.url, to: 'files', arrows: 'to', label:"type"});
      })
    }
    var  data = {
      nodes: nodes,
      edges: edges
    };

    //console.log("DATA",data)
    app.browser.updateGraph({data:data})
    //  console.log(data)
    /*this.network.body.data.nodes.clear();
    this.network.body.data.edges.clear();
    this.addSolidToGraph(data);
    this.network.fit();
    this.network.redraw();*/
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
  <div>
  <fieldset>
  <legend>Outils</legend>
  <button
  id="nouveau_graph"
  @click=${this.nouveau}

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
nouveau(){
  this.spoggy.network.body.data.nodes.clear();
  this.spoggy.network.body.data.edges.clear();
}

updateEditorFromNetwork(event, properties, senderId){
//var event = data.event;

 var data = {
   nodes: app.spoggy.network.body.data.nodes.get({
     filter: function (n) {
       return (n.cid != 1);
     }
   }),
   edges: app.spoggy.network.body.data.edges.get({
     filter: function (e) {
       return (e.cid != 1);
     }
   }) };
   var text = JSON.stringify(data, null, 2)
   editor.session.setValue(text)
   editor.format  = "json";
 //  document.getElementById('editeur-popUp').style.display = 'block';
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
