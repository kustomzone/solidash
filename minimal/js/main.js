import { initSolid } from '../../js/modules/solid-auth.js';
import { initEve } from '../../js/modules/eve.js';
import { slog } from '../../js/helpers/system-messages.js';
//import { initTripledoc } from './modules/tripledoc.js'

async function init(){

  slog("init main")
  initSolid();
  initEve();
  //initTripledoc();

}

init();
