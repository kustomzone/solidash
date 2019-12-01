import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import { BsBadge } from '../vendor/@lit-element-bootstrap/bs-badge.bundle.js';
import { BsContainer, BsRow, BsColumn, BsColumnExtraLargeCss, BsColumnExtraSmallCss,BsColumnLargeCss,BsColumnMediumCss,BsColumnSmallCss,BsContainerCss, BsRowCss } from '../vendor/@lit-element-bootstrap/bs-layout.bundle.js';
import '../vendor/@lit-element-bootstrap/bs-card.bundle.js';
import '../vendor/@lit-element-bootstrap/bs-navs.bundle.js'

//import '../vendor/hammerjs/hammer.min.js';

import "./messages-component.js"
import "./tripledoc-profile.js"
import "./browser-component.js"
import "./explorer-component.js"
import "./editor-component.js"
import "./login-component.js"
import "./spoggy-component.js"

// Extend the LitElement base class
class ComponentApp extends LitElement {

  static get properties() {
    return {
      name: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
  }

  firstUpdated(changedProperties) {
    this.agent = new HelloAgent(this.name);

    var coll = this.shadowRoot.querySelectorAll(".collapsible");
    for (var i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        console.log("click")
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
    /*
    var footer = this.shadowRoot.getElementById("footer")
    var myOptions = {}
    var hammertime = new Hammer(footer, myOptions);
    hammertime.on('pan', function(ev) {
    console.log(ev);
  });*/


}

render() {
  return html`
  <style>
  /* Style the button that is used to open and close the collapsible content */
  .collapsible {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
  }

  /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
  .active, .collapsible:hover {
    background-color: #ccc;
  }

  /* Style the collapsible content. Note: hidden by default */
  .content {
    padding: 0 18px;
    display: none;
    overflow: hidden;
    background-color: #f1f1f1;
  }

  .footer {
    background-color: #bbb;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: auto;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right:0px;
  }

  </style>



  <bs-nav tabs id="myTab" role="tablist">
      <bs-nav-item><bs-nav-link active  id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</bs-nav-link></bs-nav-item>
      <bs-nav-item><bs-nav-link id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</bs-nav-link></bs-nav-item>
      <bs-nav-item><bs-nav-link id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</bs-nav-link></bs-nav-item>
      <bs-nav-item><bs-nav-link disabled>Disabled</bs-nav-link></bs-nav-item>
  </bs-nav>


<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">Home.</div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">Profile.</div>
  <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">Contact.</div>
</div>







  <bs-container>
  <div class="header">
  <bs-container>
  <bs-row>
  <bs-column sm demo>  <h1>Compagent  </h1></bs-column>
  <bs-column sm demo>--</bs-column>
  <bs-column sm demo><login-component name="Login"></login-component></bs-column>
  </bs-row>
  </bs-container>

  </div>
  <div class="sidebar">

  </div>
  <div class="body">


  <bs-row>
  <bs-column xs demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h5>Nouveau <bs-badge context="secondary">New</bs-badge></h5>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <bs-button primary>Go somewhere</bs-button>
  </bs-card-body>
  </bs-card>
  </bs-column>

  <bs-column xs demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h5>Explorer</h5>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <bs-button primary>Go somewhere</bs-button>
  </bs-card-body>
  </bs-card>
  </bs-column>

  <bs-column xs demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h5>Connexion</h5>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <login-component></login-component>
  </bs-card-body>
  </bs-card>
  </bs-column>
  </bs-row>


  <bs-row>
  <bs-column xs demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h3>Meta <bs-badge context="secondary">New</bs-badge></h3>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <bs-button primary>Go somewhere</bs-button>
  </bs-card-body>
  </bs-card>
  </bs-column>

  <bs-column xs demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h5>Profile</h5>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <bs-button primary>Go somewhere</bs-button>
  </bs-card-body>
  </bs-card>
  </bs-column>

  <bs-column xs demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h5>Inbox</h5>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <bs-button primary>Go somewhere</bs-button>
  </bs-card-body>
  </bs-card>
  </bs-column>
  </bs-row>


  <bs-row>
  <bs-column xl demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h5>Blog Plume</h5>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <bs-button primary>Installer Plume</bs-button>
  <bs-button primary>Utiliser Plume</bs-button>

  </bs-card-body>
  </bs-card>
  </bs-column>

  </bs-row>



  <bs-row>
  <bs-column xs demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h4>Application / Games <bs-badge context="secondary">New</bs-badge></h4>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <bs-button primary>Go somewhere</bs-button>
  </bs-card-body>
  </bs-card>
  </bs-column>

  <bs-column xs demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h5>Créé ton application Loufoque / Create your creazy app</h5>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <bs-button primary>Go somewhere</bs-button>
  </bs-card-body>
  </bs-card>
  </bs-column>

  <bs-column xs demo>
  <bs-card>
  <bs-card-body>
  <bs-card-title slot="card-title">
  <h5>Services / Providers</h5>
  </bs-card-title>
  <bs-card-text slot="card-text">
  <p>With supporting text below as a natural lead-in to additional content.</p>
  </bs-card-text>
  <bs-button primary>Go somewhere</bs-button>
  </bs-card-body>
  </bs-card>
  </bs-column>
  </bs-row>






  <button type="button" class="collapsible"><h2>Browser</h2></button>
  <div class="content">
  <browser-component name="Browser"></browser-component>
  </div>

  <button type="button" class="collapsible"><h1>Profile</h1></button>
  <div class="content">
  <tripledoc-profile name="TripledocProfile"></tripledoc-profile>
  </div>

  <button type="button" class="collapsible"><h2>Explorer</h2></button>
  <div class="content">
  <explorer-component name="Explorer"></explorer-component>
  </div>

  <button type="button" class="collapsible"><h2>Spoggy</h2></button>
  <div class="content">
  <spoggy-component name="Spoggy"></spoggy-component>
  </div>

  <button type="button" class="collapsible"><h1>Editor</h1></button>
  <div class="content">
  <editor-component name="Editor"></editor-component>
  </div>

  <button type="button" class="collapsible"><h2>Messages</h2></button>
  <div class="content">
  <messages-component name="Messages"></messages-component>
  </div>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <!--<div id ="footer" type="button" class="footer">

  <div align="center">
  <div align="left">
  > Spoggy >>
  </div>
  <div align="right">
  << Triples <
  </div>
  </div>

  </div> -->
  `;
}


}
// Register the new element with the browser.
customElements.define('component-app', ComponentApp);
