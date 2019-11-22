// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
import {BsButton} from 'https://unpkg.com/@lit-element-bootstrap/button';
import {BsCarousel} from 'https://unpkg.com/@lit-element-bootstrap/carousel';
import  {BsContainer, BsRow, BsColumn} from 'https://unpkg.com/@lit-element-bootstrap/layout';

import "../components/minimal-element.js";
import "../components/pad-element.js";
import "../js/helpers/messages-element.js";
import "../components/spoggy-element.js";
import "../components/browser-element.js";
import "../components/editor-element.js";
import "../components/profile-element.js";


// Extend the LitElement base class
class BootstrapContainer extends LitElement {

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
    this.agent = new HelloAgent(this.name);

  }

  render() {
    return html`

    <bs-container>
    <bs-row>

    <bs-column xs demo>
    <browser-element
    name="Browser"
    message="my message"
    other = "other attribute">
    Browser Loading ...
    </browser-element>
    </bs-column>


    <bs-column xs demo>
    <spoggy-element
    name="Spoggy">
    Spoggy Loading ...
    </spoggy-element>
    </bs-column>


    <bs-column xs demo>
    <bs-row>

    <profile-element
    name="Profile">
    Profile Loading ...
    </profile-element>

    <editor-element
    name="Editor">
    Editor Loading ...
    </editor-element>
    </bs-row>
    </bs-column>



    </bs-row>

    <bs-row>
    <bs-column xs-8 demo>
    <messages-element
    name="Messages"
    message="one message"
    other = "other attribute">
    Messages Loading ...
    </messages-element>
    </bs-column>

    <bs-column xs-4 demo>
    <pad-element
    name="Pad"
    message="my message"
    other = "other attribute">
    Pad Loading ...
    </pad-element>
    </bs-column>

    </bs-row>

    </bs-container>







    <bs-carousel data-interval="false">

    <bs-carousel-item active>
    <svg class="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Second slide"><title>Placeholder</title><rect width="100%" height="100%" fill="#666"></rect><text x="50%" y="50%" fill="#444" dy=".3em">Second slide</text></svg>

    </bs-carousel-item>
    <bs-carousel-item>
    <svg class="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Second slide"><title>Placeholder</title><rect width="100%" height="100%" fill="#666"></rect><text x="50%" y="50%" fill="#444" dy=".3em">Second slide</text></svg>
    </bs-carousel-item>
    <bs-carousel-item>
    <svg class="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Third slide"><title>Placeholder</title><rect width="100%" height="100%" fill="#555"></rect><text x="50%" y="50%" fill="#333" dy=".3em">Third slide</text></svg>
    </bs-carousel-item>
    <bs-carousel-item>
    <bs-button primary>Primary</bs-button>
    <bs-button secondary>Secondary</bs-button>
    <bs-button success>Success</bs-button>
    <bs-button danger>Danger</bs-button>
    <bs-button warning>Warning</bs-button>
    <bs-button info>Info</bs-button>
    <bs-button light>Light</bs-button>
    <bs-button dark>Dark</bs-button>
    <bs-button link>Link</bs-button>
    </bs-carousel-item>

    <bs-carousel-control-prev slot="control-prev"></bs-carousel-control-prev>
    <bs-carousel-control-next slot="control-next"></bs-carousel-control-next>
    </bs-carousel>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
    https://lit-element-bootstrap.dev/<br>
    https://unpkg.com/@lit-element-bootstrap/carousel
    `;
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }

}
// Register the new element with the browser.
customElements.define('bootstrap-container', BootstrapContainer);
