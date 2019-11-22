// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
import  './solid-login.js';
import  { SolidTool } from '../js/helpers/solid-tool.js';

// Extend the LitElement base class
class BrowserElement extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      path: {type: String},
      folder: {type: Object}
    };
  }

  constructor() {
    super();
    this.st = new SolidTool();
    this.message = 'Hello world! Browser-Element';
    this.name = "unknown";
    this.path = "nopath";
    this.folder = {folders:[], files:[]};

  }

  firstUpdated(changedProperties) {
    var app = this
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      console.log(this.id+" RECEIVE "+JSON.stringify(message))
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        //var cont = app.shadowRoot.getElementById("browsernetwork")

        console.log(this.id+" receive webId "+app.webId)
        if (app.webId != null){
          //  app.getUserData()
          app.logged = true
          //  app.getUserData(app.webId)
          //  app.dataToVis(cont,app.webId)
        }else{
          app.logged = false
          //    app.friends = [];
          //  app.username = "";
          //  app.notes = []
        }
      }else   if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "browse":
          // code block
          app.browse(message.path)
          break;

          default:
          // code block
          console.log("action inconnue")
        }
      }
    };

  }

  browse(path){
    var app = this
    console.log("UPDATE BROWSER TO ",path)
    this.path = path;
    this.st.readFolder(path).then(folder =>{
      console.log(folder)
      app.folder = folder;
      app.updateBrowser(app.folder)
    },err =>{alert(err)})

  }


  updateBrowser(folder){
    var app = this
    // material colo https://material.io/tools/color/#!/?view.left=0&view.right=1&primary.color=81D4FA
    console.log("update universal Browser",folder)
    var liste=app.shadowRoot.getElementById("ub-liste");
    liste.innerHTML = "";
    /*  var fileList=document.getElementById("fileslist");
    fileList.innerHTML = ""*/

    /*parentDiv = document.createElement("div");
    newText = document.createTextNode("..(parent)");
    parentDiv.appendChild(newText);
    parentDiv.style.padding="15px";
    parentDiv.addEventListener('click', function () {
    //  console.log(folder.parent)
    app.st.readFolder(folder.parent,callbackUniversalBrowser)
  })*/

  // nouveaux

  /*
  var ubParent=document.getElementById("ub-parent");
  ubParent.innerHTML = "";
  ubParent.appendChild(parentDiv);

  var ubUrl=document.getElementById("ub-url");
  ubUrl.value = folder.url;*/
  /*document.getElementById("arrow-upward").addEventListener('click', function () {
  console.log(folder.parent)
  fileAgent.readFolder(folder.parent,callbackUniversalBrowser)
})*/


/*
folder.folders.forEach(function(fo){
  //  console.log("fo",fo)
  var name = fo.name;
  var url = fo.url;
  newLI = document.createElement("li");
  newText = document.createTextNode(name);
  newLI.appendChild(newText);
  newLI.style.padding="16px";
  //  newLI.style.color="#fff";
  newLI.style.background="#81d4fa";
  newLI.addEventListener('click', function () {
    //console.log(url)
    //  fileAgent.readFolder(url,callbackAfterRead)
    fileAgent.readFolder(url,callbackUniversalBrowser)
  })
  liste.appendChild(newLI);
})*/
/*
folder.files.forEach(function(fi){
  //  console.log("fi",fi)
  var name = fi.name;
  var url = fi.url;
  newLI = document.createElement("li");
  newText = document.createTextNode(name);
  newLI.appendChild(newText);
  newLI.style.padding="16px";
  //newLI.style.color="#ddd";
  newLI.style.background="#b6ffff";
  newLI.addEventListener('click', function () {
    //  console.log(url)
    //  fileAgent.readFile(url,callbackAfterBrowse)
    var params = {}
    params.source = fi.url;
    //importer(params,after)
    //close_ub();
    importer(params,updateGraph)
  })
  liste.appendChild(newLI);
})*/
}


clickInBrowser(e){
  console.log(e)
  console.log(e.target)
  var path = e.target.getAttribute("path")
  var type = e.target.getAttribute("type")
  console.log(path)
  if (type == "folder"){
    this.browse(path)
  }else{
    
  }

}

/*
updateBrowser(data){
console.log("UPDATE WITH ", data)
}*/

render() {

  const folderList = (folders) => html`
  Folders List(${folders.length})<br>
  <ul>
  ${folders.map((f) => html`
    <li>
    <button @click="${this.clickInBrowser}" path=${f.url} type="${f.type}">${f.name}</button>
    </li>
    `)}
    </ul>
    `;

    const fileList = (files) => html`
    Files List(${files.length})<br>
    <ul>
    ${files.map((f) => html`
      <li>
      ${f.name}, ${f.label}, ${f.type}, ${f.url}
      </li>
      `)}
      </ul>
      `;

      return html`
      <p>Name : ${this.name}, <solid-login></solid-login></p>
      <p>Path : ${this.path}</p>
      <p>${this.message}</p>
      <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>

      <div>
      <p> Folder : ${this.folder.name}</p>
      <p> Parent :   <button @click="${this.clickInBrowser}" path=${this.folder.parent}>${this.folder.parent}</button></p>

      <p>
      ${folderList(this.folder.folders)}
      </p>
      <p>
      ${fileList(this.folder.files)}
      </p>


      </div>




      <div
      id="universal-browser"
      class="mdc-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="ub-title"
      aria-describedby="ub-content">
      <div class="mdc-dialog__container">
      <div class="mdc-dialog__surface">
      <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
      <h2 class="mdc-dialog__title" id="ub-title"><!--
      -->Universal Browser   <span>
      <i
      class="material-icons mdc-list-item__graphic"
      aria-hidden="true"
      data-mdc-dialog-action="yes"
      >
      clear</i>
      </span><!--
      --></h2>

      <div class="mdc-tab-bar" id="open-tab-bar" role="tablist">
      <div class="mdc-tab-scroller">
      <div class="mdc-tab-scroller__scroll-area">
      <div class="mdc-tab-scroller__scroll-content">
      <button class="mdc-tab mdc-tab--active" role="tab" aria-selected="true" tabindex="0" onclick="selectOpenTab(this)">
      <span class="mdc-tab__content">
      <!--  <span class="mdc-tab__icon material-icons" aria-hidden="true">folder_open</span>-->
      <span class="mdc-tab__text-label">Editeur</span>
      </span>
      <span class="mdc-tab-indicator mdc-tab-indicator--active">
      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
      </span>
      <span class="mdc-tab__ripple"></span>
      </button>

      <button class="mdc-tab  mdc-tab--active" role="tab"  onclick="selectOpenTab(this)">
      <span class="mdc-tab__content">
      <span class="mdc-tab__icon material-icons" aria-hidden="true">cloud_queue</span>
      <span class="mdc-tab__text-label">Local</span>
      </span>
      <span class="mdc-tab-indicator mdc-tab-indicator--active">
      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
      </span>
      <span class="mdc-tab__ripple"></span>
      </button>


      <button class="mdc-tab  mdc-tab--active" role="tab"  onclick="selectOpenTab(this)">
      <span class="mdc-tab__content">
      <span class="mdc-tab__icon material-icons" aria-hidden="true">cloud_queue</span>
      <span class="mdc-tab__text-label">Pod</span>
      </span>
      <span class="mdc-tab-indicator mdc-tab-indicator--active">
      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
      </span>
      <span class="mdc-tab__ripple"></span>
      </button>


      <button class="mdc-tab  mdc-tab--active" role="tab" onclick="selectOpenTab(this)">
      <span class="mdc-tab__content">
      <span class="mdc-tab__icon material-icons" aria-hidden="true">cloud</span>
      <span class="mdc-tab__text-label">Temps réel</span>
      </span>
      <span class="mdc-tab-indicator mdc-tab-indicator--active">
      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
      </span>
      <span class="mdc-tab__ripple"></span>
      </button>




      </div>
      </div>
      </div>
      </div>

      <div class="mdc-dialog__content" id="ub-content">

      <section>
      <div class="js-panels" for='open-tab-bar'>
      <div id="mdc-tab-1-panel" class="js-panel is-active" role="tabpanel" aria-hidden="false">

      <!-- editeur -->
      <div>
      Format :
      <button
      type="button"
      class="mdc-button mdc-dialog__button"
      onclick="catchCommande({value:'/e'})">
      <span class="mdc-button__label">json</span>
      </button>
      <button
      type="button"
      class="mdc-button mdc-dialog__button"
      onclick="catchCommande({value:'/t'})">
      <span class="mdc-button__label">ttl</span>
      </button>
      </div>
      <!--  <p>
      dossier courant :   <div id="current-folder-url"></div>
      <input id="new-folder-input" style="width:80%"  placeholder="Nom de dossier"></input>
      <button id="new-folder-btn" onclick="createFolder()">Créer un dossier</button><br>
      <input id="new-file-input" style="width:80%"  placeholder="Nom de fichier"></input>
      <button id="jsonSave-btn" onclick="jsonSave()">Enregistrer en JSON sur le POD</button>
      <button id="turtleSave-btn" onclick="turtleSave()">Enregistrer en Turtle (ttl) sur le POD</button><br>
      </p>-->

      <!--  <div class="mdc-dialog__surface">-->
      <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
      <!--  <h2 class="mdc-dialog__title" id="editor-dialog-title">Editeur
      <span onclick="(function(){ document.getElementById('editeur-popUp').style.display = 'none'; })();"> X</span>
      </h2>-->
      <!--  <div class="mdc-dialog__content" id="editor-dialog-content" >-->
      <pre id="editor"></pre>
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
      <!--
      <button
      type="button"
      class="mdc-button mdc-dialog__button"
      data-mdc-dialog-action="yes"
      onclick="(function(){ document.getElementById('editeur-popUp').style.display = 'none'; })();">
      <span class="mdc-button__label">Fermer</span>
      </button>-->
      </div>



      </div>
      <div id="mdc-tab-2-panel" class="js-panel" role="tabpanel" aria-hidden="true">
      <input type="checkbox" id="remplaceNetwork" name="remplaceNetwork">Remplacer le graphe</input> <br><br>
      <!--<input type="checkbox" id="partageImport"  name="partageImport"disabled >Partager Import</input>-->
      <filedset>
      <legend>Depuis mon disque dur</legend>
      <input id="filepicker" type="file" multiple value="Importer" onchange="handleFileSelected(this, updateGraph)"></input>
      </fieldset>

      <filedset>
      <legend>Depuis une url</legend>
      <input id="filepicker"  value="Importer" onchange="handleFileSelected(this, updateGraph)"></input>
      </fieldset>
      </div>

      <div id="mdc-tab-3-panel" class="js-panel" role="tabpanel" aria-hidden="true">
      <div >
      <button
      type="button"
      class="mdc-button"
      onclick="changePod('public')">
      <span class="mdc-button__label">POD public</span>
      </button>
      <a href="https://agora.solid.community/public" target="_blank">https://agora.solid.community/public</a><br>
      <button
      type="button"
      class="mdc-button logout"
      onclick="changePod('connecte')">
      <span class="mdc-button__label">POD Connecté</span>
      </button>
      <button
      type="button"
      class="mdc-button login"
      data-mdc-dialog-action="yes"
      onclick="login()">
      <span class="mdc-button__label">Se connecter sur un POD</span>
      </button>
      <button
      type="button"
      class="mdc-button logout"
      data-mdc-dialog-action="yes"
      onclick="logout()">
      <span class="mdc-button__label">Se deconnecter du POD</span>
      </button>
      <br>
      <input id="importUrl" style="width:80%" placeholder="Url / POD"></input>
      <button onclick="importFromUrl()">Importer</button><br>
      <input type="text" id="pod2browse" style="width:80%"  placeholder="Url du POD"></input>

      <br>
      <button
      type="button"
      class="mdc-button"
      data-mdc-dialog-action="yes"
      onclick="profile()">
      <span class="mdc-button__label">Profile</span>
      </button>
      <button
      type="button"
      class="mdc-button"
      data-mdc-dialog-action="yes"
      onclick="friends()">
      <span class="mdc-button__label">Friends</span>
      </button>
      </div>



      <div class="mdc-card" >
      <input id="ub-url"></input>
      <div class="mdc-card" id="ub-up">UP</div>
      <!-- ... content ... -->
      </div>
      <div class="mdc-card" id="ub-parent">
      contenu
      <span class="mdc-tab__icon material-icons" aria-hidden="true">arrow_upward</span>
      <!-- ... content ... -->
      </div>

      liste:   <ul id="ub-liste">
      </ul>

      </div>






      <!--
      <div class="mdc-card" >
      <div  id="arrow-upward">
      <span class="mdc-tab__icon material-icons" aria-hidden="true">arrow_upward</span>
      </div>
      url :  <input id="ub-url"></input>
      parent : <input id="ub-parent" ></input>
      up :<input id="ub-up">UP</input>
      menu:   <span id="ub-menu">menu</span>
      liste:   <ul id="ub-liste">
      </ul>
      </div>-->

      <div id="mdc-tab-4-panel" class="js-panel" role="tabpanel" aria-hidden="false">
      Distant et Collab

      </div>
      </div>




      </section>



      <!--
      <button type="button" class="mdc-button mdc-dialog__button">
      <span class="mdc-button__label raised" onclick="validInput()">Valider</span>
      </button>
      -->
      </div>
      <footer class="mdc-dialog__actions">
      <!--<button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
      <span class="mdc-button__label">No</span>
      </button>-->
      <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
      <span class="mdc-button__label">Fermer</span>
      </button>
      </footer>
      </div>
      </div>

      <div class="mdc-dialog__scrim"></div>
      </div>



      `;
    }



    clickHandler(event) {
      //console.log(event.target);
      console.log(this.agent)
      this.agent.send('Messages', 'Click from BrowserElement!');
    }

  }
  // Register the new element with the browser.
  customElements.define('browser-element', BrowserElement);
