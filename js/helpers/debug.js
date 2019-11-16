//import  '../../libs/solid-file-client.bundle.js';
import {slog} from  './system-messages.js';
//var fileClient = SolidFileClient;


function showFileInConsole(file){
  console.log(file)
}

function showFileInConsole1(file){
  fileClient.readFile(file).then(
    body => {
      console.log(file +" content is : \n\n", body);
    },
    err => {
      console.log(err)
      slog(err)
    });
  }

  export {showFileInConsole}
