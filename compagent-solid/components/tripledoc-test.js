import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
// Extend the LitElement base class
class TripledocTest extends LitElement {

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
    const store = $rdf.graph();
    console.log("store",store)
    console.log("tripledoc",Tripledoc)

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "doSomething":
          // code block
          app.doSomething(message.params)
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };


    Tripledoc.fetchDocument("https://smag0.solid.community/profile/card").then(
      doc => {
        console.log("doc",doc)
        const person = doc.getSubject(
          "https://smag0.solid.community/profile/card#me"
        );
        console.log("person ", person)
        app.name = person.getString("http://xmlns.com/foaf/0.1/name")
        console.log("name",app.name)
        /*app.shadowRoot.getElementById(
        "name"
      ).textContent = `This person's name is ${person.getString(
      "http://xmlns.com/foaf/0.1/name"
    )}.`;*/
  },
  err =>{
    console.log("erreur ",err)
  }
);

}

render() {
  return html`
  <p>Name : ${this.name}</p>
  <p>${this.message}</p>
  <p>${this.count}</p>

  <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
  `;
}

doSomething(params){
  console.log(params)
}

clickHandler(event) {
  this.count++
  //console.log(event.target);
  console.log(this.agent)
  this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
}
}

// Register the new element with the browser.
customElements.define('tripledoc-test', TripledocTest);
