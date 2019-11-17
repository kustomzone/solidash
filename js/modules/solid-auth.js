import  '../../libs/solid-auth-client.bundle.js';
import { slog } from '../helpers/system-messages.js';
import { HelloAgent } from '../agents/HelloAgent.js';

var agentSolidAuth;

async function initSolid(){
  slog("init Solid")
  agentSolidAuth = new HelloAgent('agentSolidAuth');

  // send a message to agent1


  $('.login').click(function(){
    popupLogin();
  });
  $('.logout').click(function(){
    solid.auth.logout()
    .then(() => alert('Goodbye!'));
  });

  solid.auth.trackSession(session => {
    if (!session){
      switchLogButtons(null)
      slog("not logged")
      informAllAgents(null)
    }
    else{
      switchLogButtons(session)
      slog("user is "+session.webId)
      informAllAgents(session)
    }
  })
  //testTBLFriends();
}


async function popupLogin() {
  let session = await solid.auth.currentSession();
  let popupUri = '../../node_modules/solid-auth-client/dist-popup/popup.html';
  if (!session)
  session = await solid.auth.popupLogin({ popupUri });
}

function testTBLFriends(){
  solid.auth.fetch('https://timbl.com/timbl/Public/friends.ttl')
  .then(function(response) {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
      return response.json().then(function(json) {
        console.log(json)
      });
    } else {
      console.log("Oops, nous n'avons pas du JSON!");
      response.text().then(function(text){
        console.log(text)
      })
    }
  });
}

function switchLogButtons(session){
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

function   informAllAgents(session){
  var webId = session == null ? null : session.webId;
  var allAgents = Object.keys(agentSolidAuth.connections[0].transport.agents);
  console.log(allAgents)
  allAgents.forEach(function (agent){
    agentSolidAuth.send(agent, {webId: webId});
  })


}

export {  initSolid };
