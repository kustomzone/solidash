import  '../../vendor/solid-file-client/solid-file-client.bundle.js';
//import {slog} from  './system-messages.js';


export class SolidTool {
  constructor() {
    this.fileClient = SolidFileClient;
    console.log(this.fileClient)
    //this.agent_init()
  }

  async readFolder(url) {
    var folder = await  this.fileClient.readFolder(url).then(folder => {
      //  console.log(`Read ${folder.name}, it has ${folder.files.length} files & ${folder.folders.length} folders .`,folder);
      return folder;
      //  callback? callback(folder) : defaultCallBack(folder)
    }, err => {
      console.log(err);
      alert(err);
      return err
    } );
    console.log("RETURN ",folder)
    return folder;

  }


  async readFile(url) {
    var body =   this.fileClient.readFile(url).then(
      body => {
        console.log(`File content is : ${body}.`);
        return body
        //  callback? callback(body) : defaultCallBack(body)
      }, err => {
        console.log(err);
        alert(err);
        return (err)
      } );
      return body
    }


  }
