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
      profile: {type: Object}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.profile = {name:"", friends: []}
    this.ns = new Namespaces()
    this.th = new TripledocHelper()
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


    const friendList = (friends) => html`
    friendList (${friends.length})<br>
    <ul>
    ${friends.map((f) => html`
      <li>
      <button @click=${this.clickFriend} uri=${f} >${f}</button>
      </li>
      `)}
      </ul>
      `;

      return html`
      <h1>${this.name}</h1>
      <p>Name : ${this.profile.name}</p>
      <p> ${friendList(this.profile.friends)}  </p>
      <p>Storage : <button @click=${this.clickFolder} uri=${this.profile.storage} >${this.profile.storage}</button></p>
      `;
    }

    uriChanged(uri){
      console.log(uri)
      this.th.getProfileFromCard(uri).then( p =>{
        console.log(p)
        this.profile = p;
        //  this.name = profile.name;
        //  this.friends = profile.friends;
      },err => {
        console.log(err)
      }

    )
  }

  clickFriend(event) {
    var uri = event.target.getAttribute("uri");
    var message = {action:"updateUriInput", uri:uri}
    this.agent.send('Browser', message);
  }

  clickFolder(event) {
    var uri = event.target.getAttribute("uri");
    var message = {action:"exploreFolder", uri:uri}
    this.agent.send('Explorer', message);
  }

}

// Register the new element with the browser.
customElements.define('tripledoc-profile', TripledocProfile);
