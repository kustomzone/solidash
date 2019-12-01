import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

//import '../vendor/hammerjs/hammer.min.js';

// default components
import "./messages-component.js"

import "./editor-component.js"
import "./login-component.js"
import "./spoggy-component.js"

// Displayer
import "./displayer-chooser.js"
//import "./displayer-editor.js"
import "./displayer-graph.js"
import "./displayer-parser.js"

import "./acl-component.js"
import "./meta-component.js"




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



  <displayer-chooser name="Chooser"></displayer-chooser>
  <displayer-parser name="Parser"></displayer-parser>
  <displayer-graph name="D3Force" type="d3"></displayer-graph>
  <displayer-graph name="BarChart" type="bar"></displayer-graph>
  <displayer-graph name="PieChart" type="pie"></displayer-graph>
  <editor-component name="Editor" type="simple"></editor-component>
  <editor-component name="Editor" type="fancy"></editor-component>
  <acl-component name="Acl"></acl-component>
  <meta-component name="Meta"></meta-component>




  <button type="button" class="collapsible"><h1>Login</h1></button>
  <div class="content">
  <login-component name="Login"></login-component>
  </div>
  <!--
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
  </div>-->

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
