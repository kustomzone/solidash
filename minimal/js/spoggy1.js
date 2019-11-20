


export class Spoggy {
  constructor() {
    this.name = "Spoggy Module";
    this.seed = 2;
    var nodes = null;
    var edges = null;
    var network = null;


    this.centralGravityValueDefault = 0.2; //0.0001,
    this.springLengthValueDefault = 200;//170;//200;//127,
    this.springConstantValueDefault = 0.05;//0.04, // 0.05
    this.nodeDistanceValueDefault = 200;//100;//170, //120
    this.dampingValueDefault = 0.09;//0.08 // 0,08;
  }
  parle() {
    console.log("Classe Spoggy")
    console.log(`${this.name} aboie.`);
  }
  network(container){
    // randomly create some nodes and edges
    var nodes = new vis.DataSet([
      {id: "Spoggy", label: 'Spoggy'},
      {id: "Solo", label: 'Solo'},
      {id: "Collaboratif", label: 'Collaboratif'},
      {id: "Explore", label: 'Explore'},
      {id: "Solid", label: 'Solid'},
      {id: "Holacratie", label: 'Holacratie'}
    ]);

    // create an array with edges
    var edges = new vis.DataSet([
      {from: "Spoggy", to: "Solo", arrows:'to', label: "niveau 1"},
      {from: "Spoggy", to: "Collaboratif", arrows:'to', label: "niveau 2"},
      {from: "Spoggy", to: "Explore", arrows:'to', label: "niveau 3"},
      {from: "Spoggy", to: "Solid", arrows:'to', label: "niveau 4"},
      {from: "Spoggy", to: "Holacratie", arrows:'to', label: "niveau 5"},
      {from: "Solo", to: "Collaboratif", arrows:'to', label: "suivant"},
      {from: "Collaboratif", to: "Explore", arrows:'to', label: "suivant"},
      {from: "Explore", to: "Solid", arrows:'to', label: "suivant"},
      {from: "Solid", to: "Holacratie", arrows:'to', label: "suivant"},
    ]);

    // create a network
    //  var container = this.shadowRoot.getElementById('mynetwork');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      layout: {randomSeed:this.seed}, // just to make sure the layout is the same when the locale is changed
      //  locale: val || "en", // document.getElementById('locale').value,
      interaction: {
        navigationButtons: true,
        //  keyboard: true, // incompatible avec le déplacement par flèches dans le champ input
        multiselect: true
      },
      edges:{
        arrows: {
          to:     {enabled: true, scaleFactor:1, type:'arrow'}
        },
        color:{
          inherit:'both',
          highlight: '#000000',
          color: '#2B7CE9'
        }
      },
      nodes:{
        color: {
          highlight: {border: '#000000', background:'#FFFFFF'}
        }
      },
      manipulation: {
        addNode: function (data, callback) {
          // filling in the popup DOM elements
          //  document.getElementById('node-operation').innerHTML = "Ajouter un noeud ";
          data.label="";
          //  editNode(data, clearNodePopUp, callback);
        },
        editNode: function (data, callback) {
          // filling in the popup DOM elements
          //  document.getElementById('node-operation').innerHTML = "Editer un noeud ";
          //  editNode(data, cancelNodeEdit, callback);
        },
        addEdge: function (data, callback) {
          if (data.from == data.to) {
            var r = confirm("Etes-vous certain de vouloir connecter le noeud sur lui-même?");
            if (r != true) {
              callback(null);
              return;
            }
          }
          //document.getElementById('edge-operation').innerHTML = "Ajouter un lien";
          //editEdgeWithoutDrag(data, callback);
        },
        editEdge: {
          editWithoutDrag: function(data, callback) {
            //document.getElementById('edge-operation').innerHTML = "Editer un lien";
            //editEdgeWithoutDrag(data,callback);
          }
        }
      }
      ,
      physics:{
        enabled: true,
        barnesHut: {
          gravitationalConstant: -1,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 1
        },
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springConstant: 0.08,
          springLength: 100,
          damping: 0.4,
          avoidOverlap: 0
        },
        repulsion: {
          centralGravity: this.centralGravityValueDefault,  //0.001, //0.001 ? A quoi sert cette valeur ?
          springLength: this.springLengthValueDefault,   // 220, //220 (//200 //300)
            springConstant: this.springConstantValueDefault, //0.01, //0.01
            nodeDistance:  this.nodeDistanceValueDefault, //150, //100 //350
            damping: this.dampingValueDefault, ///0.08

          },
          hierarchicalRepulsion: {
            centralGravity: 0.0,
            springLength: 100,
            springConstant: 0.01,
            nodeDistance: 120,
            damping: 0.09
          },
          maxVelocity: 500, //50
          minVelocity: 1, //0.1
          solver: 'repulsion',
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false//,
            //  fit: true
          },
          timestep: 0.5,
          adaptiveTimestep: true
        }
      };
      this.network = new vis.Network(container, data, options);

      // EVENTS on Network
      this.network.body.data.nodes.on("*", function(event, properties, senderId){
        //updateEditorFromNetwork(event, properties, senderId)
        console.log(event)
      }
    );
    this.network.body.data.edges.on("*", function(event, properties, senderId){
      //  updateEditorFromNetwork(event, properties, senderId)
      console.log(event)
    }
  );

}

}
