// Import the LitElement base class and html helper function
//https://www.alsacreations.com/tuto/lire/926-geolocalisation-geolocation-html5.html
//https://nouvelle-techno.fr/actualites/2018/05/11/pas-a-pas-inserer-une-carte-openstreetmap-sur-votre-site
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';


// Extend the LitElement base class
class MyGeolocation extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      infopos: {type: String},
      lat: {type: Number},
      long: {type: Number},
      carte: {type: Object}
    };
  }

  script() {
   let script = document.createElement('script');
  // console.log(this)
   script.onload = this.onLoad.bind(this);

   script.src = 'https://unpkg.com/leaflet@1.5.1/dist/leaflet.js';
//   script.integrity = 'sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og==';
//   script.crossorigin = '';

   return script;
 }

 onLoad() {
   alert('loaded');
 }
  constructor() {
    super();
    this.message = 'Hello world! From my-element';
    this.name = "unknown";
    this.infopos = "You must accept Geolocation to use this widget";

    this.lat = 48.852969;
    this.lon = 2.349903;
    this.macarte = null;
  }

  firstUpdated(changedProperties) {
    this.agent = new HelloAgent(this.name);
    this.startWatch()

  }

  startWatch(){
    var app = this
    //   this.initMap();
    if(navigator.geolocation){

      app.survId =  navigator.geolocation.watchPosition(function(pos){
        app.maPosition(pos,app)
      })
    }else{
      alert("Geolocation is not supported")
    }
  }

  stopWatch(){
    // Annule le suivi de la position si nécessaire.
    navigator.geolocation.clearWatch(this.survId);
  }


  maPosition(position, app) {
  //  console.log(position, app)
    //var app = this
    var infopos = "Position déterminée :\n";
    infopos += "Latitude : "+position.coords.latitude +"\n";
    infopos += "Longitude: "+position.coords.longitude+"\n";
    infopos += "Altitude : "+position.coords.altitude +"\n";
    infopos += "Vitesse  : "+position.coords.speed +"\n";
    this.infopos = infopos;

    //  document.getElementById("infoposition").innerHTML = infopos;
  }


  // Fonction d'initialisation de la carte
  initMap() {
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    this.macarte = L.map('map').setView([this.lat, this.lon], 11);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      // Il est toujours bien de laisser le lien vers la source des données
      attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
      minZoom: 1,
      maxZoom: 20
    }).addTo(this.macarte);
  }



  render() {
    return html`
    <!-- Custom fonts for this template-->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.min.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">
   <!--  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
      integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      crossorigin=""/>


${this.script()}
    <style type="text/css">
    #map{ /* la carte DOIT avoir une hauteur sinon elle n'apparaît pas */
    height:400px;
  }
  </style>
-->

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
  <div id="infoposition">${this.infopos}</div>
  <p>${this.message}</p>

  <button @click=${this.stopWatch}>Stop Watching Pos</button>
  <button @click=${this.startWatch}>Start Watching Pos</button>
  <div id="map">
  map
  <!-- Ici s'affichera la carte -->
  </div>
  <!--  <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>-->
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
customElements.define('my-geolocation', MyGeolocation);
