// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
import  '../libs/solid-auth-client.bundle.js';
import { slog } from '../js/helpers/system-messages.js';

// Extend the LitElement base class
class SolidLogin extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      logged: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From my-element';
    this.name = "Login"

  }

  firstUpdated(changedProperties) {
    var app = this
    this.agent = new HelloAgent(this.name);
    solid.auth.trackSession(session => {
      if (!session){
        //  this.switchLogButtons(null)
        app.logged = false
        slog("not logged")
        console.log("notlogged")
        //informAllAgents(null)
      }
      else{
        app.logged = true
        //  this.switchLogButtons(session)
        slog("user is "+session.webId)
        console.log("user is "+session.webId)
        //  informAllAgents(session)
      }
    })
  }

  switchLogButtons(session){
    if (session != null){
      $('.not-logged').addClass('d-none')
      $('.logged').removeClass('d-none')
      $('.webid').text(session.webId)
    }else{
      $('.logged').addClass('d-none')
      $('.not-logged').removeClass('d-none')
      $('.webid').text("non connecté")
    }
  }

  informAllAgents(session){
    var webId = session == null ? null : session.webId;
    var allAgents = Object.keys(agentSolidAuth.connections[0].transport.agents);
    console.log(allAgents)
    allAgents.forEach(function (agent){
      agentSolidAuth.send(agent, {webId: webId});
    })
  }


  render() {
    return html`
    ${this.logged ?
      html`<button @click=${this.logout}>Logout</button>`
      : html`<button @click=${this.login}>Login</button>`
    }
    `;
  }

  login(event) {
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', 'Login');
    this.popupLogin();
  }
  logout(event) {
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', 'Logout');
    solid.auth.logout()
    .then(() => alert('Goodbye!'));
  }

  async popupLogin() {
    let session = await solid.auth.currentSession();
    let popupUri = '/dist-popup/popup.html';
    if (!session)
    session = await solid.auth.popupLogin({ popupUri });
  }


}
// Register the new element with the browser.
customElements.define('solid-login', SolidLogin);
