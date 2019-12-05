import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import "./camera-component.js"
import "./editor-component.js"

// Extend the LitElement base class
class TwitComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      uri: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.uri = "rien"
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




    <style type="text/css">
    /* Modal Header */
    body {font-family: Arial, Helvetica, sans-serif;}

    /* The Modal (background) */
    .modal {
      display: none; /* Hidden by default */
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      padding-top: 100px; /* Location of the box */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

    /* Modal Content */
    .modal-content {
      position: relative;
      background-color: #fefefe;
      margin: auto;
      padding: 0;
      border: 1px solid #888;
      width: 80%;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
      -webkit-animation-name: animatetop;
      -webkit-animation-duration: 0.4s;
      animation-name: animatetop;
      animation-duration: 0.4s
    }

    /* Add Animation */
    @-webkit-keyframes animatetop {
      from {top:-300px; opacity:0}
      to {top:0; opacity:1}
    }

    @keyframes animatetop {
      from {top:-300px; opacity:0}
      to {top:0; opacity:1}
    }

    /* The Close Button */
    .close {
      color: white;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }

    .modal-header {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }

    .modal-body {padding: 2px 16px;}

    .modal-footer {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }
    </style>

    <button @click=${this.modalOpen}>New Twit</button>


    <!-- The Modal -->
    <div id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
    <div class="modal-header">
    <span class="close" @click=${this.modalClose}>&times;</span>
    <h2>Twitpod</h2>
    </div>
    <div> </div>
    <div class="modal-body" style="height: 30vw; overflow-y: scroll;">
    <editor-component name="EditorTwit" uri=${this.uri}></editor-component>
    <camera-component name="Camera" uri=${this.uri}></camera-component>
    </div>
    <div class="modal-footer">
    <h3>Modal Footer</h3>
    </div>
    </div>
    </div>

    `;
  }



  modalOpen(event) {
    this.shadowRoot.getElementById('myModal').style.display = 'block';
  }
  modalClose(event) {
    this.shadowRoot.getElementById('myModal').style.display = 'none';
  }
}

// Register the new element with the browser.
customElements.define('twit-component', TwitComponent);
