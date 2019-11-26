import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
import { SolidFileHelper } from '../helpers/solid-file-helper.js';

// Extend the LitElement base class
class EditorComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      body: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.sfh = new SolidFileHelper()
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "fileUriChanged":
          // code block
          app.fileUriChanged(message.uri)
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
    <p>Current File : ${this.uri}
    <button @click=${this.clickUpdate} disabled >Save</button>
    </p>
    <textarea
    rows="20"
    cols="100"
    id="textarea"
    @change=${this.textareaChanged}>
    ${this.body}
    </textarea>


    `;
  }

  fileUriChanged(uri){
    var app = this
    this.uri = uri
    console.log(uri)
    var extension = uri.split('.').pop();
    switch (extension) {
      case 'json':
      case 'html':
      case 'ttl':
      case 'txt':
      case 'rdf':
      case 'owl':
      this.sfh.readFile(this.uri)
      .then(
        body => {
          app.body = body
          app.shadowRoot.getElementById("textarea").value = body
          console.log("File Body",app.body)
        }, err => {
          console.log(err)
        })
        break;
        default:
        console.log("ce type de fichier n'est pas encore pris en compte : ",extension)
      }
    }

    textareaChanged(event) {
      console.log("change")
      //  this.count++
      //console.log(event.target);
      //  console.log(this.agent)
      //  this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
    }

    clickUpdate(){
      var content = this.shadowRoot.getElementById("textarea").value
      console.log("uri",this.uri)
      this.sfh.updateFile(this.uri, content)
      .then(
        body => {
          app.body = body
          app.shadowRoot.getElementById("textarea").value = body
          console.log("File Body",app.body)
        }, err => {
          console.log(err)
        })

      }
    }

    // Register the new element with the browser.
    customElements.define('editor-component', EditorComponent);
