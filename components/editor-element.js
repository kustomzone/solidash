// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
import  { SolidTool } from '../js/helpers/solid-tool.js';

// Extend the LitElement base class
class EditorElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      content: {type: String}
    };
  }

  constructor() {
    super();
    this.st = new SolidTool();
    this.name = "unknown"
    this.content = "fictif content"

  }

  firstUpdated(changedProperties) {
    var app = this
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      console.log(this.id+" RECEIVE "+JSON.stringify(message))
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        console.log(this.id+" receive webId "+app.webId)
        if (app.webId != null){
          app.logged = true
        }else{
          app.logged = false
        }
      }else   if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "updateFromPath":
          // code block
          app.updateFromPath(message)

          break;
          case "setValue":
          // code block
          app.setValue(message.text)

          break;

          default:
          // code block
          console.log("action inconnue")
        }
      }
    };

    //https://ace.c9.io/#nav=api&api=editor
    app.editor = ace.edit(this.shadowRoot.getElementById("editor"), {
      theme: "ace/theme/tomorrow_night_eighties",
      mode: "ace/mode/turtle",
      maxLines: 30,
      wrap: true,
      autoScrollEditorIntoView: true
    });

  }

  updateFromPath(data){
    console.log(data)
    var app = this;
    app.path = data.path
    app.type = data.type
    try{
      this.st.readFile(app.path).then(content =>{
        console.log(content)
        app.content = content;
        var file = {}
        file.path = app.path;
        file.type = app.type;
        file.content = app.content;
        app.agent.send('Spoggy', {action:"updateFromFile", file:file});
        app.editor.session.setValue(content.trim())
        app.editor.format = "ttl"
        //  app.updateBrowser(app.folder)
      },err =>{alert(err)})
    }catch(e){
      console.log(e)
    }


  }

  setValue(text){
    this.editor.session.setValue(text)
    this.editor.format  = "json";
  }


  render() {
    return html`
    <style>
    .pre-scrollable {
      max-height: 340px;
      overflow-y: scroll;
    }
    </style>
    <fieldset>
    <legend>${this.name}</legend>

    <p>Content : ${this.type} <br>


    ${this.type == "text/html" || this.type == "image/png" || this.type == "image/jpeg"
    ?html`<p>Render some HTML or Png</p>
    <a href="${this.path}" target="_blank">open ${this.path} in fullscreen</a>
    <embed src="${this.path}"
    style="border:5px solid lightgray" width="100%" height="400">
    `
    :html`<p>Render some other than HTML  or Png</p>

    <div>
    <pre class="pre-scrollable" id="editor"> ${this.content}</pre>
    </div>
    <!--  </div>-->
    <div>
    <button
    type="button"
    class="mdc-button mdc-dialog__button"

    onclick="downloadFile()">
    <span class="mdc-button__label">Telecharger</span>
    </button>

    <button
    type="button"
    class="mdc-button mdc-dialog__button"

    onclick="openPodBrowser()">
    <span class="mdc-button__label">Enregistrer sur un POD</span>
    </button>
    </div>



    `}


    </p>





    </fieldset>
    `;
  }

}
// Register the new element with the browser.
customElements.define('editor-element', EditorElement);
