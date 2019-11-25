import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
import { Namespaces } from '../helpers/namespaces.js';
import { TripledocHelper } from '../helpers/tripledoc-helper.js';
// Extend the LitElement base class
class TripledocProfile extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
    this.ns = new Namespaces()
    this.th = new TripledocHelper()
    /*  const store = $rdf.graph();
    console.log("store",store)
    console.log("tripledoc",Tripledoc)*/

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "uriChanged":
          app.uriChanged(message.uri)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  render() {
    return html`
    <p>Name : ${this.name}</p>
    <p>${this.message}</p>
    <p>${this.count}</p>

    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    `;
  }

  uriChanged(uri){
    console.log(uri)
    this.th.getNameFromCard(uri).then( name =>{
      this.name = name;
    },err => {
      console.log(err)
    }

  )
}

clickHandler(event) {
  this.count++
  //console.log(event.target);
  console.log(this.agent)
  this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
}
}

// Register the new element with the browser.
customElements.define('tripledoc-profile', TripledocProfile);
