import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class CameraComponent extends LitElement {

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
  }

  render() {
    return html`
    <h1>${this.name}</h1>
    <p>${this.message}</p>
    <p>${this.count}</p>
    <input id="myFileInput" type="file" accept="image/*;capture=camera">

    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    `;
  }

  doSomething(params){
    console.log(params)
    /*
    var myInput = document.getElementById('myFileInput');

    function sendPic() {
        var file = myInput.files[0];

        // Send file here either by adding it to a 'FormData' object
        // and sending that via XHR, or by simply passing the file into
        // the 'send' method of an XHR instance.
    }

    myInput.addEventListener('change', sendPic, false);*/
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }
}

// Register the new element with the browser.
customElements.define('camera-component', CameraComponent);
